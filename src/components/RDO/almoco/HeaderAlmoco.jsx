import React from "react";

export default function HeaderAlmoco({
  almoco,
  atividadeAtual,   
  onIniciar,
  step,
  onSuspender,
  onFinalizar
}) {
  // ESTADO 1 — antes de iniciar
  if (!almoco.inicio) {
    return (
      <div style={{ padding: 8, background: "#0E1A25", color: "#fff" }}>
        <button
          onClick={onIniciar}
          style={{
            padding: "8px 12px",
            background: "#facc15",
            color: "#000",
            borderRadius: 8,
            fontWeight: 600,
            width: "100%"
          }}
        >
          🍽️ Iniciar Almoço
        </button>
      </div>
    );
  }

  // ESTADO 2 — almoço ativo
  const dur = Math.floor((Date.now() - new Date(almoco.inicio)) / 60000);

  if (almoco.inicio && !almoco.fim) {
    return (
      <div
        style={{
          padding: 10,
          background: "#10202E",
          color: "#e5f0ff",
          display: "flex",
          flexDirection: "column",
          gap: 8
        }}
      >
        <div><strong>🍽️ Almoço iniciado:</strong> {almoco.inicio}</div>
        <div><strong>Duração:</strong> {dur} min</div>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={onSuspender}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              background: "#ef4444",
              color: "#fff",
              fontWeight: 600
            }}
          >
            Suspender
          </button>

          <button
            onClick={onFinalizar}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              background: "#22c55e",
              color: "#fff",
              fontWeight: 600
            }}
          >
            Finalizar
          </button>
        </div>
      </div>
    );
  }

  return null;
}
