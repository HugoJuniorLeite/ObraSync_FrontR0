// import { loadSavedJourneys, saveJourneysArray } from "../services/jornadaStorage";

// const KEY = "current_journey_id";


// //--- trecho novo ---------------------

// const JOURNEYS_KEY = "jornadas_finalizadas";

// export function getLocalJourneys() {
//   try {
//     return JSON.parse(localStorage.getItem(JOURNEYS_KEY)) || [];
//   } catch {
//     return [];
//   }
// }

// // src/services/jornadaStorage.js

// export const updateLocalJourney = (id, patch) => {
//   try {
//     const list = loadSavedJourneys();

//     const updated = list.map((j) =>
//       j.id === id ? { ...j, ...patch } : j
//     );

//     saveJourneysArray(updated);
//   } catch (e) {
//     console.warn("Erro ao atualizar jornada local:", e);
//   }
// };

// //-----------------fim do trecho --------


// export function saveLocalJourneys(list) {
//   localStorage.setItem(JOURNEYS_KEY, JSON.stringify(list));
// }


// export function saveCurrentJourneyId(id) {
//   localStorage.setItem(KEY, String(id));
// }

// export function getCurrentJourneyId() {
//   const v = localStorage.getItem(KEY);
//   return v ? Number(v) : null;
// }

// export function clearCurrentJourneyId() {
//   localStorage.removeItem(KEY);
// }


/**
 * =====================================================
 * CHAVES DE STORAGE
 * =====================================================
 */

// Jornada em andamento (wizard)
const DRAFT_KEY = "atendimentoWizardDraft_v3";

// Jornadas finalizadas (histórico)
const SAVED_KEY = "atendimentos_v3";

// Jornada atual no backend
const CURRENT_ID_KEY = "current_journey_id";

/**
 * =====================================================
 * JORNADA EM ANDAMENTO (DRAFT)
 * =====================================================
 */

export const loadDraftJornada = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveDraftJornada = (jornada) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(jornada));
  } catch {
    // ignore
  }
};

export const clearDraftJornada = () => {
  localStorage.removeItem(DRAFT_KEY);
};

/**
 * =====================================================
 * JORNADAS FINALIZADAS (HISTÓRICO)
 * =====================================================
 */

export const loadSavedJourneys = () => {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveJourneysArray = (arr) => {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(arr));
  } catch {
    // ignore
  }
  return arr;
};

/**
 * Adiciona uma nova jornada finalizada
 */
export const appendJourney = (jornadaFinalizada) => {
  const prev = loadSavedJourneys();
  return saveJourneysArray([...prev, jornadaFinalizada]);
};

/**
 * 🔥 Atualiza parcialmente uma jornada já salva
 * Usado para:
 * - sync_status
 * - synced_at
 * - correções locais
 */
export const updateLocalJourney = (id, patch) => {
  try {
    const list = loadSavedJourneys();

    const updated = list.map((j) =>
      j.id === id ? { ...j, ...patch } : j
    );

    saveJourneysArray(updated);
  } catch (e) {
    console.warn("Erro ao atualizar jornada local:", e);
  }
};

/**
 * =====================================================
 * CONTROLE DA JORNADA ATUAL (ID BACKEND)
 * =====================================================
 */

export const saveCurrentJourneyId = (id) => {
  try {
    localStorage.setItem(CURRENT_ID_KEY, String(id));
  } catch {
    // ignore
  }
};

export const getCurrentJourneyId = () => {
  const v = localStorage.getItem(CURRENT_ID_KEY);
  return v ? Number(v) : null;
};

export const clearCurrentJourneyId = () => {
  localStorage.removeItem(CURRENT_ID_KEY);
};
