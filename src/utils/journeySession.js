// src/utils/journeySession.js

import { clearDraftJornada, clearCurrentJourneyId } from "./journeyStore";
import { releaseActionLock } from "./actionLock";

const STORAGE_KEY = "atendimentos_v3";

/**
 * 🔥 Fonte única de verdade da sessão da jornada
 * Chamar APENAS quando a jornada for encerrada com sucesso
 */
export function resetJourneySession() {
  // 1️⃣ Remove jornada local salva
  localStorage.removeItem(STORAGE_KEY);

  // 2️⃣ Remove draft em andamento
  clearDraftJornada();

  // 3️⃣ Remove referência da jornada ativa
  clearCurrentJourneyId();

  // 4️⃣ Libera locks de ações críticas
  releaseActionLock("iniciar_jornada");
  releaseActionLock("encerrar_jornada");
}
