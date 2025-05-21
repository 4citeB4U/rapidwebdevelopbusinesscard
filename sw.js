const CACHE_NAME = 'agentlee-pwa-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/digitalcard2.png',
  '/resourseagent.png',
  '/1tof8i87kg.png',
  '/sw.js',
  'https://cdn.jsdelivr.net/npm/qrcode-generator/qrcode.min.js'
];

// Install event — cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch event — serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedRes => {
        if (cachedRes) return cachedRes;
        return fetch(event.request).then(networkRes => {
          // Cache fetched files dynamically
          if (event.request.method === 'GET' && networkRes.status === 200 && networkRes.type === 'basic') {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkRes.clone()));
          }
          return networkRes;
        });
      }).catch(() => {
        // Optional: fallback if offline and no cache (e.g., offline page)
      })
  );
});
