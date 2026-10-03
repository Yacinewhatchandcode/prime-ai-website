import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const packageRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const source = resolve(packageRoot, 'src/index.js');
const destination = resolve(packageRoot, '../../public/julia');

await build({
  configFile: false,
  root: packageRoot,
  logLevel: 'warn',
  build: {
    lib: { entry: source, formats: ['es'], fileName: 'embed' },
    outDir: destination,
    emptyOutDir: false,
    copyPublicDir: false,
    minify: 'oxc',
  },
});
console.log(`Julia embed module written to ${destination}/embed.js`);
