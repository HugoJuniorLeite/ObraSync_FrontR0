const KEY = "obra_sync_jornadas";


export function getTodasJornadas() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function salvarJornada(jornada) {
  const STORAGE_JOURNEYS = "obra_sync_jornadas";
  const raw = localStorage.getItem(STORAGE_JOURNEYS);
  const lista = raw ? JSON.parse(raw) : [];

  const idx = lista.findIndex((j) => j.id === jornada.id);

  if (idx >= 0) {
    // atualiza existente
    lista[idx] = jornada;
  } else {
    // inclui nova
    lista.push(jornada);
  }

  localStorage.setItem(STORAGE_JOURNEYS, JSON.stringify(lista));
}
