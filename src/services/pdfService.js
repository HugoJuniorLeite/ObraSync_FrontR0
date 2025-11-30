// src/services/pdfService.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fmt, msToHuman, calcularTotais, calcularJornadaTotal, calcularDuracaoAlmocoTotal } from "../utils/attendanceWizardUtils";
import {
  calcularDistanciaTotal,
  calcularDistanciaTotalFromJornada,
} from "../utils/geoUtils";

// Gera PDF para a jornada ATUAL (preview com assinatura)
export const exportPreviewAsPdf = async (jornada) => {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const margin = 40;
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = margin;

    const addSpace = (heightNeeded = 40) => {
      if (y + heightNeeded > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
    };

    // CABEÇALHO
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("RDO - Relatório Diário de Operações", margin, y);
    y += 26;

    pdf.setFontSize(12);
    pdf.setFont("Helvetica", "normal");

    const distKm = (calcularDistanciaTotal(jornada) / 1000).toFixed(2);

    const headerLines = [
      `Data: ${jornada.date}`,
      `Início expediente: ${fmt(jornada.inicioExpediente)}`,
      `Fim expediente: ${fmt(jornada.fimExpediente)}`,
      `Distância total: ${distKm} km`,
    ];

    headerLines.forEach((line) => {
      addSpace(20);
      pdf.text(line, margin, y);
      y += 16;
    });

    addSpace(20);
    pdf.line(margin, y, 555, y);
    y += 20;

    // RESUMO DE TEMPOS
    addSpace(30);
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Resumo de Tempos", margin, y);
    y += 20;

    const { atendimentoMs, deslocamentoMs } = calcularTotais(jornada);
    const jornadaMs = calcularJornadaTotal(jornada);
    const almocoMs = calcularDuracaoAlmocoTotal(jornada.almocos || []);

    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(12);

    pdf.text(
      `Tempo de atendimento: ${msToHuman(atendimentoMs)}`,
      margin,
      y
    );
    y += 16;

    pdf.text(
      `Tempo de deslocamento: ${msToHuman(deslocamentoMs)}`,
      margin,
      y
    );
    y += 16;

    pdf.text(`Tempo de almoço: ${msToHuman(almocoMs)}`, margin, y);
    y += 16;

    pdf.text(`Jornada total: ${msToHuman(jornadaMs)}`, margin, y);
    y += 26;

    pdf.line(margin, y, 555, y);
    y += 20;

    // PAUSA PARA ALMOÇO
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Pausa para Almoço", margin, y);
    y += 20;

    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(12);

    if (!jornada.almocos || jornada.almocos.length === 0) {
      pdf.text("Nenhuma pausa registrada.", margin, y);
      y += 20;
    } else {
      jornada.almocos.forEach((al, i) => {
        pdf.text(`Almoço ${i + 1}`, margin, y);
        y += 16;

        if (al.inicio) {
          pdf.text(`Início: ${fmt(al.inicio)}`, margin, y);
          y += 16;
        }

        if (al.fim) {
          pdf.text(`Fim: ${fmt(al.fim)}`, margin, y);
          y += 16;
        }

        if (al.suspensoEm) {
          pdf.text(`Suspenso: ${fmt(al.suspensoEm)}`, margin, y);
          y += 16;
          pdf.text(`Solicitante: ${al.solicitanteSuspensao}`, margin, y);
          y += 16;
          pdf.text(`Justificativa: ${al.justificativaSuspensao}`, margin, y);
          y += 16;
        }

        y += 10;
      });
    }

    pdf.line(margin, y, 555, y);
    y += 20;

    // TABELA DE ATENDIMENTOS
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Atendimentos", margin, y);
    y += 20;

    if (!jornada.atendimentos || jornada.atendimentos.length === 0) {
      pdf.setFont("Helvetica", "normal");
      pdf.text("Nenhum atendimento registrado.", margin, y);
      y += 20;
    } else {
      autoTable(pdf, {
        startY: y,
        margin: { left: margin },
        headStyles: { fillColor: [30, 60, 110] },
        head: [["OS / Nota", "Início", "Fim", "Endereço"]],
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
    }

    // Assinatura, se houver
    if (jornada.assinatura) {
      const finalY = pdf.lastAutoTable ? pdf.lastAutoTable.finalY + 40 : y + 40;
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Assinatura", margin, finalY);

      const imgY = finalY + 10;
      try {
        pdf.addImage(
          jornada.assinatura,
          "PNG",
          margin,
          imgY,
          300,
          120,
          undefined,
          "FAST"
        );
      } catch {
        // se der problema na imagem, ignora
      }
    }

    pdf.save(`RDO_${jornada.date}.pdf`);
    alert("PDF gerado com sucesso!");
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    alert("Erro ao gerar PDF.");
  }
};

// Gera PDF para uma jornada salva (Histórico)
export const exportJornadaAsPdf = async (j) => {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const margin = 40;
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = margin;

    const addSpace = (h = 40) => {
      if (y + h > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
    };

    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("RDO - Relatório Diário de Operações", margin, y);
    y += 26;

    pdf.setFontSize(12);
    pdf.setFont("Helvetica", "normal");

    const { atendimentoMs, deslocamentoMs } = calcularTotais(j);
    const jornadaMs = calcularJornadaTotal(j);
    const distTotalKm = (
      calcularDistanciaTotalFromJornada(j) / 1000
    ).toFixed(2);

    const headerLines = [
      `Data: ${j.date}`,
      `Início expediente: ${fmt(j.inicioExpediente)}`,
      `Fim expediente: ${fmt(j.fimExpediente)}`,
      `Jornada total: ${msToHuman(jornadaMs)}`,
      `Tempo de atendimento: ${msToHuman(atendimentoMs)}`,
      `Tempo de deslocamento: ${msToHuman(deslocamentoMs)}`,
      `Distância total: ${distTotalKm} km`,
    ];

    headerLines.forEach((line) => {
      addSpace(18);
      pdf.text(line, margin, y);
      y += 16;
    });

    addSpace(20);
    pdf.line(margin, y, 555, y);
    y += 20;

    // Tabela de atendimentos
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Atendimentos", margin, y);
    y += 18;

    if (!j.atendimentos || j.atendimentos.length === 0) {
      pdf.setFont("Helvetica", "normal");
      pdf.text("Nenhum atendimento registrado neste dia.", margin, y);
      y += 20;
    } else {
      autoTable(pdf, {
        startY: y,
        margin: { left: margin },
        headStyles: { fillColor: [30, 60, 110] },
        head: [["OS / Nota", "Início", "Fim", "Endereço"]],
        body: j.atendimentos.map((att) => [
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
    }

    pdf.save(`RDO_${j.date}.pdf`);
    alert("PDF gerado com sucesso!");
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    alert("Erro ao gerar PDF.");
  }
};
