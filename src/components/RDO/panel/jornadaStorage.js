// const KEY = "obra_sync_jornadas";

import { readArray, writeArray } from "../../../utils/storageSafe";

const KEY = "atendimentos_v3"


// export function getTodasJornadas() {
//   try {
//     return JSON.parse(localStorage.getItem(KEY)) || [];
//   } catch {
//     return [];
//   }
// }

export function getTodasJornadas() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// export function salvarJornada(jornada) {
//   // const STORAGE_JOURNEYS = "obra_sync_jornadas";

// const STORAGE_JOURNEYS = "atendimentos_v3";


//   const raw = localStorage.getItem(STORAGE_JOURNEYS);
//   const lista = raw ? JSON.parse(raw) : [];

//   const idx = lista.findIndex((j) => j.id === jornada.id);

//   if (idx >= 0) {
//     // atualiza existente
//     lista[idx] = jornada;
//   } else {
//     // inclui nova
//     lista.push(jornada);
//   }

//   localStorage.setItem(STORAGE_JOURNEYS, JSON.stringify(lista));
// }

//--------------------------------------------------------------------------

// const STORAGE_JOURNEYS = "atendimentos_v3";

// export function salvarJornada(jornada) {
//   let lista = [];

//   try {
//     const raw = localStorage.getItem(STORAGE_JOURNEYS);
//     const parsed = raw ? JSON.parse(raw) : [];

//     // 🔒 GARANTIA DE ARRAY
//     lista = Array.isArray(parsed) ? parsed : [];
//   } catch {
//     lista = [];
//   }

//   const idx = lista.findIndex((j) => j.id === jornada.id);

//   if (idx >= 0) {
//     lista[idx] = jornada;
//   } else {
//     lista.push(jornada);
//   }

//   localStorage.setItem(STORAGE_JOURNEYS, JSON.stringify(lista));
// }

//---------------------------------------------------------------------------


// import { readArray, writeArray } from "../utils/storageSafe";

export function salvarJornada(jornada) {
  const lista = readArray("atendimentos_v3");
  const idx = lista.findIndex((j) => j.id === jornada.id);

  if (idx >= 0) lista[idx] = jornada;
  else lista.push(jornada);

  writeArray("atendimentos_v3", lista);
}
