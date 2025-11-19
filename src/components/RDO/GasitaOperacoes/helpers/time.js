// src/components/RDO/GasitaOperacoes/helpers/time.js
export const fmt = (d) => d ? new Date(d).toLocaleString('pt-BR') : '—';
export const nowISO = () => new Date().toISOString();
export const calcDurationMs = (start, end) => { if(!start||!end) return 0; try { return Math.max(0, new Date(end) - new Date(start)); } catch { return 0; } };
export const msToHuman = (ms) => {
  if (!ms||ms<=0) return '0min';
  const min = Math.floor(ms/60000); const h = Math.floor(min/60); const m = min%60; return h>0? `${h}h ${m}min` : `${m}min`;
};