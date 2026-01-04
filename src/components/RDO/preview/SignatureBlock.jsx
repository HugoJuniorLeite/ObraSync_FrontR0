import React, { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { SignatureBox } from "./previewLayout";

const SignatureBlock = ({
  signatureEnabled,
  sigRef,
  onConfirmEncerrarJornada,
  onExportPdf,
}) => {
  const containerRef = useRef(null);

  // 🔁 Ajusta o canvas ao tamanho do container
  useEffect(() => {
    if (!signatureEnabled || !sigRef.current || !containerRef.current) return;

    const resizeCanvas = () => {
      const canvas = sigRef.current.getCanvas();
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const width = containerRef.current.offsetWidth;
      const height = 160;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      ctx.scale(ratio, ratio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [signatureEnabled, sigRef]);

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
          <SignatureBox ref={containerRef}>
            <SignatureCanvas
              ref={sigRef}
              penColor="white"
              canvasProps={{
                style: {
                  width: "100%",
                  height: 160,
                  background: "#071827",
                  borderRadius: 6,
                  touchAction: "none", // 🔥 melhora muito no mobile
                },
              }}
            />
          </SignatureBox>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 8,
              flexWrap: "wrap", // 🔥 evita quebra feia no mobile
            }}
          >
            <button
              onClick={() => sigRef.current.clear()}
              style={{
                flex: 1,
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
                flex: 1,
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
                flexBasis: "100%", // 🔥 botão crítico isolado
                padding: "12px",
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
