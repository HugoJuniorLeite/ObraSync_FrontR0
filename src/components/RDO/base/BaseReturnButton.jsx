import React from "react";

const BaseReturnButton = ({
  jornada,
  onIniciarRetornoBase,
  onConfirmarChegadaBase,
}) => {
  const isReturning = (jornada.baseLogs || []).some(
    (i) => i.tipo === "deslocamentoParaBase" && !i.finalizado
  );

  const hasArrived = (jornada.baseLogs || []).some(
    (i) => i.tipo === "chegadaBase"
  );

  return (
    <div style={{ marginTop: 14 }}>
      {!isReturning && !hasArrived && (
        <button
          onClick={onIniciarRetornoBase}
          style={{
            padding: "10px 12px",
            width: "100%",
            background: "#38bdf8",
            border: "1px solid #38bdf8",
            borderRadius: 10,
            color: "#081018",
          }}
        >
          Iniciar retorno para a base
        </button>
      )}

      {isReturning && (
        <button
          onClick={onConfirmarChegadaBase}
          style={{
            padding: "10px 12px",
            width: "100%",
            background: "#0ea5e9",
            border: "1px solid #0ea5e9",
            borderRadius: 10,
            color: "white",
          }}
        >
          Confirmar chegada à base
        </button>
      )}

      {hasArrived && (
        <div
          style={{
            textAlign: "center",
            color: "#a7f3d0",
            marginTop: 8,
          }}
        >
          ✓ Chegada à base registrada
        </div>
      )}
    </div>
  );
};

export default BaseReturnButton;

