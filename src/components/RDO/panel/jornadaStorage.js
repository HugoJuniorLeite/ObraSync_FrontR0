// const KEY = "obra_sync_jornadas";

import { readArray, writeArray } from "../../../utils/storageSafe";

const KEY = "atendimentos_v3"

export function getTodasJornadas() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function salvarJornada(jornada) {
  const lista = readArray("atendimentos_v3");
  const idx = lista.findIndex((j) => j.id === jornada.id);

  if (idx >= 0) lista[idx] = jornada;
  else lista.push(jornada);

  writeArray("atendimentos_v3", lista);
}
