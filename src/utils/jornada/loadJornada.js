// src/utils/jornada/loadJornada.js

import { generateUUID } from "../../components/RDO/helpers/uuid";


const STORAGE_KEY = "atendimentos_v3";

export function loadJornada() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignora
  }

  return {
    id: generateUUID(),
    date: new Date().toISOString().split("T")[0],
    inicioExpediente: null,
    fimExpediente: null,
    atendimentos: [],
    almocos: [],
    atividadeAtual: "livre",
    atividadeAnterior: null,
    baseLogs: [],
  };
}
