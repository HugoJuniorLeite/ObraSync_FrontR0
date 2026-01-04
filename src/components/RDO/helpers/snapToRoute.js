// src/components/RDO/helpers/snapToRoute.js

import { haversine } from "./distance";

/**
 * Ajusta o GPS para o ponto mais próximo da rota (VISUAL ONLY)
 */
export function snapToRoute(gps, rotaCoords, limite = 50) {
  if (
    !gps ||
    !Number.isFinite(gps.lat) ||
    !Number.isFinite(gps.lng) ||
    !Array.isArray(rotaCoords) ||
    rotaCoords.length === 0
  ) {
    return gps;
  }

  let melhor = gps;
  let menor = Infinity;

  for (const p of rotaCoords) {
    const d = haversine(gps, p);
    if (d < menor) {
      menor = d;
      melhor = p;
    }
  }

  return menor <= limite ? melhor : gps;
}
