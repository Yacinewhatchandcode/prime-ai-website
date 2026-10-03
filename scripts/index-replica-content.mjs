import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { keywordGroups, classifyText } from '../src/utils/replicaRetrieval.js';

const origin = process.env.QA_BASE_URL || 'http://127.0.0.1:4186';
if (!['127.0.0.1', 'localhost'].includes(new URL(origin).hostname)) throw new Error('Index generation requires a loopback page.');
const snapshot = process.argv[2];
if (!snapshot) throw new Error('Provide the bounded production snapshot directory.');
const manifest = JSON.parse(await readFile(path.join(snapshot, 'manifest.json'), 'utf8'));
const html = await readFile(path.join(snapshot, 'production.html'), 'utf8');
const metadataKeywords = html.match(/<meta\s+name="keywords"\s+content="([^"]+)"/i)?.[1]?.split(',').map(word => word.trim()) || [];
const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] || '';
const script = manifest.records.find(record => record.filename.endsWith('.js'));
if (!script) throw new Error('Snapshot lacks a production bundle record.');
const bundle = await readFile(path.join(snapshot, script.filename));
if (createHash('sha256').update(bundle).digest('hex') !== script.sha256) throw new Error('Production bundle hash differs from recorded evidence.');
const browser = await chromium.launch({ headless: true });
const records = [];
try {
  const page = await browser.newPage();
  await page.route('**/*', route => {
    const request = route.request();
    return request.method() === 'GET' && new URL(request.url()).origin === new URL(origin).origin ? route.continue() : route.abort();
  });
  await page.goto(`${origin}/replica`, { waitUntil: 'networkidle' });
  const sections = await page.evaluate(() => {
    const selectors = ['.replica-hero', '.replica-foundations', '.replica-augmented', '.replica-ecosystem', '.replica-fleet', '.replica-briefing', '.replica-final'];
    return selectors.map(selector => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Missing content section ${selector}`);
      return {
        selector, anchor: element.id || (selector === '.replica-augmented' ? 'replica-brain-title' : selector === '.replica-final' ? 'replica-final-title' : 'platform'),
        title: element.querySelector('h1,h2')?.innerText.replace(/\n/g, ' ') || 'Memory · Orchestration · Trust',
        text: element.innerText.replace(/\s+/g, ' ').trim(),
        images: [...element.querySelectorAll('img')].map(image => ({ src: new URL(image.src).pathname, alt: image.alt })),
      };
    });
  });
  for (const [index, section] of sections.entries()) records.push({
    id: `replica-section-${index}`, ...section, url: `/replica#${section.anchor}`,
    source: 'Local reference replica', groups: classifyText(`${section.title} ${section.text}`),
    evidence: { kind: 'Rendered component text', selector: section.selector, capturedAt: new Date().toISOString() },
  });
  for (const selector of ['.replica-foundation', '.replica-platform']) {
    const count = await page.locator(selector).count();
    for (let index = 0; index < count; index++) {
      await page.locator(selector).nth(index).click();
      const dialog = page.getByRole('dialog');
      await dialog.waitFor({ state: 'visible' });
      const content = await dialog.evaluate(element => ({
        title: element.querySelector('h2').innerText,
        text: element.querySelector(':scope > p:not(.replica-eyebrow):not(.replica-video-caption)').innerText,
      }));
      records.push({
        id: `replica-detail-${records.length}`, ...content, images: [],
        url: `/replica#${selector === '.replica-platform' ? 'ecosystem' : 'platform'}`,
        source: 'Local reference replica', groups: classifyText(`${content.title} ${content.text}`),
        evidence: { kind: 'Accessible component detail dialog', selector: `${selector}:nth-of-type(${index + 1})`, capturedAt: new Date().toISOString() },
      });
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
    }
  }
  for (const keyword of metadataKeywords) records.push({
    id: `production-keyword-${records.length}`, title: keyword, text: description, images: [],
    url: '/semantic-library', source: 'Public production metadata', groups: classifyText(keyword),
    evidence: { kind: 'Public HTML meta keywords', origin: manifest.origin, capturedAt: manifest.records[0].capturedAt, sha256: manifest.records[0].sha256 },
  });
  const data = {
    version: 1, generatedAt: new Date().toISOString(), origin: manifest.origin,
    scope: 'All eight production metadata keywords, all seven rendered reference-replica content sections, three foundation details and six platform details. No private data or external APIs.',
    method: 'Deterministic keyword and curated concept-alias retrieval, not vector embeddings or live fleet memory.',
    groups: keywordGroups, metadataKeywords, records,
    sourceSnapshot: { capturedAt: manifest.capturedAt, publicResourceCount: manifest.records.length, bundleSha256: script.sha256 },
    artwork: JSON.parse(await readFile('public/replica-art/provenance.json', 'utf8')),
  };
  await mkdir('public/replica-data', { recursive: true });
  await writeFile('public/replica-data/semantic-index.json', JSON.stringify(data, null, 2));
  console.log(`Indexed ${metadataKeywords.length} public keywords, ${sections.length} replica sections and nine component details (${records.length} traceable records).`);
} finally {
  await browser.close();
}
