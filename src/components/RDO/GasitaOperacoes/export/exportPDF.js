// src/components/RDO/GasitaOperacoes/export/exportPDF.js
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * exportRDOToPDF()
 * Recebe um elemento DOM (preview) e gera um PDF em alta resolução.
 */

export async function exportRDOToPDF(element, filename = "RDO.pdf") {
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  const img = canvas.toDataURL("image/png");

  const pdf = new jsPDF("portrait", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = (canvas.height * pageWidth) / canvas.width;

  pdf.addImage(img, "PNG", 0, 0, pageWidth, pageHeight);
  pdf.save(filename);
}
