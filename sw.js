
const CACHE = 'prime-shell-a0753ebf232411ba';
const SHELL = ["/","/index.html","/manifest.webmanifest","/pwa-192.png","/pwa-512.png","/assets/index-huoMUaL0.js","/assets/core-0_kFspMt.js","/assets/event-Cq8FfK9q.js","/assets/index-DUAJCJF5.css"];
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
      /\.(mp4|webm|mov|mp3|wav)$/i.test(url.pathname)) return;
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
