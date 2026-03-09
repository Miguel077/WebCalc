const CACHE_NAME = 'webcalc-v4';
const ASSETS = [
  './',
  './index.html',
  './calculator.png',
  './manifest.json'
];

// Installation: Dateien in den Cache laden
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Promise.allSettled sorgt dafür, dass die Installation NICHT abbricht,
      // falls eine Datei (z.B. das Icon) mal nicht geladen werden kann.
      return Promise.allSettled(
        ASSETS.map(asset => cache.add(asset))
      );
    })
  );
  self.skipWaiting();
});

// Aktivierung: Alte Caches löschen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch: Dateien aus dem Cache servieren (Offline-Modus)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
