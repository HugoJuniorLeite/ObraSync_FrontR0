// src/components/RDO/GasitaOperacoes/helpers/uuid.js
export const uid = () => {
  try { return crypto.randomUUID(); } catch { return Math.random().toString(36).slice(2,10); }
};