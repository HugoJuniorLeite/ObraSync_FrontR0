// src/components/RDO/GasitaOperacoes/dashboard/Ranking.jsx
import React from "react";
import { Card } from "../styles/layout";

export default function Ranking({ historico = [] }) {
  const ranking = historico
    .map((j) => ({
      tecnico: j.technician,
      atendimentos: j.atendimentos.length
    }))
    .sort((a, b) => b.atendimentos - a.atendimentos);

  return (
    <Card>
      <div style={{ fontWeight: 700, color: "#f97316" }}>Ranking de Técnicos</div>

      <table style={{ width: "100%", marginTop: 10 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Técnico</th>
            <th style={{ textAlign: "right" }}>Atendimentos</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((r, i) => (
            <tr key={i}>
              <td>{r.tecnico}</td>
              <td style={{ textAlign: "right" }}>{r.atendimentos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
