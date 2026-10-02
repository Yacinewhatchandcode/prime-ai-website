import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import http from 'node:http';
import { mkdtemp, writeFile, rm, mkdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createPreview } from './local-preview.mjs';

const listen = server => new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(`http://127.0.0.1:${server.address().port}`)));
const close = server => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); });

test('built UI against an explicitly synthetic localhost contract fixture', { timeout: 60000 }, async t => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'prime-ui-'));
  await writeFile(path.join(temp, 'token'), 'fixture-token-server-only');
  const missions = [];
  const backend = http.createServer(async (req, res) => {
    if (req.url !== '/api/health' && req.headers.authorization !== 'Bearer fixture-token-server-only') {
      res.writeHead(401); return res.end();
    }
    let data;
    if (req.url === '/api/health') data = { service: 'prime-local-fleet', ready: true, storageError: null };
    else if (req.url === '/api/status') data = { runtime: { ready: true, inference: { status: 'ready', model: 'TEST FIXTURE ONLY' } }, roles: ['planner', 'analyst', 'reviewer'] };
    else if (req.url === '/api/memory') data = { backend: 'filesystem', counts: { missions: missions.length } };
    else if (req.url === '/api/missions' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const mission = { id: randomUUID(), goal: JSON.parse(body).goal, status: 'queued', createdAt: new Date().toISOString(), memoryId: null, toolsExecuted: false, acceptanceVerified: false, error: null,
        steps: ['planner', 'analyst', 'reviewer'].map(role => ({ role, status: 'queued', model: null, output: null, error: null })) };
      missions.unshift(mission);
      setTimeout(() => {
        mission.status = 'completed';
        mission.memoryId = 'fixture-memory-id';
        for (const step of mission.steps) { step.status = 'completed'; step.model = 'TEST FIXTURE ONLY'; step.output = `${step.role}: synthetic contract output, not actual inference`; }
      }, 400);
      data = mission;
    } else if (req.url === '/api/missions') data = missions;
    else data = missions.find(mission => `/api/missions/${mission.id}` === req.url);
    res.writeHead(req.method === 'POST' ? 202 : 200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data }));
  });
  const upstream = await listen(backend);
  const preview = await createPreview({ backend: upstream, tokenFile: path.join(temp, 'token') });
  const base = await listen(preview);
  const browser = await chromium.launch();
  await mkdir('qa-evidence/fleet-contract', { recursive: true });
  t.after(async () => { await browser.close(); await close(preview); await close(backend); await rm(temp, { recursive: true }); });
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await t.test(`mission submission, polling and reload ${viewport.width}`, async () => {
      const context = await browser.newContext({ viewport });
      await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}/#/fleet-command`);
      const section = page.getByRole('region', { name: 'Local advisory missions' });
      await section.getByText(/Backend ready/).waitFor();
      await section.getByLabel('Advisory goal').fill(`Fixture pipeline ${viewport.width}`);
      await section.getByRole('button', { name: 'Create local advisory mission' }).click();
      await section.getByText(/accepted as queued/).waitFor();
      await section.locator('.local-mission-detail').getByText('completed', { exact: true }).waitFor({ timeout: 15000 });
      assert.equal(await section.locator('.local-role-output pre').count(), 3);
      assert.equal(await section.locator('.local-memory-counts dd').textContent(), String(missions.length));
      await page.reload();
      await section.locator('.local-mission-context summary').click();
      await section.getByText(`Fixture pipeline ${viewport.width}`, { exact: true }).last().waitFor();
      assert.equal(await page.locator('main').count(), 1);
      assert.deepEqual(errors, []);
      assert.equal(await page.evaluate(() => document.body.innerText.includes('fixture-token-server-only')), false);
      assert.equal(await page.locator('.sovereign-workflow-log-sidebar,.sovereign-command-bar-wrapper').count(), 0);
      await page.screenshot({ path: `qa-evidence/fleet-contract/${viewport.width}.png`, fullPage: true });
      await context.close();
    });
  }
  await t.test('failed role is shown without fabricating completion', async () => {
    const mission = missions[0];
    mission.status = 'failed';
    mission.error = { code: 'INFERENCE_FAILED', message: 'Synthetic inference failure for contract test' };
    mission.steps[0].status = 'failed';
    mission.steps[0].output = null;
    mission.steps[0].error = mission.error;
    const page = await browser.newPage();
    await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    await page.goto(`${base}/#/fleet-command`);
    await page.locator('.local-mission-detail').getByText('failed', { exact: true }).waitFor();
    assert.equal(await page.locator('.local-role-output').first().locator('pre').count(), 0);
    await page.getByText('INFERENCE_FAILED: Synthetic inference failure for contract test').first().waitFor();
    await page.close();
  });
  await t.test('offline backend is an explicit error, not simulated readiness', async () => {
    await close(backend);
    const page = await browser.newPage();
    await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    await page.goto(`${base}/#/fleet-command`);
    await page.getByText(/Local fleet unavailable:/).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Create local advisory mission' }).isDisabled(), true);
    await page.close();
  });
  await writeFile('qa-evidence/fleet-contract/coverage.json', JSON.stringify({ profile: 'Synthetic localhost HTTP contract fixture; not real Ollama inference', viewports: [1440, 390], checks: ['submit', 'queued-to-completed polling', 'three outputs', 'memory count', 'reload', 'failed role', 'unavailable state', 'no synthetic overlay'] }, null, 2));
});
