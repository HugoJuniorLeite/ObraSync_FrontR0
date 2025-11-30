import React from "react";
import { Card } from "../styles/layout";
import {
  calcularTotais,
  calcularDistanciaTotal,
  calcularJornadaTotal,
  calcularOciosidade,
  calcularProdutividade,
} from "../helpers/jornada";
import { msToHuman } from "../helpers/time";

const InfoLine = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "6px 0",
      fontSize: ".95rem",
      color: "#dbeafe",
    }}
  >
    <span style={{ color: "#9fb4c9" }}>{label}</span>
    <strong>{value}</strong>
  </div>
);

const RdoMain = ({ jornada }) => {
  const { atendimentoMs, deslocamentoMs, almocoMs } = calcularTotais(jornada);

  const jornadaMs = calcularJornadaTotal(jornada);
  const ociosidadeMs = calcularOciosidade(jornada);
  const produtividade = calcularProdutividade(jornada);

  const distancia = calcularDistanciaTotal(jornada);
  const distanciaKm = (distancia / 1000).toFixed(2);

  return (
    <div style={{ padding: 10 }}>
      <Card>
        <h3 style={{ marginBottom: 10, color: "#e5f0ff" }}>Resumo da Jornada</h3>

        <InfoLine label="Jornada total" value={msToHuman(jornadaMs)} />
        <InfoLine label="Tempo de atendimento" value={msToHuman(atendimentoMs)} />
        <InfoLine label="Tempo em deslocamento" value={msToHuman(deslocamentoMs)} />
        <InfoLine label="Almoço" value={msToHuman(almocoMs)} />
        <InfoLine label="Ociosidade" value={msToHuman(ociosidadeMs)} />

        <div style={{ height: 1, background: "#00396b", margin: "12px 0" }} />

        <InfoLine label="Produtividade" value={`${produtividade}%`} />
        <InfoLine label="Distância percorrida" value={`${distanciaKm} km`} />
      </Card>
    </div>
  );
};

export default RdoMain;

