// Service Worker for offline functionality
const CACHE_NAME = 'radio-v2';
const urlsToCache = [
  './radio.html',
  './manifest.json'
];
 
// Install event - cache resources and activate the new version right away
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
 
// Fetch event
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
 
  // Never intercept audio streams, range requests or other sites:
  // let the browser handle them directly (live streams never "finish",
  // so they must not go through the cache logic).
  if (
    req.method !== 'GET' ||
    url.origin !== self.location.origin ||
    req.destination === 'audio' ||
    req.headers.has('range')
  ) {
    return;
  }
 
  // Pages: network first, so updates to radio.html show up immediately;
  // fall back to the cached copy when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return response;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('./radio.html')))
    );
    return;
  }
 
  // Other same-origin files: cache first, then network
  event.respondWith(
    caches.match(req)
      .then(response => response || fetch(req))
  );
});
 
// Activate event - clean up old caches and take control of open pages
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});
 
