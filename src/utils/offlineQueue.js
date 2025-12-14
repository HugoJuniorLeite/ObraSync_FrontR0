const KEY = "obsync_offline_queue";

export function queueRequest(endpoint, method, body) {
  const raw = localStorage.getItem(KEY);
  const list = raw ? JSON.parse(raw) : [];

  list.push({ endpoint, method, body, ts: Date.now() });

  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getQueue() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function clearProcessed(indexesToRemove) {
  const list = getQueue();
  const filtered = list.filter((_, i) => !indexesToRemove.includes(i));
  localStorage.setItem(KEY, JSON.stringify(filtered));
}
