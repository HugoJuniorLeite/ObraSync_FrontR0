// import { loadSavedJourneys, saveJourneysArray } from "../services/jornadaStorage";

import { readArray } from "./storageSafe";

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

  return readArray("atendimentos_v3");
}

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


// utils/journeyStore.js

export const getAttendancePatchId = (jornada, attendanceId) => {
  if (!jornada || !attendanceId) return null;

  const atendimento = jornada.atendimentos?.find(
    (a) => a.id === attendanceId
  );

  if (!atendimento) return null;

  // 🔥 prioridade para backendId, fallback para local id
  return atendimento.backendId || atendimento.id;
};

export const getBaseLogPatchId = (jornada, baseLogId) => {
  if (!jornada || !baseLogId) return null;

  const log = jornada.baseLogs?.find(
    (b) => b.id === baseLogId
  );

  if (!log) return null;

  // 🔥 prioridade para backendId, fallback para local id
  return log.backendId || log.id;
};


export const getLunchPatchId = (jornada, lunchId) => {
  if (!lunchId) return null;

  // 1️⃣ tenta no estado React
  const almocoMemoria = jornada?.almocos?.find(
    (a) => a.id === lunchId
  );

  if (almocoMemoria?.backendId) {
    return almocoMemoria.backendId;
  }

  // 2️⃣ fonte da verdade: DRAFT
  const draft = loadDraftJornada();

  const almocoDraft = draft?.almocos?.find(
    (a) => a.id === lunchId
  );

  if (almocoDraft?.backendId) {
    return almocoDraft.backendId;
  }

  // 3️⃣ fallback: UUID local (fila)
  return lunchId;
};

