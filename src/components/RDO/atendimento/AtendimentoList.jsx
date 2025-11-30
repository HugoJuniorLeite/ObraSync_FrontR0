import React from "react";
import { Card } from "../styles/layout";
import { fmt } from "../helpers/time";

const AtendimentoList = ({ atendimentos, onSelect }) => {
  return (
    <Card>
      <h3 style={{ color: "#e5f0ff", marginBottom: 10 }}>Atendimentos</h3>
      {atendimentos.length === 0 && (
        <div style={{ color: "#94a3b8" }}>
          Nenhum atendimento registrado.
        </div>
      )}

      {atendimentos.map((a) => (
        <div
          key={a.id}
          onClick={() => onSelect(a)}
          style={{
            borderBottom: "1px solid #00396b",
            paddingBottom: 6,
            marginBottom: 6,
            cursor: "pointer",
          }}
        >
          <strong>
            {a.notaEnviada === "sim"
              ? `OS ${a.ordemTipo}-${a.ordemNumero}`
              : "Sem OS"}
          </strong>
          <br />
          <span style={{ fontSize: ".9rem" }}>
            {fmt(a.atendimentoInicio)} → {fmt(a.finalizadoEm)}
          </span>
        </div>
      ))}
    </Card>
  );
};

export default AtendimentoList;

