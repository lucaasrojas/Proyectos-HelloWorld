importScripts('./js/lib/workbox-sw.prod.v2.1.0.js');
(function() {
    'use strict';
    
    const workboxSW = new self.WorkboxSW();
    workboxSW.precache([
  {
    "url": "css/bootstrap.css",
    "revision": "13eb49e07ecdb81385715104aca8ad8a"
  },
  {
    "url": "css/custom.css",
    "revision": "f8d7d4ff8de929928c25247deecdf9c0"
  },
  {
    "url": "expense.html",
    "revision": "a28c9eb92f678c5d24b64609f87d2c97"
  },
  {
    "url": "img/check.png",
    "revision": "52adbe28c56b57d43d689a33277dac97"
  },
  {
    "url": "img/logo-144.png",
    "revision": "9e3afc77660012d1c7c8f56e7f2bd8c6"
  },
  {
    "url": "img/logo-194.png",
    "revision": "89c1a768d6f73e451e33b5835d948ba4"
  },
  {
    "url": "img/logo-512.png",
    "revision": "5f32a96b06669b8269d372287da9d215"
  },
  {
    "url": "img/xmark.png",
    "revision": "f7509646ecfbda0a56a0527e9dd560a3"
  },
  {
    "url": "index.html",
    "revision": "aef1667f08fde07dd25af4db80fa2391"
  },
  {
    "url": "js/common.js",
    "revision": "7097e36102d021996fe41cc0bd9e5768"
  },
  {
    "url": "js/expenses.js",
    "revision": "da72c65419ca14e41dce77a15dd10d16"
  },
  {
    "url": "js/home.js",
    "revision": "6292a53ab3114e6214708b8dbd355021"
  },
  {
    "url": "js/lib/workbox-sw.prod.v2.1.0.js",
    "revision": "278f01498704ddb80d3137e4afe941bb"
  },
  {
    "url": "js/sw-registration.js",
    "revision": "0facce6019718196ff78af86cff38d3a"
  },
  {
    "url": "js/utils.js",
    "revision": "0fc0f9d0bd8db556887ee473adef8a15"
  },
  {
    "url": "offline.html",
    "revision": "e3146d7dfe3bda9d8c430a096b8e8ac3"
  },
  {
    "url": "service-worker.js",
    "revision": "81992c6fb7ba76c58631a9b719953bc9"
  }
]);
   // const CACHE_NAME = 'static-cache';
   /* 
   const urlsToCache = [
        '.',
        'index.html',
        'css/bootstrap.css',
        'css/custom.css',
        'js/common.js',
        'js/expenses.js',
        'js/home.js',
    
    ];

    self.addEventListener('install', function(event) {
        console.log('On install');
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function(cache) {
                    return cache.addAll(urlsToCache);
                })
        );
    });

    self.addEventListener('activate', event => {
        var keepList = [CACHE_NAME];
    
        event.waitUntil(
            caches.keys().then(cacheNameList => {
                return Promise.all(cacheNameList.map(cacheName => { 
                    if (keepList.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                }));
            })
        );
    });

    self.addEventListener('fetch', event => {
        console.log(event.request.url);
    
        if (event.request.method !== "GET") return;
    
        if (event.request.url.indexOf('/api/') !== -1) {
            event.respondWith(fetchAndCache(event.request));
        } else {
            event.respondWith(
                caches.match(event.request).then(response => {
                    return response || fetchAndCache(event.request);
                })
            );
        }
    });

    function fetchAndCache(url) {
        console.log("url fetch", url)
        return fetch(url)
            .then((response) => {
                // Check if we received a valid response
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(url, response.clone());
                        return response;
                    });
            })
            .catch((error) => {
                console.log('Request failed:', error);
                // You could return a custom offline 404 page here
            });
    }
*/
    self.addEventListener('push', e => {
        const options = {
            body: 'Revisa el nuevo gasto del viaje',
            icon: 'img/logo-512.png',
            vibrate: [100, 50, 100],
            data: {
                primaryKey: 2
            },
            actions: [
                {action: 'explore', title: 'Ir al sitio',
                    icon: 'img/check.png'},
                {action: 'close', title: 'Cerrar la notificación',
                    icon: 'img/xmark.png'}
            ]
        };
    
        e.waitUntil(
            self.registration.showNotification('Push Notification', options)
        );
    });

    self.addEventListener('notificationclick', e => {
        const notification = e.notification;
        const action = e.action;
    
        if (action === 'close') {
            notification.close();
        } else if (notification.data) {
            const primaryKey = notification.data.primaryKey;
            clients.openWindow('expense/' + primaryKey);
            notification.close();
        }
    });

    // Sync en segundo plano

    navigator.serviceWorker.ready.then(function(swRegistration) {
        return swRegistration.sync.register('miSincro');
    });

    self.addEventListener('sync', function(event) {
        if (event.tag == 'miSincro') {
          event.waitUntil(sincronizar());
        }
    });

    function broadcast(message) {
        return clients.matchAll({includeUncontrolled: true, type: 'window'}).then(function(clients) {
            for (var client of clients) {
                client.postMessage(message);
            }
        });
    }
     
    self.addEventListener('sync', function(event) {
        if (event.tag === 'delete-expenses') {
            event.waitUntil(
                fetch('/api/expense', {method: "delete"})
                .then((response) => {
                    if (response.ok) {
                        broadcast({"action": "updateHome"})
                    }
                })
            );
        }
    });


})();