// Service Worker for Chess App PWA
const CACHE_NAME = 'chess-app-v1';

// Detect basePath dynamically from current location
// This works for any deployment path (e.g., /ChessApp, /my-app, /, etc.)
const getBasePath = () => {
  const pathname = self.location.pathname;
  // Extract the base path - everything before the service worker file
  // Service worker is typically at /basePath/sw.js or /sw.js
  const swPath = self.location.pathname;
  const basePathMatch = swPath.match(/^(.+)\/sw\.js$/);
  if (basePathMatch && basePathMatch[1]) {
    return basePathMatch[1];
  }
  // If sw.js is at root, no basePath
  return '';
};

const basePath = getBasePath();

// Files to cache
const urlsToCache = [
  `${basePath}/`,
  `${basePath}/icons/manifest.json`,
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both fail, return offline page or fallback
        return new Response('Offline', { status: 503 });
      })
  );
});

