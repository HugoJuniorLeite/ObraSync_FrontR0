// src/utils/geoUtils.js

// haversine distance (metros)
export const haversine = (a, b) => {
  if (!a || !b || !a.lat || !b.lat) return 0;
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDlat = Math.sin(dLat / 2) ** 2;
  const sinDlon = Math.sin(dLon / 2) ** 2;
  const aCalc = sinDlat + Math.cos(lat1) * Math.cos(lat2) * sinDlon;
  const c = 2 * Math.atan2(Math.sqrt(aCalc), Math.sqrt(1 - aCalc));
  return R * c;
};

// BASE fixa (igual ao seu código)
export const BASE_COORDS = { lat: -23.57647, lng: -46.60864 };

/**
 * Distância total percorrida na jornada atual (atendimentos + baseLogs)
 */
export const calcularDistanciaTotal = (jornada) => {
  if (!jornada) return 0;
  let tot = 0;

  (jornada.atendimentos || []).forEach((a) => {
    if (a.rota && a.rota.length > 1) {
      for (let i = 1; i < a.rota.length; i++) {
        tot += haversine(a.rota[i - 1], a.rota[i]);
      }
    }
  });

  const logs = jornada.baseLogs || [];
  for (let i = 1; i < logs.length; i++) {
    const p1 = logs[i - 1].gps;
    const p2 = logs[i].gps;
    if (p1 && p2 && p1.lat && p2.lat) {
      tot += haversine(p1, p2);
    }
  }

  return Math.round(tot);
};

// Versão para qualquer jornada (histórico)
export const calcularDistanciaTotalDe = (jor) => calcularDistanciaTotal(jor);

// Versão usada em exportJornadaAsPdf no histórico
export const calcularDistanciaTotalFromJornada = (j) =>
  calcularDistanciaTotal(j);
