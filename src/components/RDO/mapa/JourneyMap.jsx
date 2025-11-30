import React from "react";
import usePathBuilder from "./usePathBuilder";
import { BASE_COORDS } from "../helpers/distance";

const JourneyMap = ({ jornada }) => {
  const path = usePathBuilder(jornada);

  if (!jornada) return null;

  const WIDTH = 360;
  const HEIGHT = 360;
  const scale = 3;

  const mapX = (lng) => WIDTH / 2 + lng * scale;
  const mapY = (lat) => HEIGHT / 2 - lat * scale;

  const baseX = mapX(BASE_COORDS.lng);
  const baseY = mapY(BASE_COORDS.lat);

  return (
    <div
      style={{
        padding: 10,
        background: "#071827",
        border: "1px solid #00396b",
        borderRadius: 8,
        marginTop: 12,
      }}
    >
      <div style={{ marginBottom: 8, color: "#dbeafe" }}>Mapa do Dia</div>

      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{
          background: "#0f172a",
          borderRadius: 8,
          border: "1px solid #00396b",
        }}
      >
        <circle cx={baseX} cy={baseY} r={5} fill="#22c55e" />
        <text x={baseX + 8} y={baseY} fill="#22c55e" fontSize="10">
          Base
        </text>

        <polyline
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          points={path
            .map((p) => `${mapX(p.lng)},${mapY(p.lat)}`)
            .join(" ")}
        />

        {path.map((p, i) => (
          <circle
            key={i}
            cx={mapX(p.lng)}
            cy={mapY(p.lat)}
            r={3}
            fill="#f59e0b"
          />
        ))}
      </svg>
    </div>
  );
};

export default JourneyMap;

