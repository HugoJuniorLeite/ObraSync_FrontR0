// src/components/RDO/GasitaOperacoes/export/exportMapPDF.js
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * exportMapToPDF()
 * Converte apenas a área do mapa Leaflet para PDF.
 */

export async function exportMapToPDF(mapElement, filename = "Mapa-RDO.pdf") {
  if (!mapElement) return;

  const canvas = await html2canvas(mapElement, { scale: 2, useCORS: true });
  const img = canvas.toDataURL("image/png");

  const pdf = new jsPDF("portrait", "mm", "a4");
  const w = pdf.internal.pageSize.getWidth();
  const h = (canvas.height * w) / canvas.width;

  pdf.addImage(img, "PNG", 0, 0, w, h);
  pdf.save(filename);
}
