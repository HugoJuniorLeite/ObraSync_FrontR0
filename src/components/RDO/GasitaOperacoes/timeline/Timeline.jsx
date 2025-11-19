// src/components/RDO/GasitaOperacoes/timeline/Timeline.jsx
import React from "react";
import { Card } from "../styles/layout";

/**
 * Recebe timeline (array de eventos) ou recebe jornada e monta a timeline internamente.
 * Cada evento: { time, label, type }
 */

export default function Timeline({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return <Card>Nenhuma atividade registrada.</Card>;
  }

  return (
    <Card>
      <div style={{ fontWeight: 700, color: "#f97316" }}>Linha do tempo</div>
      <div style={{ marginTop: 10 }}>
        {timeline.map((ev, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "#f97316", marginTop: 6 }} />
            <div>
              <div style={{ fontWeight: 700 }}>{ev.label}</div>
              <div style={{ color: "#9fb4c9", fontSize: ".95rem" }}>{ev.time ? new Date(ev.time).toLocaleString("pt-BR") : "—"}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
