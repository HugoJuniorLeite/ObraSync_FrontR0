export async function scheduleSync() {
  if (
    "serviceWorker" in navigator &&
    "SyncManager" in window
  ) {
    const reg = await navigator.serviceWorker.ready;
    await reg.sync.register("sync-offline-queue");
  }
}
