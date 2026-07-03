/* Coach Medina · service worker
   - App shell cached for offline use.
   - HTML/JS/CSS/JSON served network-first (fresh deploys reach users next visit).
   - Images/icons served cache-first.
   - Firebase/Google traffic never intercepted (always network).
*/
var CACHE = 'coach-medina-v1';
var SHELL = [
  './',
  './index.html',
  './firebase-config.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL).catch(function(){}); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('message', function(e){ if(e.data==='SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  var url = new URL(req.url);

  // Never intercept Firebase / Google endpoints — let the SDK talk to the network directly.
  if(url.origin !== self.location.origin ||
     /firebase|firestore|googleapis|google-analytics|gstatic|googletagmanager/.test(url.href)){
    return;
  }

  var isAsset = /\.(png|jpg|jpeg|svg|webp|ico|woff2?)$/i.test(url.pathname);
  if(isAsset){
    // cache-first for images/fonts
    e.respondWith(
      caches.match(req).then(function(hit){
        return hit || fetch(req).then(function(res){
          var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); });
          return res;
        });
      })
    );
    return;
  }

  // network-first for HTML/JS/CSS/JSON, fall back to cache offline
  e.respondWith(
    fetch(req).then(function(res){
      var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); });
      return res;
    }).catch(function(){
      return caches.match(req).then(function(hit){ return hit || caches.match('./index.html'); });
    })
  );
});
