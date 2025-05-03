
const CACHE_NAME = 'ai-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  '/styles.css',  // Aggiungi il tuo file CSS se necessario
  '/icon.png',    // Icona
  '/icon-512.png' // Icona ad alta risoluzione
];

// Installazione del service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aperta e risorse aggiunte');
        return cache.addAll(urlsToCache);
      })
  );
});

// Attivazione del service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`Cache obsoleta rimossa: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Gestione delle richieste di rete
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
