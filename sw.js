// Forma service worker: HTML всегда с сети (правки приходят сразу), оффлайн — из кэша.
const V = "20261007-082125";
const C = "forma-" + V;
const PRE = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon-180.png", "./fonts/fonts.css", "./data/base_products.json", "./data/ru_products.json", "./fonts/onest-cyrillic-wght-normal.woff2", "./fonts/onest-latin-wght-normal.woff2"];
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(PRE)).catch(() => {})); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== C).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  const nav = r.mode === "navigate" || /\.(html|webmanifest)$/.test(new URL(r.url).pathname);
  if (nav) {
    e.respondWith(fetch(r, { cache: "no-store" }).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match("./index.html"))));
  } else {
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); return res; })));
  }
});
