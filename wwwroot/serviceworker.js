var CACHE_STATIC_NAME = 'static-v2.47';
  var CACHE_DYNAMIC_NAME = 'dynamic-v3';
  var STATIC_FILES = [
      '/',
      '/lib/bootstrap/dist/css/bootstrap.css',
      '/css/site.css',
      '/images/banner1.svg',
      '/images/banner2.svg',
      '/images/banner3.svg',
      '/images/banner4.svg',
      '/lib/jquery/dist/jquery.js',
      '/lib/bootstrap/dist/js/bootstrap.js',
      'js/site.js?v=YqKUhc2c4_DY0Nzc8PQKzpRCLcP3fmKnC_0eaMwDFmg',
  ];


self.addEventListener('install', function (event) {
    console.log('Installing Service Worker ...', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
        .then(function (cache) {
            console.log(' Precaching App Shell');
            // cache.add('/src/js/app.js');
            // cache.add('/index.html');
            cache.addAll(STATIC_FILES)
        })
    )
});

self.addEventListener('activate', function (event) {
    console.log('Activating Service Worker', event);
    event.waitUntil(
        caches.keys()
        .then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                    console.log('Removing Old Cache --> ', key)
                    return caches.delete(key);
                }
            }))
        })
    );
    event.waitUntil(self.clients.claim());
});


function isInArray(string, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === string) {
            return true;
        }
    }
    return false;
}

  self.addEventListener('fetch', function (event) {
    if (isInArray(event.request.url, STATIC_FILES)) {
        event.respondWith(
            caches.match(event.request)
        )
    }
    // cache with network fallback strategy
    else {
        event.respondWith(
            caches.match(event.request) //To match current request with cached request it
            .then(function (response) {
                //If response found return it, else fetch again.
                if (response) {
                    return response
                } else {
                    // Applying Dynamic caching
                    return fetch(event.request)
                        .then(function (res) {
                            return caches.open(CACHE_DYNAMIC_NAME)
                                .then(function (cache) {
                                    // trimCache(CACHE_DYNAMIC_NAME,3);
                                    cache.put(event.request.url, res.clone())
                                    return res;
                                }).catch(function () {

                                });
                        });
                }
            })
            .catch(function (error) {

                return caches.open(CACHE_STATIC_NAME)
                    .then(function (cache) {
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return cache.match('/offline.html')
                        }
                    });
            })
        );
    }

});
