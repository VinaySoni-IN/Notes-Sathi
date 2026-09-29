/* Notes Sathi — service worker (installable + offline-friendly blog) */
var CACHE = "notes-sathi-v11";
var SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return k === CACHE ? null : caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  var url = new URL(e.request.url);
  if(url.origin !== location.origin) return;               // never touch API / fonts / CDN
  if(e.request.method !== "GET") return;

  /* manifests: network-first so new notes show up; cache fallback when offline */
  if(url.pathname.endsWith(".json")){
    e.respondWith(
      fetch(e.request).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
        return res;
      }).catch(function(){ return caches.match(e.request); })
    );
    return;
  }

  /* notes files (PDFs / images): stale-while-revalidate — instant repeat reads,
     updated quietly in the background when the teacher re-uploads */
  if(/\/notes\/.+\.(pdf|png|jpe?g|webp|gif|docx?|pptx?|xlsx?|txt|zip)$/i.test(url.pathname)){
    e.respondWith(
      caches.match(e.request).then(function(hit){
        var refresh = fetch(e.request).then(function(res){
          if(res.ok){
            var copy = res.clone();
            caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
          }
          return res;
        }).catch(function(){ return hit; });
        return hit || refresh;
      })
    );
    return;
  }

  /* app shell: cache-first */
  e.respondWith(
    caches.match(e.request).then(function(hit){
      return hit || fetch(e.request).then(function(res){
        if(res.ok){
          var copy = res.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
        }
        return res;
      }).catch(function(){ return caches.match("./index.html"); });
    })
  );
});
