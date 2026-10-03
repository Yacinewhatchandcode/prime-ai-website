import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const origin = process.env.QA_BASE_URL || 'http://127.0.0.1:4186';
if (!['localhost', '127.0.0.1'].includes(new URL(origin).hostname)) throw new Error('Image export only supports loopback origins.');
const output = 'public/replica-exports';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const images = [];
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 1440 ? 1000 : 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.route('**/*', route => {
      const request = route.request();
      return request.method() === 'GET' && new URL(request.url()).origin === new URL(origin).origin ? route.continue() : route.abort();
    });
    await page.goto(`${origin}/replica`, { waitUntil: 'networkidle' });
    await page.locator('.replica-final').scrollIntoViewIfNeeded();
    await page.evaluate(() => Promise.all([...document.images].map(image => image.decode())));
    await page.evaluate(() => { document.activeElement.blur(); window.scrollTo(0, 0); });
    const dimensions = await page.evaluate(() => ({ width: innerWidth, height: document.documentElement.scrollHeight }));
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Cannot export an overflowing layout.');
    const filename = `prime-ai-full-${width}.png`;
    const bytes = await page.screenshot({ path: path.join(output, filename), fullPage: true });
    images.push({
      filename, label: width === 1440 ? 'Full desktop replica' : 'Full mobile replica',
      viewport: dimensions, pixelWidth: dimensions.width * 2, pixelHeight: dimensions.height * 2,
      sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length,
    });
    await context.close();
  }
  await writeFile(path.join(output, 'manifest.json'), JSON.stringify({
    generatedAt: new Date().toISOString(), renderer: 'Chromium / Playwright',
    source: '/replica', scaleFactor: 2, images,
    limitation: 'Exact captures of the rendered local implementation, not a claim of pixel-identical matching to the original artwork. Reference illustration resolution is unchanged.',
  }, null, 2));
  console.log('Exported complete desktop and mobile page images at 2× device scale.');
} finally {
  await browser.close();
}
