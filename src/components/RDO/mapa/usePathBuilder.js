import { useMemo } from "react";

export default function usePathBuilder(jornada) {
  return useMemo(() => {
    if (!jornada) return [];

    const pts = [];

    (jornada.atendimentos || []).forEach((a) => {
      if (a.gpsInicio?.lat) pts.push(a.gpsInicio);
      if (a.gpsChegada?.lat) pts.push(a.gpsChegada);
    });

    (jornada.baseLogs || []).forEach((b) => {
      if (b.gps?.lat) pts.push(b.gps);
    });

    return pts;
  }, [jornada]);
}

