export function useJourneys() {
  const load = () => {
    try {
      return JSON.parse(localStorage.getItem("obra_sync_jornadas")) || [];
    } catch {
      return [];
    }
  };

  const getAll = () => load();

  const filterByDate = (date) => {
    if (!date) return load();
    return load().filter(j => j.date === date);
  };

  return { getAll, filterByDate };
}
