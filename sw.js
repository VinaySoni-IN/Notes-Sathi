/* Notes Sathi — service worker (installable + offline-friendly blog) */
var CACHE = "notes-sathi-v25";
var SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./pdf.min.js",
  "./pdf.worker.min.js",
    "./standard_fonts/FoxitDingbats.pfb",
    "./standard_fonts/FoxitFixed.pfb",
    "./standard_fonts/FoxitFixedBold.pfb",
    "./standard_fonts/FoxitFixedBoldItalic.pfb",
    "./standard_fonts/FoxitFixedItalic.pfb",
    "./standard_fonts/FoxitSerif.pfb",
    "./standard_fonts/FoxitSerifBold.pfb",
    "./standard_fonts/FoxitSerifBoldItalic.pfb",
    "./standard_fonts/FoxitSerifItalic.pfb",
    "./standard_fonts/FoxitSymbol.pfb",
    "./standard_fonts/LICENSE_FOXIT",
    "./standard_fonts/LICENSE_LIBERATION",
    "./standard_fonts/LiberationSans-Bold.ttf",
    "./standard_fonts/LiberationSans-BoldItalic.ttf",
    "./standard_fonts/LiberationSans-Italic.ttf",
    "./standard_fonts/LiberationSans-Regular.ttf"
];
/* cmaps/ (~200 Indic/CJK map files) are cached on first use, not precached,
   to keep the install fast. */

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      /* cache files individually — one missing file (e.g. optional libs on a
         minimal upload) must never break the whole install */
      return Promise.all(SHELL.map(function(u){
        return c.add(u).catch(function(){ return null; });
      }));
    }).then(function(){ return self.skipWaiting(); })
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

  /* PDF.js engine / resources pulled from a CDN (when the site has no local
     copies): cache-first, so the viewer keeps working offline afterwards */
  if(url.hostname === "cdnjs.cloudflare.com" || url.hostname === "unpkg.com"){
    e.respondWith(
      caches.match(e.request).then(function(hit){
        return hit || fetch(e.request).then(function(res){
          if(res.ok){
            var copy = res.clone();
            caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
          }
          return res;
        });
      })
    );
    return;
  }

  if(url.origin !== location.origin) return;               // never touch API / fonts / other CDNs
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
