import React from "react";
import { Card, Label } from "../styles/layout";
import { montarTimeline } from "../helpers/jornada";
import { fmt } from "../helpers/time";

const Timeline = ({ jornada }) => {
  const events = montarTimeline(jornada);

  return (
    <Card style={{ marginTop: 12 }}>
      <Label>Linha do Tempo</Label>

      <div style={{ marginTop: 12 }}>
        {events.length === 0 && (
          <div style={{ color: "#94a3b8" }}>Nenhum registro encontrado.</div>
        )}

        {events.map((ev, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              marginBottom: 10,
              color: "#cfe9ff",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#38bdf8",
                marginTop: 6,
              }}
            />
            <div>
              <div style={{ fontWeight: 700 }}>{ev.label}</div>
              <div style={{ fontSize: ".9rem", color: "#a9c3de" }}>
                {fmt(ev.time)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Timeline;

