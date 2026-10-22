const CACHE = "hailspec-shell-v1";
const SHELL = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(SHELL.map(async (url) => {
      try {
        const response = await fetch(url, { cache: "no-cache" });
        if (response && response.ok) await cache.put(url, response);
      } catch (err) {
        // A missing optional file should not block the rest of the shell.
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function fromCache(cache, request) {
  const cached = await cache.match(request);
  if (cached) return cached;
  if (request.mode === "navigate") return cache.match("./index.html");
  return null;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const fresh = await fetch(request);
      if (fresh && fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    } catch (err) {
      const cached = await fromCache(cache, request);
      if (cached) return cached;
      throw err;
    }
  })());
});
