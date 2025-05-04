// service-worker.js

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
  '/css/style.css',  // Aggiungi il percorso al tuo CSS
  '/js/app.js'       // Aggiungi il percorso al tuo JS
];

// Funzione per calcolare un hash univoco (simulazione)
async function getCacheVersion() {
  const cacheString = await Promise.all(FILES_TO_CACHE.map(async (file) => {
    const response = await fetch(file, { method: 'GET' });
    const text = await response.text();
    return text;
  }));
  
  // Combina tutto il contenuto dei file per generare un hash
  const cacheVersion = cacheString.join('').slice(0, 50); // Prima parte del contenuto come versione (o usa un vero hash)
  return `ai-tools-cache-${cacheVersion}`;
}

// Installazione del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installazione in corso');
  event.waitUntil(
    getCacheVersion().then((CACHE_NAME) => {
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Service Worker: Cache aperta');
        return cache.addAll(FILES_TO_CACHE);  // Aggiungi tutte le risorse da memorizzare in cache
      });
    })
  );
});

// Attivazione del Service Worker e rimozione della vecchia cache
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Attivazione in corso');
  
  event.waitUntil(
    getCacheVersion().then((CACHE_NAME) => {
      const cacheWhitelist = [CACHE_NAME];  // Mantieni solo la cache della versione corrente
      return caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              // Elimina le cache vecchie che non sono più necessarie
              console.log(`Service Worker: Rimuovo la cache obsoleta ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      });
    })
  );
});

// Recupero delle risorse (dalla cache o dalla rete)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Restituisce la risorsa dalla cache se esiste
        return cachedResponse;
      }
      // Altrimenti, effettua una richiesta di rete
      return fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Memorizza nella cache la nuova risposta
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

// Notifiche Push (opzionale)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icon.png',  // Puoi specificare un'icona per la notifica
    badge: '/icon.png'  // Badge per la notifica
  };

  event.waitUntil(
    self.registration.showNotification('Notifica', options)
  );
});
