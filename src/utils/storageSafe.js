// src/utils/storageSafe.js

export function readArray(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeArray(key, value) {
  if (!Array.isArray(value)) return;
  localStorage.setItem(key, JSON.stringify(value));
}
