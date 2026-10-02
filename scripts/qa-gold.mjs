import assert from 'node:assert/strict';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { goldPages } from '../src/utils/goldPages.js';

const inventory = JSON.parse(await readFile('qa/routes.json', 'utf8'));
assert.deepEqual(Object.keys(goldPages).sort(), inventory.routes.map(route => route.path).sort());
for (const item of Object.values(goldPages)) {
  for (const language of ['en', 'fr']) {
    const words = value => [...new Intl.Segmenter(language, { granularity: 'word' }).segment(value)].filter(word => word.isWordLike).length;
    assert.ok(words(item[language][0]) <= 8);
    assert.ok(words(item[language][1]) <= 14);
    for (const stem of item.media) await access(`public/prime_${stem}_${language}.mp4`);
  }
}
const tokens = await readFile('src/styles/sovereign-gold-tokens.css', 'utf8');
for (const signature of ['--sg-bg:#000000', '--sg-gold:#d4af37', '--sg-radius:18px', '--sg-radius-lg:28px', '--sg-dur:420ms', '--sg-ease:cubic-bezier(.2,.8,.2,1)']) assert.ok(tokens.includes(signature));
const base = new URL(process.env.QA_BASE_URL || 'http://127.0.0.1:4174');
assert.ok(base.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname));
const output = 'qa-evidence/sovereign-gold';
await mkdir(output, { recursive: true });
const report = { coverage: 'Chromium actual local build; no mocks or mutations; desktop/mobile, both motion preferences; full route matrix and word counts are separate evidence.', results: [] };
const browser = await chromium.launch();
try {
  for (const width of [1440, 768, 390]) {
    for (const reducedMotion of ['reduce', 'no-preference']) {
      const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion });
      await context.route('**/*', route => {
        const request = route.request();
        return new URL(request.url()).origin === base.origin && ['GET', 'HEAD'].includes(request.method()) ? route.continue() : route.abort('blockedbyclient');
      });
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      page.setDefaultNavigationTimeout(15000);
      for (const route of ['/', '/ecosysteme', '/fleet-command']) {
        const result = { route, width, reducedMotion, errors: [] };
        const onError = error => result.errors.push(error.message);
        page.on('pageerror', onError);
        try {
          await page.goto(`${base.origin}/#${route}`, { waitUntil: 'domcontentloaded' });
          await page.locator('.sg-shell').waitFor();
          await page.waitForTimeout(300);
          result.structure = await page.evaluate(() => {
            const scene = document.querySelector('.sg-hero .sg-scene').getBoundingClientRect();
            const root = getComputedStyle(document.documentElement);
            return {
              headerHeight: document.querySelector('.sg-header').getBoundingClientRect().height,
              navItems: document.querySelector('.sg-nav').children.length,
              bg: root.getPropertyValue('--sg-bg').trim(), gold: root.getPropertyValue('--sg-gold').trim(),
              visualAboveFold: scene.top >= 64 && scene.bottom <= innerHeight && scene.width >= 100,
              mainCount: document.querySelectorAll('main').length, h1Count: document.querySelectorAll('h1').length,
              overflow: document.documentElement.scrollWidth > innerWidth + 2,
            };
          });
          assert.equal(result.structure.headerHeight, 64);
          assert.equal(result.structure.navItems, 6);
          assert.ok(['#000000', '#000'].includes(result.structure.bg));
          assert.equal(result.structure.gold, '#d4af37');
          assert.equal(result.structure.visualAboveFold, true);
          assert.equal(result.structure.mainCount, 1);
          assert.equal(result.structure.h1Count, 1);
          assert.equal(result.structure.overflow, false);
          const navigation = page.getByRole('navigation', { name: 'Primary navigation', exact: true });
          for (const label of ['Home', 'Tech', 'Workspace', 'Fleet', 'Memory']) assert.equal(await navigation.getByRole('link', { name: label, exact: true }).count(), 1);
          result.contrast = await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const rgb = color => {
              context.clearRect(0, 0, 1, 1); context.fillStyle = color; context.fillRect(0, 0, 1, 1);
              return [...context.getImageData(0, 0, 1, 1).data];
            };
            const luminance = channels => channels.slice(0, 3).map(value => {
              const c = value / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
            }).reduce((sum, c, index) => sum + c * [0.2126, 0.7152, 0.0722][index], 0);
            return [...document.querySelectorAll('.sg-hero h1,.sg-subline,.sg-card h2,.sg-card p,.portable-workspace label,.portable-hint')].map(element => {
              let background = [0, 0, 0, 255];
              for (let parent = element; parent; parent = parent.parentElement) {
                const color = rgb(getComputedStyle(parent).backgroundColor);
                if (color[3] === 255) { background = color; break; }
              }
              const text = luminance(rgb(getComputedStyle(element).color)), surface = luminance(background);
              return { text: element.textContent.slice(0, 50), ratio: (Math.max(text, surface) + 0.05) / (Math.min(text, surface) + 0.05) };
            });
          });
          assert.ok(result.contrast.every(item => item.ratio >= 4.5));
          const card = page.locator('.sg-card').first();
          await card.scrollIntoViewIfNeeded();
          const box = await card.boundingBox();
          await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.4);
          await page.waitForTimeout(500);
          result.cardTransform = await card.evaluate(element => getComputedStyle(element).transform);
          assert.equal(result.cardTransform === 'none', reducedMotion === 'reduce');
          const video = page.locator('.visual-explainer video').first();
          await video.scrollIntoViewIfNeeded();
          if (reducedMotion === 'reduce') {
            await page.waitForTimeout(500);
            assert.equal(await video.evaluate(element => element.paused), true);
            const player = page.locator('.visual-explainer').first();
            await player.getByRole('button', { name: 'Play visual explainer', exact: true }).click();
            await page.waitForFunction(element => !element.paused && element.currentTime > 0.2, await video.elementHandle());
            await player.getByRole('button', { name: 'Pause visual explainer', exact: true }).click();
            result.reducedMotionManualPlay = true;
          } else {
            await page.waitForFunction(element => !element.paused && element.currentTime > 0.2, await video.elementHandle());
          }
          result.media = await video.evaluate(element => ({ paused: element.paused, muted: element.muted, inline: element.playsInline, poster: element.poster, nativeAutoplay: element.autoplay }));
          assert.equal(result.media.muted, true);
          assert.equal(result.media.inline, true);
          assert.ok(result.media.poster.endsWith('/pwa-512.png'));
          assert.equal(result.media.nativeAutoplay, false);
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForFunction(element => element.paused, await video.elementHandle());
          result.offscreenPaused = true;
          await page.locator('.sg-original > summary').click();
          await page.frameLocator('.sg-original iframe').locator('main').waitFor();
          assert.equal(await page.frameLocator('.sg-original iframe').locator('h1').count(), 1);
          result.originalPreviewRetained = true;
          await page.locator('.sg-original > summary').click();
          await page.locator('.sg-original iframe').waitFor({ state: 'detached' });
          assert.equal(await page.locator('.sg-original iframe').count(), 0);
          assert.deepEqual(result.errors, []);
          result.status = 'PASS';
        } catch (failure) { result.status = 'FAIL'; result.error = failure.message; process.exitCode = 1; }
        page.off('pageerror', onError);
        report.results.push(result);
        await writeFile(`${output}/design-report.json`, JSON.stringify(report, null, 2));
        console.log(`${width} ${reducedMotion} ${route}: ${result.status}`);
      }
      await context.close();
    }
  }
} finally { await browser.close(); }
console.log(`Design ${report.results.filter(item => item.status === 'PASS').length}/${report.results.length}`);
