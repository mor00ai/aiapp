self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('ai-app').then(function (cache) {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', function (event) {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
