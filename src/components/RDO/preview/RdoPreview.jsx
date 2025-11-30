import React from "react";
import {
  PreviewContainer,
  PreviewTitle,
  PreviewBlock,
} from "./previewLayout";

import { calcularDistanciaTotal } from "../helpers/jornada";
import { fmt } from "../helpers/time";
import { exportRdoPreviewPdf } from "../export/exportPDF";
import SignatureBlock from "./SignatureBlock";

const RdoPreview = ({
  jornada,
  signatureEnabled,
  sigRef,
  onConfirmEncerrarJornada,
}) => {
  const distanceKm = (calcularDistanciaTotal(jornada) / 1000).toFixed(2);

  const generateBlackSignature = () => {
    const original = sigRef.current.toDataURL("image/png");

    return new Promise((resolve) => {
      const img = new Image();
      img.src = original;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 255;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  const handleExportPdf = () =>
    exportRdoPreviewPdf({
      jornada,
      signatureEnabled,
      generateBlackSignature,
    });

  return (
    <PreviewContainer>
      <PreviewTitle>Pré-visualização do RDO</PreviewTitle>

      <PreviewBlock>
        <strong>Data:</strong> {jornada.date}
        <br />
        <strong>Início expediente:</strong> {fmt(jornada.inicioExpediente)}
        <br />
        <strong>Fim expediente:</strong> {fmt(jornada.fimExpediente)}
        <br />
        <strong>Distância total:</strong> {distanceKm} km
      </PreviewBlock>

      <PreviewBlock>
        <strong>Atendimentos</strong>
        {jornada.atendimentos.length === 0 && (
          <div style={{ color: "#94a3b8" }}>Nenhum atendimento registrado.</div>
        )}

        {jornada.atendimentos.map((att) => (
          <div
            key={att.id}
            style={{
              marginTop: 10,
              borderBottom: "1px solid #00396b",
              paddingBottom: 6,
            }}
          >
            <strong>
              {att.notaEnviada === "sim"
                ? `OS ${att.ordemTipo}-${att.ordemNumero}`
                : "Número de OS não informado"}
            </strong>
            <br />
            <span>
              {att.endereco?.rua || "—"} {att.endereco?.numero || ""} —{" "}
              {att.endereco?.bairro || ""} — {att.endereco?.cidade || ""}
            </span>
          </div>
        ))}
      </PreviewBlock>

      <SignatureBlock
        signatureEnabled={signatureEnabled}
        sigRef={sigRef}
        onConfirmEncerrarJornada={onConfirmEncerrarJornada}
        onExportPdf={handleExportPdf}
      />
    </PreviewContainer>
  );
};

export default RdoPreview;

