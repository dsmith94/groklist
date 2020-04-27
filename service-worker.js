

var CACHE_NAME = 'groklist-site-cache-v1';
var FILES_TO_CACHE = [
  'index.html',
  'logo-512.png',
  'edit-512.png',
  'cancel-512.png',
  'check-512.png',
  'menu-512.png',
  'w3.css',
  'groklist.js'
];


self.addEventListener('install', (event) => {
    console.log('👷', 'install', event);
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          console.log('[ServiceWorker] Pre-caching offline page');
          return cache.addAll(FILES_TO_CACHE);
        })
    );
  });
  
  self.addEventListener('activate', (event) => {
    console.log('👷', 'activate', event);
    event.waitUntil(
        caches.keys().then((keyList) => {
          return Promise.all(keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('[ServiceWorker] Removing old cache', key);
              return caches.delete(key);
            }
          }));
        })
    );
  });


  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function (response) {
          return response || fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  });
  