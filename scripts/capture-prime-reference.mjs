import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const output = process.argv[2];
if (!output) throw new Error('Pass a local artifact directory.');
const origin = 'https://prime-ai.fr';
await mkdir(output, { recursive: true });
const records = [];
async function capture(relative, filename) {
  const url = new URL(relative, origin);
  if (url.origin !== origin) throw new Error('Only same-site references are allowed.');
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`${url.pathname}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > 3 * 1024 * 1024) throw new Error('Reference exceeds 3 MiB limit.');
  await writeFile(path.join(output, filename), bytes);
  records.push({
    url: url.href, capturedAt: new Date().toISOString(), filename,
    contentType: response.headers.get('content-type'), bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
  return bytes.toString();
}
const html = await capture('/', 'production.html');
const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1]);
const styles = [...html.matchAll(/<link[^>]+href="([^"]+\.css)"/g)].map(match => match[1]);
if (scripts.length + styles.length > 4) throw new Error('Unexpected production asset count.');
let bundle = '';
for (const [index, src] of scripts.entries()) bundle += await capture(src, `bundle-${index}.js`);
for (const [index, src] of styles.entries()) await capture(src, `style-${index}.css`);
const images = [...new Set([...bundle.matchAll(/["'`]((?:\/portraits\/portrait_\d+\.png)|(?:\/prime-logo\.jpg))["'`]/g)].map(match => match[1]))];
for (const [index, src] of images.slice(0, 2).entries()) await capture(src, `page-image-${index}${path.extname(src)}`);
await writeFile(path.join(output, 'manifest.json'), JSON.stringify({
  origin, capturedAt: new Date().toISOString(), records,
  parsed: {
    title: html.match(/<title>(.*?)<\/title>/s)?.[1],
    scripts, styles, pageImageReferences: images,
    dataSource: 'Landing-page copy and platform definitions are embedded in the bundle. No read API is required by the landing page.',
    signup: 'Production bundle references a third-party email submission service. It was not called.',
  },
  scope: 'Single public landing HTML, its JS/CSS, and two directly referenced images. No auth, POST, external domains, or crawling.',
}, null, 2));
console.log(`Captured ${records.length} public resources to ${output}`);
