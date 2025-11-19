// src/components/RDO/GasitaOperacoes/dashboard/WeeklyMonthlyCharts.jsx
import React from "react";
import { Card } from "../styles/layout";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

/**
 * historico = array de jornadas completas
 * Cada jornada tem: date, atendimentos[]
 */

export default function WeeklyMonthlyCharts({ historico = [] }) {
  const weekly = historico.map((j) => ({
    date: j.date,
    atend: j.atendimentos.length
  }));

  return (
    <Card>
      <div style={{ fontWeight: 700, color: "#f97316" }}>Evolução Semanal</div>

      <div style={{ width: "100%", height: 250, marginTop: 10 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#f97316" />
            <YAxis stroke="#f97316" />
            <Tooltip />
            <Line type="monotone" dataKey="atend" stroke="#f97316" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
