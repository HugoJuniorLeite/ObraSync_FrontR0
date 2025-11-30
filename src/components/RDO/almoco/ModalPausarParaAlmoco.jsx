import React from "react";
import OverlayModal from "./OverlayModal";
import { BigBtn } from "../styles/layout";

export default function ModalPausarParaAlmoco({ 
  onCancel, 
  onConfirm 
}) {

  return (
    <OverlayModal>
      <h3 style={{ marginBottom: 10, color: "#facc15" }}>
        Atividade em andamento
      </h3>

      <p style={{ marginBottom: 20, color: "#9fb4c9" }}>
        Existe uma atividade em andamento.  
        Para iniciar o almoço, é necessário **pausar a atividade atual**.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        
        {/* CANCELAR */}
        <BigBtn onClick={onCancel}>
          Cancelar
        </BigBtn>

        {/* CONFIRMAR */}
        <BigBtn 
          $primary 
          onClick={onConfirm}
        >
          Pausar atividade e iniciar almoço
        </BigBtn>
      </div>
    </OverlayModal>
  );
}
