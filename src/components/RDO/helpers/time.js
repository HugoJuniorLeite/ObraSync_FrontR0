export const nowISO = () => new Date().toISOString();

export const fmt = (d) =>
  d ? new Date(d).toLocaleString("pt-BR") : "—";

export const calcDurationMs = (start, end) => {
  if (!start || !end) return 0;
  try {
    return new Date(end) - new Date(start);
  } catch {
    return 0;
  }
};

export const msToHuman = (ms) => {
  if (ms <= 0) return "0 min";
  const min = Math.floor(ms / 60000);
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
};

