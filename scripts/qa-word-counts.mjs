import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Usage: node scripts/qa-word-counts.mjs before|after');
const base = new URL(process.env.QA_BASE_URL || 'http://127.0.0.1:4174');
if (base.protocol !== 'http:' || !['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)) throw new Error('Loopback target required');
const output = path.resolve('qa-evidence/sovereign-gold');
await mkdir(output, { recursive: true });
const { routes } = JSON.parse(await readFile('qa/routes.json', 'utf8'));
const report = { phase, definition: 'Visible main.innerText words using Intl.Segmenter; body-copy count is visible main paragraph text. Required disclosures included, live backend data may vary.', results: [] };
const browser = await chromium.launch();
try {
  for (const language of ['en', 'fr']) {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport });
      await context.addInitScript(language => localStorage.setItem('appLanguage', language), language);
      await context.route('**/*', route => {
        const request = route.request();
        return new URL(request.url()).origin === base.origin && ['GET', 'HEAD'].includes(request.method()) ? route.continue() : route.abort('blockedbyclient');
      });
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      for (const route of routes) {
        await page.goto(`${base.origin}/#${route.path}`, { waitUntil: 'domcontentloaded' });
        await page.locator('main').first().waitFor();
        await page.waitForTimeout(800);
        const counts = await page.evaluate(language => {
          const main = document.querySelector('main');
          const words = text => [...new Intl.Segmenter(language, { granularity: 'word' }).segment(text)].filter(segment => segment.isWordLike).length;
          const paragraphs = [...main.querySelectorAll('p')].filter(element => element.getClientRects().length);
          return { words: words(main.innerText), bodyCopyWords: words(paragraphs.map(element => element.innerText).join(' ')) };
        }, language);
        report.results.push({ route: route.path, language, viewport, ...counts });
        await writeFile(path.join(output, `${phase}-words.json`), JSON.stringify(report, null, 2));
      }
      await context.close();
    }
  }
} finally { await browser.close(); }
console.log(`${phase}: ${report.results.length} route/language/viewport word counts saved`);
if (phase === 'after') {
  const before = JSON.parse(await readFile(path.join(output, 'before-words.json'), 'utf8'));
  const key = item => `${item.route}|${item.language}|${item.viewport.width}`;
  const baseline = new Map(before.results.map(item => [key(item), item]));
  const comparisons = report.results.map(item => {
    const previous = baseline.get(key(item));
    if (!previous) throw new Error(`Missing baseline ${key(item)}`);
    return { ...item, beforeWords: previous.words, beforeBodyCopyWords: previous.bodyCopyWords,
      wordReduction: 1 - item.words / previous.words, bodyCopyReduction: 1 - item.bodyCopyWords / previous.bodyCopyWords };
  });
  const totals = comparisons.reduce((sum, item) => ({
    beforeWords: sum.beforeWords + item.beforeWords, afterWords: sum.afterWords + item.words,
    beforeBodyCopyWords: sum.beforeBodyCopyWords + item.beforeBodyCopyWords, afterBodyCopyWords: sum.afterBodyCopyWords + item.bodyCopyWords,
  }), { beforeWords: 0, afterWords: 0, beforeBodyCopyWords: 0, afterBodyCopyWords: 0 });
  const result = { definition: report.definition, totals, bodyCopyReduction: 1 - totals.afterBodyCopyWords / totals.beforeBodyCopyWords,
    wordReduction: 1 - totals.afterWords / totals.beforeWords, nonReducedRoutes: comparisons.filter(item => item.wordReduction <= 0), comparisons };
  await writeFile(path.join(output, 'word-comparison.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ totals, bodyCopyReduction: result.bodyCopyReduction, nonReducedRoutes: result.nonReducedRoutes.map(key) }, null, 2));
  if (comparisons.length !== before.results.length || result.bodyCopyReduction < 0.5 || result.nonReducedRoutes.length) process.exitCode = 1;
}
