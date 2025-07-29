const CACHE_NAME = 'ai-english-reading-v1';
const urlsToCache = [
  '/',
  '/test',
  '/dashboard',
  '/results',
  '/subscription',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache resources:', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for test results
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-test-results') {
    event.waitUntil(syncTestResults());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New reading passage available!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '지금 학습하기',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('AI 영어 독해', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/test')
    );
  }
});

// Sync test results when back online
async function syncTestResults() {
  try {
    const testResults = await getStoredTestResults();
    if (testResults.length > 0) {
      // Send results to server
      await fetch('/api/sync-test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testResults)
      });
      
      // Clear stored results after successful sync
      await clearStoredTestResults();
    }
  } catch (error) {
    console.error('Failed to sync test results:', error);
  }
}

// Helper functions for offline data management
function getStoredTestResults() {
  return new Promise((resolve) => {
    // This would integrate with IndexedDB in a real implementation
    resolve([]);
  });
}

function clearStoredTestResults() {
  return new Promise((resolve) => {
    // Clear IndexedDB stored results
    resolve();
  });
}