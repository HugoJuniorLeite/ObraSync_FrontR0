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
  signatureEnabled =false,
  generateBlackSignature =null,
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
y += 16;

const almocos = jornada.almocos || [];

if (almocos.length === 0) {
  pdf.setFont("Helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text("Nenhuma pausa registrada.", margin, y);
  y += 20;
} else {
  const tableBody = almocos.map((alm, index) => {
    const fimEfetivo = alm.suspensoEm || alm.fim || null;

    return [
      index + 1,
      alm.inicio ? fmt(alm.inicio) : "—",
      fimEfetivo ? fmt(fimEfetivo) : "Em andamento",
      alm.suspensoEm ? "Suspenso" : "Normal",
      alm.justificativaSuspensao || "—",
      alm.solicitanteSuspensao || "—",
    ];
  });

  autoTable(pdf, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [[
      "Nº",
      "Início",
      "Fim",
      "Status",
      "Motivo",
      "Solicitante",
    ]],
    body: tableBody,
    styles: {
      fontSize: 10,
      cellPadding: 6,
      valign: "middle",
    },
    headStyles: {
      fillColor: [30, 60, 110],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: {
      0: { cellWidth: 30, halign: "center" },
      3: { halign: "center" },
    },
  });

  y = pdf.lastAutoTable.finalY + 20;
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

  if (!signatureEnabled  || !generateBlackSignature) {
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

