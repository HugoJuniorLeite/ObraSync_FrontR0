// src/components/RDO/helpers/eta.js

import { haversine } from "./distance";

/**
 * ETA local sem API (ZERO custo)
 */
export function calcularETA(gpsAtual, destino, velocidadeKmH = 35) {
  if (!gpsAtual || !destino) return null;

  const distancia = haversine(gpsAtual, destino); // metros
  const velocidadeMs = (velocidadeKmH * 1000) / 3600;

  const segundos = distancia / velocidadeMs;

  return {
    distancia,
    minutos: Math.max(1, Math.round(segundos / 60)),
  };
}
