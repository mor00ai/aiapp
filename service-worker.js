const CACHE_PREFIX = "ai-tools-cache-";  // Prefisso del nome della cache
const CACHE_VERSION = new Date().toISOString(); // Genera un nome unico per la cache basato sulla data
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION; // Unisce il prefisso con la data corrente per una cache unica

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install: cache the assets when service worker is installed
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching files...");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate: automatically clean up old caches when a new version is activated
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Elimina tutte le cache che non corrispondono al nuovo nome
          if (!cacheName.startsWith(CACHE_PREFIX) || cacheName === CACHE_NAME) {
            return; // Ignora la cache attuale
          }
          console.log(`Deleting old cache: ${cacheName}`);
          return caches.delete(cacheName); // Elimina la cache vecchia
        })
      );
    })
  );
});

// Fetch: serve cached resources, or fallback to network if not cached
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request); // Serve dalla cache, fallback alla rete
    })
  );
});
