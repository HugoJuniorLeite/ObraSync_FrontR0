const KEY = "current_journey_id";

export function saveCurrentJourneyId(id) {
  localStorage.setItem(KEY, String(id));
}

export function getCurrentJourneyId() {
  const v = localStorage.getItem(KEY);
  return v ? Number(v) : null;
}

export function clearCurrentJourneyId() {
  localStorage.removeItem(KEY);
}
