// src/components/RDO/helpers/time.js
// Funções genéricas de data e tempo.

export const calcDurationMs = (start, end) => {
  if (!start || !end) return 0;
  try {
    return new Date(end) - new Date(start);
  } catch {
    return 0;
  }
};

export const fmt = (d) =>
  d ? new Date(d).toLocaleString("pt-BR") : "—";

export const msToHuman = (ms) => {
  if (!ms || ms <= 0) return "0 min";
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours}h ${rest}min` : `${rest}min`;
};

export const nowISO = () => new Date().toISOString();
