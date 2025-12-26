export function acquireActionLock(key, ttlMs = 30000) {
  const raw = localStorage.getItem(key);

  if (raw) {
    try {
      const { time } = JSON.parse(raw);
      if (Date.now() - time < ttlMs) {
        return false; // 🔒 lock ainda válido
      }
    } catch {
      // ignora parse inválido
    }
  }

  localStorage.setItem(key, JSON.stringify({ time: Date.now() }));
  return true;
}

export function releaseActionLock(key) {
  localStorage.removeItem(key);
}
