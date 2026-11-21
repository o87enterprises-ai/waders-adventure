// Offline support for Wader's Adventure.
// - Pages: network-first, falling back to the cached copy when offline.
// - Hashed Next.js bundles: cache-first (they never change under the same URL).
// - Game art/audio, icons and OCR files: stale-while-revalidate.
// Everything is cached the first time it is used, so visit /play once while online.
const VERSION = 'v1';
const CACHE = `waders-${VERSION}`;
const SHELL = ['/', '/play', '/manifest.webmanifest'];
const CDN_HOSTS = ['cdn.jsdelivr.net', 'tessdata.projectnaptha.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function put(request, response) {
  // Only full, successful responses can be cached (not 206 audio ranges or errors).
  if (response && response.status === 200) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !CDN_HOSTS.includes(url.hostname)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => put(request, res))
        .catch(async () => (await caches.match(request)) || (await caches.match('/')) || Response.error())
    );
    return;
  }

  if (sameOrigin && url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((res) => put(request, res)))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((hit) => {
      const network = fetch(request).then((res) => put(request, res)).catch(() => hit);
      return hit || network;
    })
  );
});
