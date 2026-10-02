import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { inventory } from './qa-routes.mjs';

const base = new URL(process.env.QA_BASE_URL || 'http://127.0.0.1:4174');
if (!['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname) || base.protocol !== 'http:') {
  throw new Error('QA_BASE_URL must be an HTTP loopback URL; production traffic is forbidden.');
}
const output = path.resolve(process.env.QA_OUTPUT || 'qa-evidence/latest');
const language = process.env.QA_LANGUAGE || 'en';
if (!['en', 'fr'].includes(language)) throw new Error('QA_LANGUAGE must be en or fr');
const staticFallback = process.env.QA_STATIC_FALLBACK === '1';
const localFleet = process.env.QA_LOCAL_FLEET === '1';
if (staticFallback) {
  const response = await fetch(new URL('/api/state', base), { signal: AbortSignal.timeout(5000) });
  if (!response.headers.get('content-type')?.includes('text/html')) {
    throw new Error('Static fallback profile requires an isolated static preview, not an API server.');
  }
}
const manifest = await inventory();
const selected = process.env.QA_ROUTES?.split(',');
if (selected?.some(route => !manifest.routes.some(item => item.path === route))) {
  throw new Error('QA_ROUTES contains unknown routes');
}
await mkdir(path.join(output, 'screenshots'), { recursive: true });
await writeFile(path.join(output, 'routes.json'), JSON.stringify(manifest, null, 2));
const report = {
  schemaVersion: 1, startedAt: new Date().toISOString(), baseURL: base.href,
  language,
  apiProfile: localFleet ? 'Actual same-origin local-fleet GET endpoints; all mutations blocked; no API mocks' : staticFallback ? 'Unmocked static-preview HTML fallback; same-origin API GET allowed; no backend' : 'Integrations blocked; no API mocks',
  coverage: 'Chromium desktop 1440x900 and mobile 390x844; safe navigation and keyboard only. No backend acceptance, submissions, deployment, wallet transactions or external crawling. External fonts blocked: screenshots use fallback fonts.',
  routes: manifest.routes, results: [],
};
const browser = await chromium.launch();
try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
    for (const route of manifest.routes.filter(item => !selected || selected.includes(item.path))) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce', serviceWorkers: 'block' });
      await context.addInitScript(value => localStorage.setItem('appLanguage', value), language);
      const result = { route: route.path, viewport: viewport.name, consoleErrors: [], pageErrors: [], failedResources: [], resourceAborts: [], blockedRequests: [], issues: [] };
      await context.route('**/*', async requestRoute => {
        const request = requestRoute.request();
        const url = new URL(request.url());
        const allowedAPI = staticFallback || localFleet && url.pathname.startsWith('/api/local-fleet/');
        if (url.origin !== base.origin || (!allowedAPI && url.pathname.startsWith('/api/')) || !['GET', 'HEAD'].includes(request.method())) {
          result.blockedRequests.push({ url: url.href, method: request.method(), type: request.resourceType() });
          await requestRoute.abort('blockedbyclient');
        } else {
          await requestRoute.continue();
        }
      });
      const page = await context.newPage();
      page.setDefaultTimeout(5000);
      page.setDefaultNavigationTimeout(15000);
      page.on('console', message => {
        if (message.type() === 'error') result.consoleErrors.push(message.text());
      });
      page.on('pageerror', error => result.pageErrors.push(error.message));
      page.on('response', response => {
        const url = new URL(response.url());
        if (url.origin === base.origin && !url.pathname.startsWith('/api/') && response.status() >= 400) {
          result.failedResources.push({ url: url.href, status: response.status() });
        }
      });
      page.on('requestfailed', request => {
        const url = new URL(request.url());
        if (url.origin === base.origin && !url.pathname.startsWith('/api/')) {
          const observation = { url: url.href, error: request.failure()?.errorText };
          if (observation.error?.includes('ERR_ABORTED')) result.resourceAborts.push(observation);
          else result.failedResources.push(observation);
        }
      });
      try {
        await page.goto(`${base.origin}/#${route.path}`, { waitUntil: 'domcontentloaded' });
        await page.locator('#root > *').first().waitFor({ state: 'visible' });
        await page.waitForTimeout(900);
        // Scroll boundedly to trigger lazy media; never click operational controls.
        for (let step = 0; step < 4; step++) {
          await page.evaluate(() => window.scrollBy(0, window.innerHeight));
          await page.waitForTimeout(100);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        result.document = await page.evaluate(() => {
          const visible = element => element.checkVisibility({ visibilityProperty: true, opacityProperty: true });
          const name = element => element.getAttribute('aria-label') || element.getAttribute('title') || element.innerText?.trim();
          return {
            title: document.title, language: document.documentElement.lang,
            buildScripts: [...document.querySelectorAll('script[src]')].map(el => el.src),
            headings: [...document.querySelectorAll('h1,h2,h3,h4')].map(el => ({ level: Number(el.tagName[1]), text: el.textContent.trim() })),
            mainCount: document.querySelectorAll('main').length,
            links: [...document.querySelectorAll('a[href]')].map(el => ({ href: el.getAttribute('href'), text: name(el) })),
            unnamedControls: [...document.querySelectorAll('button,a[href],input,textarea,select')].filter(visible).filter(el => {
              if (el.matches('input,textarea,select')) return !el.labels?.length && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby');
              return !name(el);
            }).map(el => ({ tag: el.tagName, class: el.className, type: el.getAttribute('type') })),
            overflow: [...document.querySelectorAll('body *')].filter(visible).filter(el => {
              if (el.closest('svg') || getComputedStyle(el).position === 'fixed') return false;
              const rect = el.getBoundingClientRect();
              if (rect.right <= innerWidth + 2 && rect.left >= -2) return false;
              for (let parent = el.parentElement; parent; parent = parent.parentElement) {
                if (parent !== document.body && parent !== document.documentElement && ['auto', 'scroll'].includes(getComputedStyle(parent).overflowX)) return false;
                if (['hidden', 'clip'].includes(getComputedStyle(parent).overflowX) && !el.matches('a,button,input,textarea,select,h1,h2,h3,p')) return false;
              }
              return true;
            }).slice(0, 30).map(el => ({ tag: el.tagName, class: String(el.className), text: el.textContent?.trim().slice(0, 70), width: Math.round(el.getBoundingClientRect().width) })),
            media: [...document.querySelectorAll('video,img')].map(el => ({
              tag: el.tagName, src: el.currentSrc || el.getAttribute('data-src') || el.src, alt: el.getAttribute('alt'),
              deferred: el.getAttribute('data-deferred') === 'true',
              readyState: el.readyState, error: el.error?.code, width: el.videoWidth ?? el.naturalWidth,
              height: el.videoHeight ?? el.naturalHeight,
            })),
          };
        });
        if (result.document.mainCount !== 1) result.issues.push(`Expected one main landmark; found ${result.document.mainCount}`);
        if (result.document.headings.filter(item => item.level === 1).length !== 1) result.issues.push('Expected one h1');
        if (result.document.unnamedControls.length) result.issues.push('Unnamed controls');
        if (result.document.overflow.length) result.issues.push('Horizontal content overflow');
        if (result.document.media.some(media => media.error || media.width === 0 && !media.deferred)) result.issues.push('Loaded media not decoded within observation window');
        result.deferredMedia = result.document.media.filter(media => media.deferred);
        const unknownLinks = result.document.links.filter(link => link.href.startsWith('#/') && !manifest.routes.some(item => `#${item.path}` === link.href));
        if (unknownLinks.length) result.issues.push(`Unknown internal routes: ${unknownLinks.map(link => link.href).join(', ')}`);
        await page.keyboard.press('Tab');
        result.keyboard = await page.evaluate(() => ({ tag: document.activeElement.tagName, text: document.activeElement.textContent?.trim().slice(0, 80), outline: getComputedStyle(document.activeElement).outlineStyle }));
        if (result.keyboard.tag === 'BODY' || result.keyboard.outline === 'none') result.issues.push('First keyboard target lacks visible outline');
        if (await page.locator('.skip-link:focus').count()) {
          await page.keyboard.press('Enter');
          result.keyboard.skipReachedMain = await page.evaluate(() => document.activeElement.tagName === 'MAIN');
          if (!result.keyboard.skipReachedMain) result.issues.push('Skip link did not focus main');
        }
        const dropdown = page.locator('details.agent-nav-dropdown').first();
        if (viewport.name === 'desktop' && await dropdown.count()) {
          await dropdown.locator('summary').focus();
          await page.keyboard.press('Enter');
          result.dropdownKeyboard = await dropdown.getAttribute('open') !== null;
          if (!result.dropdownKeyboard) result.issues.push('Dropdown is not keyboard operable');
          await page.keyboard.press('Enter');
        }
        const toggle = page.locator('button[aria-controls*="mobile-navigation"]');
        if (viewport.name === 'mobile' && await toggle.count()) {
          await toggle.click();
          result.mobileMenu = { expanded: await toggle.getAttribute('aria-expanded') };
          await page.keyboard.press('Shift+Tab');
          await page.keyboard.press('Shift+Tab');
          result.mobileMenu.focusContained = await page.evaluate(() => document.activeElement.closest('[role="dialog"]') !== null || document.activeElement.getAttribute('aria-controls')?.includes('mobile-navigation'));
          if (!result.mobileMenu.focusContained) result.issues.push('Mobile menu keyboard focus escaped');
          await page.keyboard.press('Escape');
          result.mobileMenu.closedWithEscape = await toggle.getAttribute('aria-expanded') === 'false';
          if (!result.mobileMenu.closedWithEscape) result.issues.push('Mobile menu does not close with Escape');
        }
        if (['/memory', '/credentials', '/revenue'].includes(route.path)) {
          if (await page.locator('.sg-shell').count()) {
            result.backendState = route.path === '/memory'
              ? await page.locator('.sg-memory').innerText()
              : await page.locator('.sg-hero').innerText();
            if (route.path !== '/memory' && !/No accounts|No payments|Sans compte|Aucun paiement/.test(result.backendState)) result.issues.push('Missing honest disconnected state');
          } else {
            result.backendState = await page.locator('main .backend-notice').first().textContent();
            if (!/unavailable|unverified/.test(result.backendState)) result.issues.push('Missing honest backend-unavailable state');
          }
        }
        const home = page.locator('a[href="#/"]').first();
        if (await home.count()) {
          await home.click();
          await page.waitForURL(`${base.origin}/#/`);
          result.navigation = 'Home link reached #/';
          await page.goto(`${base.origin}/#${route.path}`, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(300);
        }
        const slug = route.path === '/' ? 'home' : route.path.slice(1);
        result.screenshot = `screenshots/${viewport.name}-${slug}.png`;
        await page.screenshot({ path: path.join(output, result.screenshot), fullPage: true, timeout: 15000, animations: 'disabled' });
        result.caption = `${route.path} — ${language}; ${viewport.name} ${viewport.width}x${viewport.height}; ${report.apiProfile}; fallback fonts; ${result.deferredMedia?.length || 0} offscreen media deferred; all-file decoding/playback and content acceptance measured separately.`;
      } catch (error) {
        result.issues.push(`QA execution: ${error.message}`);
      } finally {
        if (result.pageErrors.length) result.issues.push('Uncaught page errors');
        if (result.failedResources.length) result.issues.push('Failed same-origin resources');
        result.unexpectedConsoleErrors = result.consoleErrors.filter(message => !message.includes('ERR_BLOCKED_BY_CLIENT'));
        if (result.unexpectedConsoleErrors.length) result.issues.push('Unexpected console errors');
        report.results.push(result);
        await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
        console.log(`${viewport.name} ${route.path}: ${result.issues.length ? result.issues.join('; ') : 'PASS'}`);
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  report.finishedAt = new Date().toISOString();
  report.summary = { cases: report.results.length, withIssues: report.results.filter(result => result.issues.length).length };
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  await writeFile(path.join(output, 'captions.json'), JSON.stringify(report.results.map(({ route, viewport, screenshot, caption }) => ({ route, viewport, screenshot, caption })), null, 2));
}
console.log(`Evidence: ${output}`);
process.exitCode = report.summary.withIssues ? 1 : 0;
