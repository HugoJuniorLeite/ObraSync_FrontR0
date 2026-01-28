// src/components/RDO/helpers/ensureGpsInicio.js
import { getLocation } from "./location";

export async function ensureGpsInicio(current, updateCurrentField) {
  if (
    current?.gpsInicio &&
    Number.isFinite(current.gpsInicio.lat) &&
    Number.isFinite(current.gpsInicio.lng)
  ) {
    return current.gpsInicio;
  }

  const gps = await getLocation({
    highAccuracy: true,
    useCache: false,
  });

  if (gps) {
    updateCurrentField("gpsInicio", gps);
    return gps;
  }

  return null;
}
