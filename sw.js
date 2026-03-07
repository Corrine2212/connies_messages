// !! CACHE_VERSION is replaced at build time by build.js !!
const CACHE_VERSION = '%%CACHE_VERSION%%';
const CACHE_NAME = `connies-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// Install — cache static assets, but DON'T skipWaiting
// Wait until user acknowledges the update (taps Refresh banner)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS).catch(() => {}))
    // No skipWaiting here — new SW waits in 'installed' state
  );
});

// Activate — clean up old caches, claim all clients
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Never intercept Firebase / Google API calls
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('firestore') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('gstatic') ||
    url.hostname.includes('identitytoolkit')
  ) return;

  // index.html — NETWORK FIRST so updates are picked up automatically
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Everything else (icons, manifest) — cache first, network fallback
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return response;
      });
    })
  );
});

// App sends 'skipWaiting' when user taps the Refresh banner
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
