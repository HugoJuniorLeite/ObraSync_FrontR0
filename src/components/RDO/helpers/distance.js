// Coordenadas fixas da base (use as coordenadas reais depois)
export const BASE_COORDS = {
  lat: -23.57647,
  lng: -46.60864,
};

// Fórmula de Haversine (distância entre 2 pontos)
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
