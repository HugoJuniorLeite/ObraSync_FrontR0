// src/components/RDO/GasitaOperacoes/helpers/distance.js
// haversine (returns meters)
export const haversine = (a,b) => {
  if (!a||!b||a.lat==null||b.lat==null) return 0;
  const toRad = v => (v*Math.PI)/180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat); const lat2 = toRad(b.lat);
  const sinDlat = Math.sin(dLat/2)**2; const sinDlon = Math.sin(dLon/2)**2;
  const aCalc = sinDlat + Math.cos(lat1)*Math.cos(lat2)*sinDlon;
  const c = 2*Math.atan2(Math.sqrt(aCalc), Math.sqrt(1-aCalc));
  return R * c;
};

export const calcularDistanciaTotal = (jornada) => {
  const points = [];
  jornada.atendimentos?.forEach(att => { if(att.gpsInicio?.lat) points.push(att.gpsInicio); if(att.gpsChegada?.lat) points.push(att.gpsChegada); });
  jornada.baseLogs?.forEach(l => { if(l.gps?.lat) points.push(l.gps); });
  let total = 0; for(let i=1;i<points.length;i++) total += haversine(points[i-1], points[i]);
  return Math.round(total); // meters
};