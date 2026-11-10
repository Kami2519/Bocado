/* Bocado — service worker. Primero la red (para recibir actualizaciones); sin internet, lo guardado. */
var CACHE="bocado-202611101951";
var BASE=["./","index.html","app/","app/index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(BASE);}).then(function(){return self.skipWaiting();}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==CACHE;}).map(function(n){return caches.delete(n);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){
  var r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==self.location.origin) return;
  e.respondWith(fetch(r).then(function(res){
    if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp);});}
    return res;
  }).catch(function(){return caches.match(r).then(function(m){return m||caches.match(r.mode==="navigate"&&new URL(r.url).pathname.indexOf("/app")>-1?"app/index.html":"index.html");});}));
});
