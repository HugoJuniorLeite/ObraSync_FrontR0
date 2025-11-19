// src/components/RDO/GasitaOperacoes/preview/SignatureBlock.jsx
import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Card, Btn } from "../styles/layout";
import { useRdo } from "../RdoMain";

/**
 * Simple signature block. Parent handles saving signature image (dataURL) to jornada when closing.
 * This component exposes a small API: clear() and getDataURL()
 */

export default function SignatureBlock({ onSave }) {
  const sigRef = useRef();

  const limpar = () => { sigRef.current?.clear(); };
  const salvar = () => {
    const data = sigRef.current?.toDataURL?.();
    if (onSave) onSave(data);
    alert("Assinatura capturada.");
  };

  return (
    <Card>
      <div style={{ fontWeight: 700, color: "#f97316" }}>Assinatura</div>
      <div style={{ marginTop: 8 }}>
        <SignatureCanvas ref={sigRef} penColor="black" canvasProps={{ width: 600, height: 160, style: { background: "#fff", borderRadius: 6 } }} />
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <Btn onClick={limpar}>Limpar</Btn>
          <Btn onClick={salvar} $primary>Salvar assinatura</Btn>
        </div>
      </div>
    </Card>
  );
}
