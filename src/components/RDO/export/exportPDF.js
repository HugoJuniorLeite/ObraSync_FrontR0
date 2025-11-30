import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fmt, msToHuman } from "../helpers/time";
import {
  calcularDistanciaTotal,
  calcularTotais,
  calcularJornadaTotal,
} from "../helpers/jornada";

export const exportRdoPreviewPdf = async ({
  jornada,
  signatureEnabled,
  generateBlackSignature,
}) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const margin = 40;
  const pageHeight = pdf.internal.pageSize.getHeight();
  let y = margin;

  const ensureSpace = (needed = 40) => {
    if (y + needed > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  };

  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("RDO - Relatório Diário de Operações", margin, y);
  y += 26;

  pdf.setFont("Helvetica", "normal");
  pdf.setFontSize(12);

  const header = [
    `Data: ${jornada.date}`,
    `Início expediente: ${fmt(jornada.inicioExpediente)}`,
    `Fim expediente: ${fmt(jornada.fimExpediente)}`,
    `Distância total: ${(calcularDistanciaTotal(jornada) / 1000).toFixed(2)} km`,
  ];

  header.forEach((h) => {
    ensureSpace(18);
    pdf.text(h, margin, y);
    y += 16;
  });

  ensureSpace();
  pdf.line(margin, y, 555, y);
  y += 20;

  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Pausas para almoço", margin, y);
  y += 20;

  pdf.setFont("Helvetica", "normal");
  pdf.setFontSize(12);

  const alm = jornada.almoco;
  if (!alm || (!alm.inicio && !alm.fim)) {
    pdf.text("Nenhuma pausa registrada.", margin, y);
    y += 20;
  } else {
    if (alm.inicio) {
      pdf.text(`Início: ${fmt(alm.inicio)}`, margin, y);
      y += 16;
    }
    if (alm.fim) {
      pdf.text(`Fim: ${fmt(alm.fim)}`, margin, y);
      y += 16;
    }
  }

  pdf.line(margin, y, 555, y);
  y += 20;

  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Atendimentos", margin, y);
  y += 20;

  if (!jornada.atendimentos.length) {
    pdf.text("Nenhum atendimento registrado.", margin, y);
    y += 20;
  } else {
    autoTable(pdf, {
      startY: y,
      margin: { left: margin },
      headStyles: { fillColor: [30, 60, 110] },
      head: [["OS", "Início", "Fim", "Endereço"]],
      body: jornada.atendimentos.map((att) => [
        att.notaEnviada === "sim"
          ? `OS ${att.ordemTipo}-${att.ordemNumero}`
          : "Não informada",
        fmt(att.atendimentoInicio),
        fmt(att.finalizadoEm),
        `${att.endereco?.rua || ""} ${att.endereco?.numero || ""} - ${
          att.endereco?.bairro || ""
        } - ${att.endereco?.cidade || ""}`,
      ]),
    });

    y = pdf.lastAutoTable.finalY + 20;
  }

  ensureSpace(180);

  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Assinatura do Técnico", margin, y);
  y += 20;

  if (!signatureEnabled) {
    pdf.text("Não assinada.", margin, y);
  } else {
    const assinatura = await generateBlackSignature();
    pdf.addImage(assinatura, "PNG", margin, y, 200, 120);
  }

  pdf.save(`RDO_${jornada.date}.pdf`);
  alert("PDF gerado com sucesso!");
};

export const exportJornadaAsPdf = (jornada) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const margin = 40;
  let y = margin;

  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Relatório Diário - Histórico", margin, y);
  y += 26;

  const { atendimentoMs, deslocamentoMs } = calcularTotais(jornada);
  const jornadaMs = calcularJornadaTotal(jornada);
  const distKm = (calcularDistanciaTotal(jornada) / 1000).toFixed(2);

  const info = [
    `Data: ${jornada.date}`,
    `Jornada total: ${msToHuman(jornadaMs)}`,
    `Tempo de atendimento: ${msToHuman(atendimentoMs)}`,
    `Tempo de deslocamento: ${msToHuman(deslocamentoMs)}`,
    `Distância total: ${distKm} km`,
  ];

  pdf.setFontSize(12);
  pdf.setFont("Helvetica", "normal");
  info.forEach((t) => {
    pdf.text(t, margin, y);
    y += 16;
  });

  pdf.save(`Historico_${jornada.date}.pdf`);
};

