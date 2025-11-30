// src/services/jornadaStorage.js

const STORAGE_KEY = "atendimentoWizardDraft_v3";
const SAVED_KEY = "atendimentos_v3";

// Jornada em andamento (draft)
export const loadDraftJornada = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveDraftJornada = (jornada) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jornada));
  } catch {
    // ignora
  }
};

// Jornadas finalizadas
export const loadSavedJourneys = () => {
  try {
    const raw = localStorage.getItem(SAVED_KEY) || "[]";
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveJourneysArray = (arr) => {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(arr));
  } catch {
    // ignora
  }
  return arr;
};

// Atalho: adiciona uma jornada à lista salva
export const appendJourney = (jornadaFinalizada) => {
  const prev = loadSavedJourneys();
  const arr = [...prev, jornadaFinalizada];
  return saveJourneysArray(arr);
};
