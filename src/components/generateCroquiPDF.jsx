import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function generateCroquiPDF(croquiData, formData) {
  const imgUrl = croquiData.file.replace('/src/', '');
  const imgBytes = await fetch(imgUrl).then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const width = 595.28;
  const height = 841.89;

  const img = await pdfDoc.embedPng(imgBytes);
  page.drawImage(img, { x: 0, y: 0, width, height });

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  croquiData.fields.forEach((field) => {
    const value = formData[field.name];
    if (!value) return;

    const x = (parseFloat(field.left)/100)*width;
    const y = height - (parseFloat(field.top)/100)*height;

    page.drawText(String(value), { x, y, size: 12, font, color: rgb(0,0,0) });
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
