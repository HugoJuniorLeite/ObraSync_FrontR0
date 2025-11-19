// src/components/RDO/GasitaOperacoes/mapa/usePathBuilder.js
/**
 * Pequena utilidade para construir path (array de [lat,lng]) e markers ordenados,
 * a partir de uma jornada. Pode ser usada no futuro para calcular distância
 * por segmento, tempo entre pontos, ou exportar rota.
 */

export function buildPathFromJornada(jornada) {
  const path = [];
  const markers = []; // { type, lat, lng, label, time }

  (jornada.atendimentos || []).forEach((att, idx) => {
    if (att.gpsInicio?.lat) {
      path.push([Number(att.gpsInicio.lat), Number(att.gpsInicio.lng)]);
      markers.push({ type: "start", lat: Number(att.gpsInicio.lat), lng: Number(att.gpsInicio.lng), label: `Início ${idx+1}`, time: att.atendimentoInicio });
    }
    if (att.gpsChegada?.lat) {
      path.push([Number(att.gpsChegada.lat), Number(att.gpsChegada.lng)]);
      markers.push({ type: "end", lat: Number(att.gpsChegada.lat), lng: Number(att.gpsChegada.lng), label: `Fim ${idx+1}`, time: att.finalizadoEm });
    }
  });

  (jornada.baseLogs || []).forEach(l => {
    if (l.gps?.lat) {
      path.push([Number(l.gps.lat), Number(l.gps.lng)]);
      markers.push({ type: l.tipo === "deslocamentoParaBase" ? "retBaseStart" : "retBaseEnd", lat: Number(l.gps.lat), lng: Number(l.gps.lng), label: l.tipo, time: l.time });
    }
  });

  if (jornada.almoco?.latInicio) {
    path.push([Number(jornada.almoco.latInicio), Number(jornada.almoco.lngInicio)]);
    markers.push({ type: "lunchStart", lat: Number(jornada.almoco.latInicio), lng: Number(jornada.almoco.lngInicio), label: "Início almoço", time: jornada.almoco.inicio });
  }
  if (jornada.almoco?.latFim) {
    path.push([Number(jornada.almoco.latFim), Number(jornada.almoco.lngFim)]);
    markers.push({ type: "lunchEnd", lat: Number(jornada.almoco.latFim), lng: Number(jornada.almoco.lngFim), label: "Fim almoço", time: jornada.almoco.fim });
  }

  return { path, markers };
}
