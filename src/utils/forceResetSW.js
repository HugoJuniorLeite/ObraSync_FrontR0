export async function forceResetSW() {
  if (!("serviceWorker" in navigator)) return;

  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(regs.map((r) => r.unregister()));

  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));

  // hard reload
  window.location.href = window.location.origin;
}
