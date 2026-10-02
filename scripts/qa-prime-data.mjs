import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseData, sealData } from '../src/utils/primeData.js';

const base = new URL(process.env.QA_BASE_URL || 'http://127.0.0.1:4174');
if (base.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname)) throw new Error('Loopback target required');
const output = path.resolve(process.env.QA_OUTPUT || 'qa-evidence/prime-data');
const runMission = process.env.QA_RUN_ADVISORY === '1';
const bounded = async (operation, label) => {
  let timer;
  try {
    return await Promise.race([operation, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} exceeded 30 seconds`)), 30000);
    })]);
  } finally { clearTimeout(timer); }
};
await mkdir(output, { recursive: true });
const report = { startedAt: new Date().toISOString(), profile: 'Real built app, isolated browser storage, manual file transfer; no workspace or API mocks', results: [] };
const browser = await chromium.launch();
const make = async viewport => {
  const context = await browser.newContext({ viewport, acceptDownloads: true });
  await context.addInitScript(() => {
    localStorage.setItem('appLanguage', 'en');
    if (!sessionStorage.getItem('prime-qa-seeded')) {
      sessionStorage.setItem('prime-qa-seeded', '1');
      window.primeQAOldCache = caches.open('prime-shell-obsolete-qa');
    }
  });
  await context.route('**/*', route => {
    const request = route.request();
    const url = new URL(request.url());
    return url.origin !== base.origin || !['GET', 'HEAD'].includes(request.method()) && !(runMission && url.pathname === '/api/local-fleet/missions')
      ? route.abort('blockedbyclient') : route.continue();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${base.origin}/#/ecosysteme`, { waitUntil: 'domcontentloaded' });
  const panel = page.getByRole('region', { name: 'Your free Prime-AI data workspace' });
  await panel.getByText(/IndexedDB/).waitFor();
  return { context, page, panel, errors };
};
const saveGoal = async (panel, title) => {
  await panel.getByLabel('Goal', { exact: true }).fill(title);
  await panel.getByRole('button', { name: 'Save goal', exact: true }).click();
  await panel.getByText('Saved in this browser.', { exact: true }).waitFor();
};
const exportFile = async ({ page, panel }) => {
  const event = page.waitForEvent('download');
  await panel.getByRole('button', { name: 'Export Prime-AI file' }).click();
  const download = await event;
  const failure = await bounded(download.failure(), 'Export download');
  if (failure) throw new Error(`Export download failed: ${failure}`);
  const buffer = await readFile(await bounded(download.path(), 'Export file'));
  await parseData(buffer.toString());
  return buffer;
};
const importFile = async ({ panel }, buffer) => {
  await panel.getByLabel('Import Prime-AI file', { exact: true }).setInputFiles({ name: 'workspace.primeai.json', mimeType: 'application/json', buffer });
  await panel.getByRole('button', { name: 'Confirm merge' }).waitFor();
  await panel.getByRole('button', { name: 'Confirm merge' }).click();
  await panel.getByText('Import merged and saved in this browser.', { exact: true }).waitFor();
};
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const result = { viewport, checks: [] };
    const checkpoint = async phase => {
      result.phase = phase;
      await writeFile(path.join(output, 'progress.json'), JSON.stringify({ viewport, phase, checks: result.checks }, null, 2));
      console.log(`${viewport.width}: ${phase}`);
    };
    let sender, receiver;
    try {
      sender = await make(viewport);
      await checkpoint('creating local workspace');
      const title = runMission && viewport.width === 1440
        ? 'Free local advisory QA: each role reply in three words only. No research, tools or execution.'
        : `Free local goal ${viewport.width}`;
      await saveGoal(sender.panel, title);
      await sender.panel.getByLabel('Goal for task').selectOption({ label: title });
      await sender.panel.getByLabel('Task', { exact: true }).fill('Offline task');
      await sender.panel.getByRole('button', { name: 'Save task', exact: true }).click();
      await sender.panel.locator('.portable-task-row select').selectOption('doing');
      await sender.panel.getByRole('button', { name: 'Edit task', exact: true }).click();
      await sender.panel.getByLabel('Task', { exact: true }).fill('Edited offline task');
      await sender.panel.getByRole('button', { name: 'Update task', exact: true }).click();
      await sender.panel.getByLabel('Workspace notes').fill('Private free notes retained locally');
      await sender.panel.getByRole('button', { name: 'Save notes', exact: true }).click();
      await sender.panel.getByText('Saved in this browser.', { exact: true }).waitFor();
      await sender.page.reload();
      await sender.panel.getByRole('heading', { name: title, exact: true }).waitFor();
      if (await sender.panel.getByLabel('Workspace notes').inputValue() !== 'Private free notes retained locally') throw new Error('Notes lost after reload');
      if (await sender.panel.locator('.portable-task-row select').inputValue() !== 'doing') throw new Error('Task status lost after reload');
      result.checks.push('create/edit goal/task/notes persisted after reload');
      await checkpoint('durable local reload confirmed');
      if (runMission && viewport.width === 1440) {
        await sender.panel.getByRole('button', { name: 'Run advisory mission' }).click();
        await Promise.race([
          sender.panel.getByText('Real advisory mission completed and attached. No tools executed or acceptance verified.', { exact: true }).waitFor({ timeout: 390000 }),
          sender.panel.getByRole('alert').waitFor({ timeout: 390000 }).then(async () => {
            throw new Error(`Advisory workspace error: ${await sender.panel.getByRole('alert').innerText()}`);
          }),
        ]);
        result.checks.push('actual local three-role advisory mission attached');
      }
      const buffer = await exportFile(sender);
      await checkpoint('export downloaded');
      const exported = await parseData(buffer.toString());
      await writeFile(path.join(output, `${viewport.width}-export.primeai.json`), buffer);
      result.exported = { file: `${viewport.width}-export.primeai.json`, bytes: buffer.length, checksum: exported.checksum, goalIds: exported.workspace.goals.map(goal => goal.id), missionIds: exported.missions.map(mission => mission.id) };
      if (runMission && viewport.width === 1440) {
        if (exported.missions.length !== 1 || exported.missions[0].record.status !== 'completed') throw new Error('Actual completed mission missing from export');
        await sender.page.reload();
        await sender.panel.locator('.portable-goals details > summary').first().click();
        for (const role of ['planner', 'analyst', 'reviewer']) await sender.panel.getByRole('heading', { name: `${role} · completed`, exact: true }).waitFor();
        result.checks.push('actual advisory role outputs and snapshot survive reload/export');
      }
      const targetViewport = viewport.width === 1440 ? { width: 390, height: 844 } : { width: 1440, height: 900 };
      receiver = await make(targetViewport);
      await importFile(receiver, buffer);
      await checkpoint('fresh profile import confirmed');
      await receiver.panel.getByRole('heading', { name: title, exact: true }).waitFor();
      if (await receiver.panel.locator('.portable-task-row select').inputValue() !== 'doing') throw new Error('Transferred task status mismatch');
      result.checks.push(`download file and import into fresh ${targetViewport.width}px browser profile`);
      await receiver.panel.getByRole('button', { name: 'Edit goal', exact: true }).click();
      await receiver.panel.getByLabel('Goal', { exact: true }).fill(`${title} receiver revision`);
      await receiver.panel.getByRole('button', { name: 'Update goal', exact: true }).click();
      await receiver.panel.getByText('Saved in this browser.', { exact: true }).waitFor();
      await importFile(receiver, buffer);
      await receiver.panel.getByRole('heading', { name: `${title} receiver revision`, exact: true }).waitFor();
      await receiver.panel.locator('.portable-conflicts').waitFor();
      result.checks.push('older import preserves latest goal and lists losing revision conflict');
      await checkpoint('deterministic conflicts confirmed');
      const tampered = structuredClone(exported);
      tampered.checksum = '0'.repeat(64);
      await receiver.panel.getByLabel('Import Prime-AI file', { exact: true }).setInputFiles({ name: 'bad.primeai.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(tampered)) });
      await receiver.panel.getByRole('alert').filter({ hasText: /checksum mismatch/ }).waitFor();
      result.checks.push('tampered checksum rejected without replacing workspace');
      await receiver.page.evaluate(async () => {
        await Promise.race([navigator.serviceWorker.ready, new Promise((_, reject) => setTimeout(() => reject(new Error('Offline shell installation timed out')), 15000))]);
      });
      await receiver.page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
      const cacheNames = await receiver.page.evaluate(() => caches.keys());
      if (cacheNames.includes('prime-shell-obsolete-qa')) throw new Error('Obsolete app-shell cache not removed on activation');
      result.checks.push('service-worker activation removes obsolete shell cache');
      const cachedURLs = await receiver.page.evaluate(async () => {
        const lists = [];
        for (const key of await caches.keys()) if (key.startsWith('prime-shell-')) lists.push(...(await (await caches.open(key)).keys()).map(request => request.url));
        return lists;
      });
      if (cachedURLs.some(url => /\/api\/|\.(mp4|webm|mov|mp3|wav)(?:$|[?#])/i.test(url))) throw new Error('API or media cached in offline shell');
      result.cachedURLs = cachedURLs;
      await checkpoint('offline shell installed');
      await receiver.context.setOffline(true);
      await receiver.page.reload({ waitUntil: 'domcontentloaded' });
      await receiver.panel.getByRole('heading', { name: `${title} receiver revision`, exact: true }).waitFor();
      await receiver.panel.getByText('Local fleet unavailable on this device. Free notes and tasks still work.', { exact: true }).waitFor();
      if (!(await receiver.panel.getByRole('button', { name: 'Run advisory mission' }).isDisabled())) throw new Error('Offline advisory execution falsely available');
      await receiver.panel.getByLabel('Workspace notes').fill('Offline edit persisted');
      await receiver.panel.getByRole('button', { name: 'Save notes', exact: true }).click();
      await receiver.panel.getByText('Saved in this browser.', { exact: true }).waitFor();
      await receiver.page.reload({ waitUntil: 'domcontentloaded' });
      await receiver.panel.getByRole('heading', { name: `${title} receiver revision`, exact: true }).waitFor();
      if (await receiver.panel.getByLabel('Workspace notes').inputValue() !== 'Offline edit persisted') throw new Error('Offline edit lost on reload');
      result.checks.push('service-worker app shell offline reload and offline edit/reload; APIs/media excluded');
      await checkpoint('offline edit and reload confirmed');
      const overflow = await receiver.panel.evaluate(element => element.scrollWidth > element.clientWidth + 2 || element.getBoundingClientRect().right > innerWidth + 2);
      if (overflow) throw new Error('Workspace overflows viewport');
      if (sender.errors.length || receiver.errors.length) throw new Error(`Page errors: ${[...sender.errors, ...receiver.errors].join(', ')}`);
      await receiver.panel.screenshot({ path: path.join(output, `${viewport.width}-transfer-offline.png`), timeout: 15000 });
      result.screenshot = {
        file: `${viewport.width}-transfer-offline.png`,
        caption: `Real ${viewport.width}px sender to ${targetViewport.width}px receiver: transferred goal/task, reviewed conflicts and persisted offline edit; original UI retained.`,
      };
      result.checks.push('desktop/mobile workspace no overflow or uncaught page errors');
      // A merged export remains schema-valid and contains every transferred task.
      const mergedBuffer = await exportFile(receiver);
      const merged = await parseData(mergedBuffer.toString());
      if (merged.workspace.tasks.length !== exported.workspace.tasks.length) throw new Error('Transfer silently dropped tasks');
      await sealData(merged);
      await writeFile(path.join(output, `${viewport.width}-merged.primeai.json`), mergedBuffer);
      result.merged = { file: `${viewport.width}-merged.primeai.json`, bytes: mergedBuffer.length, checksum: merged.checksum };
      result.status = 'PASS';
    } catch (error) {
      result.status = 'FAIL';
      result.error = error.message;
      result.alerts = sender ? await sender.panel.getByRole('alert').allTextContents() : [];
      if (sender) await sender.panel.screenshot({ path: path.join(output, `${viewport.width}-failure.png`), timeout: 15000 }).catch(failure => { result.screenshotError = failure.message; });
      process.exitCode = 1;
    } finally {
      await sender?.context.close();
      await receiver?.context.close();
      report.results.push(result);
      await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    }
    console.log(`${viewport.width}: ${result.status}${result.error ? ` ${result.error}` : ''}`);
  }
} finally {
  await browser.close();
  report.finishedAt = new Date().toISOString();
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
}
