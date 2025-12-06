const KEY = "saved_journeys";

export function getTodasJornadas() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function salvarJornada(jornada) {
  const arr = getTodasJornadas();
  arr.push(jornada);
  localStorage.setItem(KEY, JSON.stringify(arr));
}
