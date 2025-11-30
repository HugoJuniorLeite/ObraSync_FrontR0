import React from "react";
import { Card } from "../styles/layout";
import { fmt } from "../helpers/time";
import { haversine, BASE_COORDS } from "../helpers/distance";

const BaseInfo = ({ jornada }) => {
  const lastBaseEntry = [...(jornada.baseLogs || [])]
    .filter((i) => i.tipo === "chegadaBase")
    .sort((a, b) => new Date(b.time) - new Date(a.time))[0];

  const lastBaseExit = [...(jornada.baseLogs || [])]
    .filter((i) => i.tipo === "deslocamentoParaBase")
    .sort((a, b) => new Date(b.time) - new Date(a.time))[0];

  let distancia = "—";

  if (lastBaseExit?.gps) {
    const d = haversine(lastBaseExit.gps, BASE_COORDS);
    distancia = `${(d / 1000).toFixed(2)} km`;
  }

  return (
    <Card style={{ marginTop: 12 }}>
      <h3 style={{ color: "#e5f0ff", marginBottom: 10 }}>Status da Base</h3>

      <div style={{ marginBottom: 8 }}>
        <strong>Última chegada:</strong>{" "}
        {lastBaseEntry ? fmt(lastBaseEntry.time) : "—"}
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong>Última saída:</strong>{" "}
        {lastBaseExit ? fmt(lastBaseExit.time) : "—"}
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong>Distância estimada até a base:</strong> {distancia}
      </div>

      <div style={{ marginTop: 10, color: "#9fb4c9", fontSize: ".85rem" }}>
        *Distância calculada com base na última posição registrada.
      </div>
    </Card>
  );
};

export default BaseInfo;

