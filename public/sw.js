const CACHE_VERSION = "v3"; // 🔥 troque a cada deploy
const CACHE_NAME = `obrasync-shell-${CACHE_VERSION}`;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", async () => {
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => key !== CACHE_NAME)
      .map((key) => caches.delete(key))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // ❌ Nunca interceptar assets
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.url.includes("/assets/")
  ) {
    return;
  }

  // API sempre rede
  if (request.url.includes("/mobile-")) {
    event.respondWith(fetch(request));
    return;
  }

  // SPA shell
  event.respondWith(
    fetch(request).catch(() => caches.match("/index.html"))
  );
});
