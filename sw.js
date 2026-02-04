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

// cBurnett piece set (PNG) – precache so cBurnett style works offline
const CBURNETT_PIECES = ['wK','bK','wQ','bQ','wR','bR','wB','bB','wN','bN','wP','bP'];
const cburnettUrls = CBURNETT_PIECES.map((name) => `${basePath}/pieces/cburnett/${name}.png`);

// Files to cache during install
const urlsToCache = [
  `${basePath}/`,
  `${basePath}/icons/manifest.json`,
  ...cburnettUrls,
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

// Helper function to check if request is for HTML
const isHTMLRequest = (request) => {
  const url = new URL(request.url);
  const acceptHeader = request.headers.get('accept') || '';
  return acceptHeader.includes('text/html') || 
         url.pathname === basePath + '/' || 
         url.pathname === basePath + '/index.html' ||
         (!basePath && (url.pathname === '/' || url.pathname === '/index.html'));
};

// Helper function to check if request is for a static asset
const isStaticAsset = (request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  // Check for Next.js static assets
  return pathname.includes('/_next/') ||
         pathname.includes('/icons/') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.jpeg') ||
         pathname.endsWith('.gif') ||
         pathname.endsWith('.svg') ||
         pathname.endsWith('.woff') ||
         pathname.endsWith('.woff2') ||
         pathname.endsWith('.ttf') ||
         pathname.endsWith('.eot');
};

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // For HTML pages, use network-first strategy with cache fallback
  if (isHTMLRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the new HTML for offline use
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache as fallback
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If no cached HTML, try to serve index.html from cache
              return caches.match(`${basePath}/`).then((indexResponse) => {
                return indexResponse || new Response('Offline - No cached content available', { 
                  status: 503,
                  headers: { 'Content-Type': 'text/plain' }
                });
              });
            });
        })
    );
    return;
  }
  
  // For static assets (JS, CSS, images, fonts), use cache-first strategy
  // This ensures offline functionality works with already downloaded code
  if (isStaticAsset(request)) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If not in cache, fetch from network and cache it
          return fetch(request)
            .then((response) => {
              // Only cache successful responses
              if (response.ok) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseToCache);
                });
              }
              return response;
            })
            .catch(() => {
              // If network fails and not in cache, return a fallback
              // For images, we could return a placeholder, but for JS/CSS we need to fail
              return new Response('Resource not available offline', { 
                status: 503,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
    return;
  }
  
  // For other requests (API calls, etc.), try network first, then cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(request)
          .then((cachedResponse) => {
            return cachedResponse || new Response('Offline', { 
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

