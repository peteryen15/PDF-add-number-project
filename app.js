const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;

async function modifyPdf() {
  const number = "000001";

  // Fetch an existing PDF document
  const url = "./test.pdf";
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Get the pages of the document
  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    // Get the width and height of the page
    const { width, height } = page.getSize();

    // Draw a string of text diagonally across the page
    page.drawText(number, {
      x: 5,
      y: height - 25,
      size: 25,
      font: helveticaFont,
      color: rgb(0.95, 0.1, 0.1),
      rotate: degrees(0),
    });
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // Trigger the browser to download the PDF document
  download(pdfBytes, number + ".pdf", "application/pdf");
}
