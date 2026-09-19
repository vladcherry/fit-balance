/* Minimal offline shell for the prototype.
   Bump CACHE when the shell changes so old copies are dropped. */

var CACHE = 'fitbalance-prototype-v6';
var SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './recognise.js',
  './cloud.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) { return cache.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (key) {
          return key === CACHE ? null : caches.delete(key);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

/* The recognition model and the ML runtime are ~15 MB and never change in
   place - a new one would come at a new path. Those are served cache first, so
   they are downloaded once and then cost nothing. */
function isImmutableAsset(pathname) {
  return pathname.indexOf('/model/') !== -1 || pathname.indexOf('/vendor/') !== -1;
}

/* Network first for everything else, cache as the offline fallback.
   The prototype changes often, and a cache-first shell keeps serving a stale
   copy for a cycle after each deploy - which reads as "the app is broken". */
self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }
  // The version check must always see the network, never a cached answer.
  if (url.pathname.endsWith('/version.json')) {
    return;
  }
  if (isImmutableAsset(url.pathname)) {
    event.respondWith(
      caches.match(request).then(function (hit) {
        return hit || fetch(request).then(function (response) {
          if (response.ok) {
            var copy = response.clone();
            caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
          }
          return response;
        });
      })
    );
    return;
  }
  /* `cache: 'no-store'` is the whole point: without it this fetch is answered
     from the browser's own HTTP cache, and GitHub Pages sends a ten-minute
     max-age. The service worker would then dutifully serve a stale build while
     believing it had gone to the network. */
  event.respondWith(
    fetch(request, { cache: 'no-store' })
      .then(function (response) {
        if (response.ok) {
          var copy = response.clone();
          caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
        }
        return response;
      })
      .catch(function () {
        return caches.match(request).then(function (hit) {
          return hit || caches.match('./index.html');
        });
      })
  );
});

/* The update button talks to the worker directly: drop the shell so the next
   load is fetched fresh, but keep the model and the runtime, which are tens of
   megabytes and never change in place. */
self.addEventListener('message', function (event) {
  var data = event.data || {};
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  if (data.type !== 'CLEAR_SHELL') { return; }
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.keys().then(function (requests) {
        return Promise.all(requests.map(function (request) {
          return isImmutableAsset(new URL(request.url).pathname)
            ? null
            : cache.delete(request);
        }));
      });
    }).then(function () {
      if (event.ports && event.ports[0]) { event.ports[0].postMessage({ cleared: true }); }
    })
  );
});
