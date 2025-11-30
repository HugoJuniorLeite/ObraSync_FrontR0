import React from "react";
import SignatureCanvas from "react-signature-canvas";
import { SignatureBox } from "./previewLayout";

const SignatureBlock = ({
  signatureEnabled,
  sigRef,
  onConfirmEncerrarJornada,
  onExportPdf,
}) => {
  return (
    <div style={{ marginTop: 20 }}>
      <h4 style={{ color: "#dbeafe", marginBottom: 6 }}>Assinatura</h4>

      {!signatureEnabled && (
        <div style={{ color: "#94a3b8" }}>
          Finalize o expediente para habilitar a assinatura.
        </div>
      )}

      {signatureEnabled && (
        <>
          <SignatureBox>
            <SignatureCanvas
              ref={sigRef}
              penColor="white"
              canvasProps={{
                width: 440,
                height: 160,
                style: { 
                  background: "#071827",
                  borderRadius: 6 
                },
              }}
            />
          </SignatureBox>

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              onClick={() => sigRef.current.clear()}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #00396b",
                background: "#0d2234",
                color: "#dbeafe",
              }}
            >
              Limpar
            </button>

            <button
              onClick={onExportPdf}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #38bdf8",
                background: "#38bdf8",
                color: "#081018",
              }}
            >
              Gerar PDF
            </button>

            <button
              onClick={onConfirmEncerrarJornada}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #0ea5e9",
                background: "#0ea5e9",
                color: "white",
              }}
            >
              Encerrar Jornada
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SignatureBlock;
