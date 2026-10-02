import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export async function inventory() {
  const source = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
  const tags = source.match(/<Route\b[^>]*>/g) ?? [];
  const routes = tags.filter(tag => /\bpath=/.test(tag)).map(tag => {
    const path = tag.match(/\bpath="([^"]+)"/)?.[1];
    if (!path || /[:*]/.test(path)) throw new Error(`Route needs explicit QA examples: ${tag}`);
    return { path, component: tag.match(/element=\{<(\w+)/)?.[1], hash: `#${path}` };
  }).sort((a, b) => a.path.localeCompare(b.path, 'en'));
  if (!routes.length || new Set(routes.map(route => route.path)).size !== routes.length) {
    throw new Error('Missing or duplicate routes in App.jsx');
  }
  return { schemaVersion: 1, router: 'hash', source: 'src/App.jsx', routes };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const manifest = await inventory();
  await mkdir(new URL('../qa/', import.meta.url), { recursive: true });
  await writeFile(new URL('../qa/routes.json', import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(new URL('../qa/paths.json', import.meta.url), `${JSON.stringify(manifest.routes.map(route => `/${route.hash}`), null, 2)}\n`);
  console.log(JSON.stringify(manifest, null, 2));
}
