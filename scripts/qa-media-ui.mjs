import { chromium } from 'playwright';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = new URL(process.env.QA_BASE_URL || 'http://127.0.0.1:4174');
if (base.protocol !== 'http:' || !['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)) throw new Error('Loopback media QA target required');
const output = path.resolve(process.env.QA_OUTPUT || 'qa-evidence/media-upgrade/browser');
await mkdir(output, { recursive: true });
const inventory = JSON.parse(await readFile('qa/routes.json', 'utf8'));
const components = new Set(['Vision', 'Ecosysteme', 'Technologie', 'SovereignAi', 'EnterpriseAiOrchestration', 'MultiAgentSystems', 'Credentials', 'FleetCommand', 'YaceAura']);
const routes = inventory.routes.filter(route => components.has(route.component));
const report = { profile: 'Real built loopback app and all public MP4; reduced-motion manual controls (viewport autoplay verified separately by qa-gold); external requests and all mutations blocked', assets: [], pages: [] };
const browser = await chromium.launch();
const contextFor = async (viewport, language) => {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  context.setDefaultTimeout(10000);
  if (language !== null) await context.addInitScript(language => localStorage.setItem('appLanguage', language), language);
  await context.route('**/*', route => {
    const request = route.request();
    return new URL(request.url()).origin === base.origin && ['GET', 'HEAD'].includes(request.method()) ? route.continue() : route.abort('blockedbyclient');
  });
  return context;
};
const play = video => video.evaluate(async element => {
  await Promise.race([element.play(), new Promise((_, reject) => setTimeout(() => reject(new Error('Playback exceeded 8 seconds')), 8000))]);
});
try {
  const assetContext = await contextFor({ width: 1440, height: 900 }, null);
  const assetPage = await assetContext.newPage();
  await assetPage.setContent('<main><h1>Local MP4 decode and playback</h1><video id="probe" muted playsinline style="width:640px"></video></main>');
  const video = assetPage.locator('#probe');
  for (const file of (await readdir('public')).filter(file => file.endsWith('.mp4')).sort()) {
    const result = { file };
    try {
      await video.evaluate((element, src) => { element.src = src; element.load(); }, new URL(file, base).href);
      await assetPage.waitForFunction(() => document.querySelector('#probe').readyState >= 2);
      await play(video);
      await assetPage.waitForFunction(() => document.querySelector('#probe').currentTime > 0.2);
      result.decoded = await video.evaluate(element => ({ duration: element.duration, width: element.videoWidth, height: element.videoHeight, muted: element.muted, currentTime: element.currentTime }));
      await video.evaluate(element => element.pause());
      result.status = 'PASS';
    } catch (failure) { result.status = 'FAIL'; result.error = failure.message; process.exitCode = 1; }
    report.assets.push(result);
    await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  }
  await assetContext.close();
  for (const language of ['en', 'fr']) {
    const labels = language === 'fr'
      ? { play: "Lire l'explication visuelle", pause: "Mettre l'explication en pause", caption: /sans narration/ }
      : { play: 'Play visual explainer', pause: 'Pause visual explainer', caption: /no narration or soundtrack/i };
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      const context = await contextFor(viewport, language);
      for (const route of routes) {
        const page = await context.newPage();
        const result = { route: route.path, language, viewport, videos: [], errors: [], failedMedia: [], resourceAborts: [] };
        page.on('pageerror', failure => result.errors.push(failure.message));
        page.on('requestfailed', request => {
          if (new URL(request.url()).origin === base.origin && /\.mp4(?:$|\?)/.test(request.url())) {
            const observation = { url: request.url(), error: request.failure()?.errorText };
            (observation.error?.includes('ERR_ABORTED') ? result.resourceAborts : result.failedMedia).push(observation);
          }
        });
        page.on('response', response => {
          if (new URL(response.url()).origin === base.origin && /\.mp4(?:$|\?)/.test(response.url()) && response.status() >= 400) {
            result.failedMedia.push({ url: response.url(), status: response.status() });
          }
        });
        try {
          await page.goto(`${base.origin}/#${route.path}`, { waitUntil: 'domcontentloaded' });
          await page.locator('video').first().waitFor();
          const players = page.locator('.visual-explainer');
          const count = await players.count();
          if (!count || count !== await page.locator('video').count()) throw new Error('A page video bypasses the honest muted player');
          for (let index = 0; index < count; index++) {
            const player = players.nth(index);
            const video = player.locator('video');
            result.phase = `metadata ${index}`;
            await video.scrollIntoViewIfNeeded();
            await page.waitForFunction(element => element.readyState >= 1, await video.elementHandle());
            const state = await video.evaluate(element => ({ src: element.currentSrc, muted: element.muted, controls: element.controls, duration: element.duration }));
            if (!state.muted || state.controls) throw new Error('Video exposes unmute/native audio controls');
            result.phase = `warm playback ${index}`;
            await player.getByText(labels.caption).waitFor();
            if (await video.evaluate(element => element.paused)) await player.getByRole('button', { name: labels.play, exact: true }).click();
            await page.waitForFunction(element => !element.paused && element.currentTime > 0.2 && element.readyState >= 2, await video.elementHandle());
            await player.getByRole('button', { name: labels.pause, exact: true }).click();
            result.phase = `keyboard seek ${index}`;
            const seek = player.locator('input[type="range"]');
            await seek.press('Home');
            await seek.press('ArrowRight');
            const start = Number(await seek.inputValue());
            if (start < 0.09 || Math.abs(await video.evaluate(element => element.currentTime) - start) > 0.2) throw new Error('Keyboard seek control failed');
            await player.getByRole('button', { name: labels.play, exact: true }).focus();
            result.phase = `keyboard play ${index}`;
            await page.keyboard.press('Space');
            await page.waitForFunction(({ element, start }) => !element.paused && element.currentTime > start + 0.2, { element: await video.elementHandle(), start });
            await player.getByRole('button', { name: labels.pause, exact: true }).click();
            if (!(await video.evaluate(element => element.paused))) throw new Error('Pause control failed');
            await video.evaluate(element => { element.currentTime = Math.min(12, element.duration / 2); });
            await page.waitForFunction(element => !element.seeking && element.readyState >= 2, await video.elementHandle());
            result.videos.push({ ...state, keyboardPlayPauseSeek: true });
          }
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
          if (overflow || result.errors.length || result.failedMedia.length) throw new Error('Overflow, page error, or failed same-origin media');
          const screenshot = `${route.path === '/' ? 'home' : route.path.slice(1)}-${language}-${viewport.width}.png`;
          await players.first().screenshot({ path: path.join(output, screenshot), timeout: 15000 });
          result.screenshot = screenshot;
          result.caption = `${route.path} ${language} ${viewport.width}px: actual MP4 decoded, keyboard play/seek/pause, permanently muted visual-only disclosure; cancelled media Range requests recorded separately; no narration fabricated.`;
          result.phase = 'complete';
          result.status = 'PASS';
        } catch (failure) { result.status = 'FAIL'; result.error = failure.message; process.exitCode = 1; }
        report.pages.push(result);
        await page.close();
        await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
        console.log(`${language} ${viewport.width} ${route.path}: ${result.status}`);
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
}
console.log(`Assets ${report.assets.filter(item => item.status === 'PASS').length}/${report.assets.length}; pages ${report.pages.filter(item => item.status === 'PASS').length}/${report.pages.length}`);
