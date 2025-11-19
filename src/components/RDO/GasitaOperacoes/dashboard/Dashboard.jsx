// src/components/RDO/GasitaOperacoes/dashboard/Dashboard.jsx
import React from "react";
import { Card } from "../styles/layout";
import WeeklyMonthlyCharts from "./WeeklyMonthlyCharts";
import Ranking from "./Ranking";
import { calcularDistanciaTotal } from "../helpers/distance";

export default function Dashboard({ jornada, historico }) {
  if (!jornada) return <Card>Nenhuma jornada carregada.</Card>;

  return (
    <div>
      <Card>
        <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#f97316" }}>
          Dashboard Operacional
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 20 }}>
          <div>
            <strong>Atendimentos:</strong> {jornada.atendimentos.length}
          </div>
          <div>
            <strong>Distância percorrida:</strong>{" "}
            {(calcularDistanciaTotal(jornada) / 1000).toFixed(2)} km
          </div>
          <div>
            <strong>Almoço:</strong>{" "}
            {jornada.almoco?.inicio ? "Realizado" : "Não registrado"}
          </div>
        </div>
      </Card>

      <div style={{ marginTop: 20 }}>
        <WeeklyMonthlyCharts historico={historico} />
      </div>

      <div style={{ marginTop: 20 }}>
        <Ranking historico={historico} />
      </div>
    </div>
  );
}
