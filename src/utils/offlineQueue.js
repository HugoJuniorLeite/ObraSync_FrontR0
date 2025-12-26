
import { readArray, writeArray } from "./storageSafe";

const KEY = "obsync_offline_queue";

/**
 * Adiciona requisição à fila offline
 */
export function queueRequest(endpoint, method, body) {
  const list = readArray(KEY);

  list.push({
    endpoint,
    method,
    body,
    ts: Date.now(),
  });

  writeArray(KEY, list);
}

/**
 * Retorna fila completa
 */
export function getQueue() {
  return readArray(KEY);
}

/**
 * Remove itens já processados
 */
export function clearProcessed(indexesToRemove = []) {
  const list = readArray(KEY);

  const filtered = list.filter(
    (_, index) => !indexesToRemove.includes(index)
  );

  writeArray(KEY, filtered);
}
