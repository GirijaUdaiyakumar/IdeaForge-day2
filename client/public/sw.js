const CACHE_NAME = "ideaforge-v3";
const PRECACHE = ["/index.html"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Never intercept API calls
  if (url.pathname.startsWith("/api/")) return;

  // Never intercept non-GET requests
  if (event.request.method !== "GET") return;

  // For navigation requests (HTML pages), always go to network first
  // Fall back to index.html for SPA routing (never return 404)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch("/index.html").catch(() => caches.match("/index.html"))
    );
    return;
  }

  // For static assets: cache first, then network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
