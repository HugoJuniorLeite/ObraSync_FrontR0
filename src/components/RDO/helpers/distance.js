// src/components/RDO/helpers/gps.js
// Distância, coordenadas, haversine e cálculo de distância total.



export const BASE_COORDS = {
  lat: -23.57647,
  lng: -46.60864,
};

export function haversine(a, b) {
  if (!a || !b || !a.lat || !b.lat) return 0;

  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000; // metros

  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function calcularDistanciaTotal(jornada = {}) {
  const points = [];

  (jornada.atendimentos || []).forEach((att) => {
    if (att?.gpsInicio?.lat) points.push(att.gpsInicio);
    if (att?.gpsChegada?.lat) points.push(att.gpsChegada);
  });

  (jornada.baseLogs || []).forEach((log) => {
    if (log?.gps?.lat) points.push(log.gps);
  });

  let total = 0;

  for (let i = 1; i < points.length; i++) {
    total += haversine(points[i - 1], points[i]);
  }

  return Math.round(total);
}

export function distanceMeters(a, b) {
  if (!a || !b) return 0;

  const R = 6371000; // raio da Terra em metros
  const toRad = (v) => (v * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/**
 * Distância restante seguindo a rota (polyline)
 */

export function distanciaRestanteNaRota(gps, rotaCoords) {
  if (!gps || !rotaCoords || rotaCoords.length === 0) return null;

  let nearestIndex = 0;
  let menorDist = Infinity;

  rotaCoords.forEach((p, i) => {
    const d = distanceMeters(gps, p);
    if (d < menorDist) {
      menorDist = d;
      nearestIndex = i;
    }
  });

  let total = 0;
  for (let i = nearestIndex; i < rotaCoords.length - 1; i++) {
    total += distanceMeters(
      rotaCoords[i],
      rotaCoords[i + 1]
    );
  }

  return total; // metros
}
