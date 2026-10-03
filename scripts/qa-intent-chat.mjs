import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const origin = process.env.QA_BASE_URL || 'http://127.0.0.1:4186';
const output = process.env.QA_OUTPUT;
if (!output || !['127.0.0.1', 'localhost'].includes(new URL(origin).hostname)) throw new Error('Provide a local origin and QA_OUTPUT directory.');
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const reports = [];
try {
  for (const width of [375, 390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const mutations = [];
    const errors = [];
    page.on('request', request => { if (request.method() === 'POST') mutations.push(new URL(request.url()).pathname); });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${origin}/responsive-preview`, { waitUntil: 'networkidle' });
    const input = page.getByRole('textbox', { name: 'Your message to PRIME' });
    await input.fill('semantic memory');
    assert.equal(await page.locator('.intent-citations article').count(), 0, 'Typing retrieval must be opt-in');
    await page.getByLabel('Local matches while typing').check();
    await page.locator('.intent-citations article').first().waitFor();
    await input.fill('unicorn-wombat-987');
    await page.getByText('No matching local sources for this wording.', { exact: true }).waitFor();
    await input.fill('M4');
    await page.locator('.intent-citations article').filter({ hasText: 'Mac' }).waitFor();
    assert.deepEqual(mutations, [], 'Keystrokes must not submit text or actions');
    assert.equal(await page.getByRole('button', { name: 'Approve mission', exact: true }).isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: 'Open authorized ByteBot view' }).isDisabled(), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, 'Expanded chat must not overflow');
    await page.getByRole('button', { name: 'Collapse conversation panel' }).click();
    assert.equal(await page.locator('.intent-panel').isHidden(), true);
    await page.getByRole('button', { name: 'Expand conversation panel' }).click();
    await page.screenshot({ path: path.join(output, `intent-${width}.png`), fullPage: true });
    assert.deepEqual(errors, []);
    reports.push({ width, mutationsWhileTyping: mutations, errors, overflow: false, backend: await page.locator('.intent-connectivity').textContent() });
    await page.close();
  }
  if (process.env.QA_APPROVE_READ_ONLY === '1') {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(`${origin}/responsive-preview`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Expand conversation panel' }).click();
    if (process.env.QA_GENERATE_LOCAL !== '1') await page.getByRole('checkbox', { name: 'Generate a local-model answer after approval' }).uncheck();
    await page.getByRole('textbox', { name: 'Your message to PRIME' }).fill('Retrieve source facts about sovereign semantic memory. Read-only; do not change files or actuate a desktop.');
    await page.getByRole('button', { name: 'Send message to PRIME' }).click();
    await page.getByRole('button', { name: 'Approve mission', exact: true }).waitFor();
    await page.waitForFunction(() => ![...document.querySelectorAll('button')].find(button => button.textContent === 'Approve mission').disabled);
    await page.getByRole('button', { name: 'Approve mission', exact: true }).click();
    await page.locator('.intent-events li').filter({ hasText: 'completed' }).waitFor({ timeout: 120000 });
    if (process.env.QA_GENERATE_LOCAL === '1') {
      await page.locator('.intent-generated').waitFor();
      assert((await page.locator('.intent-generated').textContent()).length > 0);
    }
    reports.push({ actualReadOnlyMission: true, localGenerationRequested: process.env.QA_GENERATE_LOCAL === '1', generatedCharacters: await page.locator('.intent-generated').count() ? (await page.locator('.intent-generated').textContent()).length : 0, events: await page.locator('.intent-events li strong').allTextContents(), backendFacts: await page.locator('[aria-label="Backend retrieved facts"] article').count() });
    await page.screenshot({ path: path.join(output, 'intent-actual-read-only-mission.png'), fullPage: true });
    await page.getByRole('textbox', { name: 'Your message to PRIME' }).fill('Read-only source retrieval; cancel this mission before approval.');
    await page.getByRole('button', { name: 'Send message to PRIME' }).click();
    await page.waitForFunction(() => !document.querySelector('[aria-label="Stop streamed response"]').disabled);
    await page.getByRole('button', { name: 'Stop streamed response' }).click();
    await page.locator('.intent-events li strong').filter({ hasText: /^cancelled$/ }).waitFor({ timeout: 20000 });
    assert.equal(await page.getByRole('button', { name: 'Approve mission', exact: true }).isDisabled(), true);
    reports.push({ actualPreapprovalCancellation: true, events: await page.locator('.intent-events li strong').allTextContents() });
    await page.close();
  }
  await writeFile(path.join(output, 'report.json'), JSON.stringify(reports, null, 2));
  console.log(JSON.stringify(reports, null, 2));
} finally { await browser.close(); }
