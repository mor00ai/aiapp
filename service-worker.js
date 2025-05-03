const CACHE_NAME = 'ai-tools-cache-v1-' + new Date().getTime();
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // forza attivazione immediata
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('ai-tools-cache-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() =>
          caches.match('./index.html') // fallback offline
        )
      );
    })
  );
});
