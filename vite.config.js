import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

function offlineShell() {
  return {
    name: 'prime-offline-shell',
    apply: 'build',
    generateBundle(_options, bundle) {
      const files = ['/', '/index.html', '/manifest.webmanifest', '/pwa-192.png', '/pwa-512.png',
        ...Object.keys(bundle).filter(file => /\.(js|css)$/.test(file)).map(file => `/${file}`)]
      const version = createHash('sha256').update(JSON.stringify(bundle)).digest('hex').slice(0, 16)
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: `
const CACHE = 'prime-shell-${version}';
const SHELL = ${JSON.stringify(files)};
self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await cache.addAll(SHELL);
  await self.skipWaiting();
})()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const key of await caches.keys()) {
    if (key.startsWith('prime-shell-') && key !== CACHE) await caches.delete(key);
  }
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin ||
      url.pathname.startsWith('/api/') || request.headers.has('Range') ||
      /\\.(mp4|webm|mov|mp3|wav)$/i.test(url.pathname)) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try { return await fetch(request); }
      catch {
        const cache = await caches.open(CACHE);
        return await cache.match('/index.html') || Response.error();
      }
    })());
  } else if (!url.search && SHELL.includes(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      return await cache.match(request) || fetch(request);
    })());
  }
});
` })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), offlineShell()],
  resolve: {
    alias: {
      'react': fileURLToPath(new URL('./node_modules/react', import.meta.url)),
      'react-dom': fileURLToPath(new URL('./node_modules/react-dom', import.meta.url)),
    }
  }
})
