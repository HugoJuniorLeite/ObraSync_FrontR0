import React from "react";
import OverlayModal from "./OverlayModal";
import { BigBtn } from "../styles/layout";

export default function ModalFinalizarAlmocoEarly({ onCancel, onConfirm }) {
  return (
    <OverlayModal>
      <h3 style={{ marginBottom: 10 }}>Finalizar almoço antes de 50 minutos?</h3>
      <p style={{ marginBottom: 20, color: "#9fb4c9" }}>
        O tempo mínimo recomendado não foi atingido.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <BigBtn onClick={onCancel}>Cancelar</BigBtn>

        <BigBtn $primary onClick={onConfirm}>
          Finalizar mesmo assim
        </BigBtn>
      </div>
    </OverlayModal>
  );
}
