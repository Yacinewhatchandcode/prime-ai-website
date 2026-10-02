import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = new URL(process.env.QA_BASE_URL || 'http://127.0.0.1:4174');
if (base.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname)) throw new Error('Loopback QA target required');
const output = path.resolve(process.env.QA_OUTPUT || 'qa-evidence/fleet-real');
const create = process.env.QA_CREATE_MISSION === '1';
let missionId = process.env.QA_MISSION_ID;
if (!create && !missionId) throw new Error('Provide QA_MISSION_ID or explicitly authorize one advisory creation with QA_CREATE_MISSION=1');
const goal = process.env.QA_GOAL || 'Give three concise advisory considerations for safely validating a local website and local AI backend. Do not execute tools or claim verification. Keep each role under 100 words.';
await mkdir(output, { recursive: true });
const evidence = { profile: 'Actual localhost backend and Ollama, no API mocks', startedAt: new Date().toISOString(), createdByQA: create, observations: [], pageErrors: [] };
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await context.route('**/*', route => {
  const request = route.request();
  const url = new URL(request.url());
  const mutation = !['GET', 'HEAD'].includes(request.method());
  const allowedCreate = create && request.method() === 'POST' && url.pathname === '/api/local-fleet/missions';
  return url.origin !== base.origin || mutation && !allowedCreate ? route.abort('blockedbyclient') : route.continue();
});
const page = await context.newPage();
page.setDefaultTimeout(15000);
page.on('pageerror', error => evidence.pageErrors.push(error.message));
const read = endpoint => page.evaluate(async endpoint => {
  const response = await fetch(`/api/local-fleet/${endpoint}`, { signal: AbortSignal.timeout(10000) });
  const body = await response.json();
  if (!response.ok || body.error) throw new Error(body.error?.message || String(response.status));
  return body.data;
}, endpoint);
try {
  await page.goto(`${base.origin}/#/fleet-command`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  const panel = page.getByRole('region', { name: 'Local advisory missions' });
  await panel.getByText(/Backend ready/).waitFor();
  evidence.memoryBefore = await read('memory');
  if (create) {
    await panel.getByLabel('Advisory goal').fill(goal);
    await panel.getByRole('button', { name: 'Create local advisory mission' }).click();
    const notice = panel.getByText(/Mission [0-9a-f-]+ accepted as/);
    await notice.waitFor();
    missionId = (await notice.textContent()).match(/Mission ([0-9a-f-]+)/)[1];
  }
  evidence.missionId = missionId;
  const deadline = Date.now() + 390000;
  let record;
  do {
    record = await read(`missions/${missionId}`);
    evidence.observations.push({ at: new Date().toISOString(), status: record.status, steps: record.steps.map(({ role, status, model, error }) => ({ role, status, model, error })) });
    await writeFile(path.join(output, 'report.json'), JSON.stringify(evidence, null, 2));
    if (['completed', 'failed'].includes(record.status)) break;
    if (Date.now() > deadline) throw new Error('Mission did not reach a terminal state within 390 seconds');
    await page.waitForTimeout(3000);
  } while (!['completed', 'failed'].includes(record.status));
  evidence.mission = record;
  evidence.memoryAfter = await read('memory');
  if (record.status !== 'completed') throw new Error(`Actual mission failed: ${record.error?.message || 'unknown error'}`);
  if (record.steps.length !== 3 || record.steps.some(step => step.status !== 'completed' || !step.output || !step.model) || !record.memoryId) {
    throw new Error('Actual mission lacks three completed model outputs or persistent memory reference');
  }
  if (record.acceptanceVerified !== false || record.toolsExecuted !== false) throw new Error('Unexpected execution or acceptance claim');
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.reload();
    await panel.locator('.local-fleet-columns details > summary').first().click();
    const select = panel.locator('.local-mission-list button').filter({ hasText: missionId });
    await select.waitFor();
    await select.click();
    await panel.locator('.local-mission-detail').getByText(missionId, { exact: false }).first().waitFor();
    for (const summary of await panel.locator('.local-role-output details > summary').all()) await summary.click();
    await panel.locator('.local-role-output pre').first().waitFor();
    const outputs = await panel.locator('.local-role-output pre').allTextContents();
    if (outputs.length !== 3 || outputs.some((text, index) => text !== record.steps[index].output)) throw new Error('Reloaded role outputs differ from persisted backend record');
    await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(output, `${viewport.width}.png`), fullPage: true, timeout: 15000 });
  }
  if (evidence.pageErrors.length) throw new Error('Uncaught UI page errors');
  evidence.result = `PASS: actual ${create ? 'UI creation and ' : ''}readback, terminal three-role inference, memory reference and desktop/mobile reload`;
} catch (error) {
  evidence.result = `FAIL: ${error.message}`;
  process.exitCode = 1;
} finally {
  evidence.finishedAt = new Date().toISOString();
  await writeFile(path.join(output, 'report.json'), JSON.stringify(evidence, null, 2));
  await browser.close();
}
console.log(evidence.result);
console.log(`Evidence: ${output}`);
