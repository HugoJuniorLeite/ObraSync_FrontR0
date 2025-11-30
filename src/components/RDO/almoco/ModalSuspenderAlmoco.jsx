import React from "react";
import OverlayModal from "./OverlayModal";
import { BigBtn } from "../styles/layout";

export default function ModalSuspenderAlmoco({
  motivo,
  setMotivo,
  solicitante,
  setSolicitante,
  onCancel,
  onConfirm
}) {
  return (
    <OverlayModal>
      <h3 style={{ marginBottom: 12, color: "#facc15" }}>
        Suspender Almoço
      </h3>

      <label style={{ color: "#cbd5e1", marginBottom: 4 }}>
        Motivo
      </label>
      <textarea
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        style={{
          width: "100%",
          background: "#071827",
          border: "1px solid #00396b",
          color: "#e5f0ff",
          padding: 8,
          borderRadius: 8,
          minHeight: 80,
          marginBottom: 16
        }}
      />

      <label style={{ color: "#cbd5e1", marginBottom: 4 }}>
        Solicitado por
      </label>
      <input
        value={solicitante}
        onChange={(e) => setSolicitante(e.target.value)}
        style={{
          width: "100%",
          background: "#071827",
          border: "1px solid #00396b",
          color: "#e5f0ff",
          padding: 8,
          borderRadius: 8,
          marginBottom: 20
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <BigBtn onClick={onCancel}>
          Cancelar
        </BigBtn>

        <BigBtn $primary onClick={onConfirm}>
          Confirmar Suspensão
        </BigBtn>
      </div>
    </OverlayModal>
  );
}
