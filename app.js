const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;

let file;
let fileReader = new FileReader();

let inputPDF = document.querySelector("#PDF");
inputPDF.addEventListener("input", (e) => {
  file = e.target.files[0];
  fileReader.readAsArrayBuffer(file);
});

let number;

let inputNum = document.querySelector("#inputNum");
inputNum.addEventListener("input", (e) => {
  number = e.target.value;
});

async function modifyPdf() {
  // const number = "000001";

  // Fetch an existing PDF document
  // const url = "./test1.pdf";
  // const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(fileReader.result);

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
