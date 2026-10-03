import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const origin = process.env.QA_BASE_URL || 'http://127.0.0.1:4186';
const output = process.env.QA_OUTPUT;
if (!output) throw new Error('QA_OUTPUT must be an artifact directory.');
const url = new URL(origin);
assert(['localhost', '127.0.0.1'].includes(url.hostname), 'Only loopback QA targets are allowed.');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { origin, capturedAt: new Date().toISOString(), viewports: [], preview: null };
try {
  for (const width of [375, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width > 640 ? 1000 : 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    const failedResources = [];
    const mutations = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith(origin) && response.status() >= 400) failedResources.push(`${response.status()} ${response.url()}`);
    });
    await page.route('**/*', route => {
      const request = route.request();
      if (!['GET', 'HEAD'].includes(request.method())) {
        mutations.push(`${request.method()} ${request.url()}`);
        return route.abort();
      }
      return new URL(request.url()).origin === url.origin ? route.continue() : route.abort();
    });
    await page.goto(`${origin}/replica`, { waitUntil: 'networkidle' });
    await page.locator('.replica-final').scrollIntoViewIfNeeded();
    await page.evaluate(() => Promise.all([...document.images].map(image => image.decode())));
    await page.evaluate(() => window.scrollTo(0, 0));
    const overflow = await page.evaluate(() => ({
      viewport: innerWidth, document: document.documentElement.scrollWidth,
      overflowingElements: [...document.querySelectorAll('main *')].filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width && (rect.right > innerWidth + 1 || rect.left < -1);
      }).map(el => `${el.tagName}.${el.className}`),
    }));
    assert(overflow.document <= width, `Horizontal overflow at ${width}: ${JSON.stringify(overflow)}`);
    assert.deepEqual(overflow.overflowingElements, [], `Overflowing elements at ${width}`);
    assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1);
    assert.equal(await page.locator('main').count(), 1);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.replica-skip').evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#platform').evaluate(el => el === document.activeElement), true);
    await page.evaluate(() => window.scrollTo(0, 0));
    if (width < 640) {
      const toggle = page.getByRole('button', { name: 'Open navigation menu', exact: true });
      await toggle.click();
      const menu = page.getByRole('navigation', { name: 'Mobile navigation', exact: true });
      assert.equal(await menu.getByRole('link').first().evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.getByRole('button', { name: 'Close navigation menu' }).evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Escape');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      await toggle.click();
      await menu.getByRole('link', { name: 'Ecosystem', exact: true }).click();
      assert.equal(await page.locator('#ecosystem').evaluate(el => el === document.activeElement), true);
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    } else {
      await page.getByRole('navigation', { name: 'Primary navigation', exact: true }).getByRole('link', { name: 'Fleet', exact: true }).click();
      assert.equal(await page.locator('#fleet').evaluate(el => el === document.activeElement), true);
    }
    await page.locator('.replica-foundation').first().click();
    await page.getByRole('dialog').waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    assert.equal(await page.locator('.replica-foundation').first().evaluate(el => el === document.activeElement), true);
    await page.getByRole('button', { name: 'Watch Overview', exact: true }).click();
    const video = page.getByRole('dialog').locator('video');
    await video.evaluate(el => el.load());
    await page.waitForFunction(() => document.querySelector('dialog video').readyState >= 1, undefined, { timeout: 20000 });
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Mac', exact: false }).click();
    await page.getByRole('dialog').getByRole('heading', { name: 'Mac', exact: true }).waitFor();
    await page.keyboard.press('Escape');
    await page.locator('.replica-header-deploy').isVisible().then(async visible => {
      if (visible) await page.locator('.replica-header-deploy').click();
      else await page.locator('.replica-hero-buttons > button').first().click();
    });
    await page.getByRole('dialog').getByRole('button', { name: 'Briefing', exact: true }).click();
    assert.equal(await page.getByRole('textbox', { name: 'Your email address' }).evaluate(el => el === document.activeElement), true);
    await page.getByRole('textbox', { name: 'Your email address' }).fill('demo@example.test');
    await page.getByRole('button', { name: 'Subscribe', exact: true }).click();
    assert.match(await page.getByRole('status').textContent(), /not stored or sent/);
    assert.deepEqual(mutations, [], 'Signup must not send data.');
    await page.getByRole('button', { name: 'Français', exact: true }).click();
    await page.getByRole('heading', { level: 1 }).filter({ hasText: 'L’intelligence.' }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.lang), 'fr');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, 'French overflow');
    await page.getByRole('button', { name: 'English', exact: true }).click();
    await page.locator('body').click({ position: { x: 1, y: 1 } });
    await page.evaluate(() => window.scrollTo(0, 0));
    const screenshot = path.join(output, `replica-${width}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    assert.deepEqual(errors, [], 'No page errors');
    assert.deepEqual(failedResources, [], 'No missing local resources');
    report.viewports.push({ width, overflow, errors, failedResources, mutations, screenshot, checks: ['decoded artwork', 'skip link', 'navigation focus', 'menu Escape/focus', 'dialog Escape/focus', 'local video metadata', 'platform dialog', 'CTA focus', 'local signup', 'French translation'] });
    await context.close();
  }
  const page = await browser.newPage({ viewport: { width: 1600, height: 1080 }, reducedMotion: 'reduce' });
  await page.goto(`${origin}/responsive-preview`, { waitUntil: 'networkidle' });
  for (const frame of page.frames().slice(1)) await frame.getByRole('heading', { level: 1 }).waitFor();
  assert.equal(page.frames().length, 3);
  const sizes = await Promise.all(page.frames().slice(1).map(frame => frame.evaluate(() => ({ width: innerWidth, overflow: document.documentElement.scrollWidth }))));
  assert.deepEqual(sizes, [{ width: 1440, overflow: 1440 }, { width: 390, overflow: 390 }]);
  await page.screenshot({ path: path.join(output, 'desktop-mobile-together.png'), fullPage: true });
  await page.getByRole('combobox', { name: /Mobile/ }).selectOption('375');
  await page.waitForFunction(() => document.querySelectorAll('iframe')[1].contentWindow.innerWidth === 375);
  await page.getByRole('button', { name: 'Reset both' }).click();
  for (const frame of page.frames().slice(1)) await frame.getByRole('heading', { level: 1 }).waitFor();
  assert.equal(await page.frames()[2].evaluate(() => innerWidth), 375);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
  report.preview = { sizes, controls: '375/390 selection and iframe reset pass', narrowPreview: '390px without overflow', screenshot: path.join(output, 'desktop-mobile-together.png') };
  await page.goto(`${origin}/`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 1 }).filter({ hasText: 'Intelligence.' }).waitFor();
  assert.equal(await page.locator('.prime-replica').count(), 1, 'White replica must be the default homepage');
  await page.goto(`${origin}/semantic-library`, { waitUntil: 'networkidle' });
  await page.getByRole('status').filter({ hasText: '24 matching records' }).waitFor();
  const search = page.getByRole('searchbox', { name: 'Search semantic keywords' });
  await search.fill('mémoire');
  await page.getByRole('heading', { name: 'Memory', exact: true }).waitFor();
  await search.fill('unicorn-wombat-987');
  await page.getByText('No indexed content matches this query.', { exact: false }).waitFor();
  await search.fill('M4');
  await page.getByRole('heading', { name: 'Mac', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390, 'Library mobile overflow');
  await page.screenshot({ path: path.join(output, 'keyword-library-mobile.png'), fullPage: true });
  await page.goto(`${origin}/replica-image`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Desktop + mobile', exact: true }).waitFor();
  await page.locator('figure img').evaluate(image => image.decode());
  assert.equal(await page.locator('figure img').getAttribute('src'), '/replica-exports/prime-ai-complete-paired.png');
  await page.getByRole('button', { name: 'Full desktop', exact: true }).click();
  await page.locator('figure img').evaluate(image => image.decode());
  assert.equal(await page.locator('figure img').getAttribute('src'), '/replica-exports/prime-ai-full-1440.png');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390, 'Image gallery mobile overflow');
  const imageManifest = await (await page.request.get(`${origin}/replica-exports/manifest.json`)).json();
  assert.equal(imageManifest.images.length, 2);
  assert.equal(imageManifest.images[0].pixelWidth, 2880);
  assert.equal(imageManifest.images[1].pixelWidth, 780);
  report.upgrade = {
    defaultHomepage: 'White replica',
    retrieval: '24 evidence-backed records; accented memory alias, M4 and empty-result checks pass',
    fullImage: imageManifest,
  };
  await page.goto(`${origin}/legacy/#/`, { waitUntil: 'networkidle' });
  await page.locator('.sg-shell').waitFor();
  assert.equal(await page.locator('.prime-replica').count(), 0, 'Gold workspace preserved separately');
  report.upgrade.legacyWorkspace = 'Existing Gold hash routes preserved';
  await page.close();
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
