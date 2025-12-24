const CACHE_NAME = "obrasync-v1";
const API_QUEUE_KEY = "obsync_offline_queue";

// Instala
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(["/", "/index.html"])
    )
  );
  self.skipWaiting();
});

// Ativa
self.addEventListener("activate", () => {
  self.clients.claim();
});

// Fetch (offline-first)
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // API → sempre tenta rede
  if (request.url.includes("/mobile-")) {
    event.respondWith(fetch(request));
    return;
  }

  // App shell
  event.respondWith(
    caches.match(request).then((res) => res || fetch(request))
  );
});

// 🔄 BACKGROUND SYNC
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-offline-queue") {
    event.waitUntil(processQueue());
  }
});

// Processa fila offline
async function processQueue() {
  const clients = await self.clients.matchAll();
  const client = clients[0];

  if (!client) return;

  client.postMessage({ type: "PROCESS_QUEUE" });
}
