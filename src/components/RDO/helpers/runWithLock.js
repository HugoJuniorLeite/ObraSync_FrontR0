

import { acquireActionLock, releaseActionLock } from "../../../utils/actionLock";

/**
 * Executa uma ação protegida contra:
 * - double click
 * - múltiplas execuções simultâneas
 * - race condition
 *
 * NÃO substitui lógica de negócio
 */
export async function runWithLock(lockKey, setLoading, fn) {
  if (!acquireActionLock(lockKey)) {
    console.warn(`🚫 Ação já em andamento: ${lockKey}`);
    return;
  }

  setLoading?.(true);

  try {
    await fn();
  } finally {
    setLoading?.(false);
    releaseActionLock(lockKey);
  }
}
