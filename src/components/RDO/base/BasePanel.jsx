import React from "react";
import { Card } from "../styles/layout";
import BaseInfo from "./BaseInfo";
import BaseReturnButton from "./BaseReturnButton";
import { fmt } from "../helpers/time";

const BasePanel = ({
  jornada,
  onIniciarRetornoBase,
  onConfirmarChegadaBase,
}) => {
  const ultimaAtividade = [...(jornada.atendimentos || [])]
    .filter((a) => a.finalizadoEm)
    .sort((a, b) => new Date(b.finalizadoEm) - new Date(a.finalizadoEm))[0];

  return (
    <div style={{ padding: 10 }}>
      <Card>
        <h3 style={{ marginBottom: 10, color: "#e5f0ff" }}>
          Painel da Jornada
        </h3>

        <div>
          <strong>Início do expediente:</strong>{" "}
          {fmt(jornada.inicioExpediente)}
        </div>

        {jornada.fimExpediente && (
          <div style={{ marginTop: 6 }}>
            <strong>Fim do expediente:</strong>{" "}
            {fmt(jornada.fimExpediente)}
          </div>
        )}

        <div style={{ marginTop: 6 }}>
          <strong>Última atividade:</strong>{" "}
          {ultimaAtividade
            ? fmt(ultimaAtividade.finalizadoEm)
            : "—"}
        </div>
      </Card>

      <BaseInfo jornada={jornada} />

      <BaseReturnButton
        jornada={jornada}
        onIniciarRetornoBase={onIniciarRetornoBase}
        onConfirmarChegadaBase={onConfirmarChegadaBase}
      />
    </div>
  );
};

export default BasePanel;

