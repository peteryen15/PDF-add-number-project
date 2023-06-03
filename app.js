const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;

let fileReader1 = new FileReader();
let fileReader2 = new FileReader();
let fileReader3 = new FileReader();

// 選擇PDF
document.querySelector("#selectPDF1").addEventListener("change", (e) => {
  file = e.target.files[0];
  fileReader1.readAsArrayBuffer(file);
});

document.querySelector("#selectPDF2").addEventListener("change", (e) => {
  file = e.target.files[0];
  fileReader2.readAsArrayBuffer(file);
});

document.querySelector("#selectPDF3").addEventListener("change", (e) => {
  file = e.target.files[0];
  fileReader3.readAsArrayBuffer(file);
});

let copy1 = 1;
let copy2 = 1;
let copy3 = 1;

// 輸入份數
document.querySelector("#inputNum1").addEventListener("change", (e) => {
  copy1 = e.target.value;
});
document.querySelector("#inputNum2").addEventListener("change", (e) => {
  copy2 = e.target.value;
});
document.querySelector("#inputNum3").addEventListener("change", (e) => {
  copy3 = e.target.value;
});

let number1 = "00000";
let number2 = "00001";
let number3 = "00100";

// 點擊下載
document.querySelector("#download1").addEventListener("click", () => {
  modifyPdf(fileReader1.result, number1, copy1, "N95");
});
document.querySelector("#download2").addEventListener("click", () => {
  modifyPdf(fileReader2.result, number2, copy2, "南區");
});
document.querySelector("#download3").addEventListener("click", () => {
  modifyPdf(fileReader3.result, number3, copy3, "原制度");
});

async function modifyPdf(pdf, number, copy, type) {
  if (pdf == null) {
    alert("請選擇合約PDF");
  } else if (copy < 1) {
    alert("請確認輸入的份數是否正確");
  } else {
    // const number = "000001";

    // Fetch an existing PDF document
    // const url = "./test1.pdf";
    // const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(pdf);

    // Create a new PDFDocument
    const donorPdfDoc = await PDFDocument.create();

    // Get the pages of the document
    let pages = pdfDoc.getPages();

    // 第一份和最後一份
    let startNum = (parseFloat(number) + 1)
      .toLocaleString("en-US")
      .padStart(5, "0");
    let endNum = (parseFloat(number) + parseFloat(copy))
      .toLocaleString("en-US")
      .padStart(5, "0");

    // Embed the Helvetica font
    const helveticaFont = await donorPdfDoc.embedFont(StandardFonts.Helvetica);

    for (let i = 0; i < copy; i++) {
      let copyNum = (parseFloat(startNum) + i)
        .toLocaleString("en-US")
        .padStart(5, "0");

      for (let page in pages) {
        const [donorPage] = await donorPdfDoc.copyPages(pdfDoc, [page]);

        // Get the width and height of the page
        const { width, height } = donorPage.getSize();

        // Draw a string of text diagonally across the page
        donorPage.drawText(copyNum, {
          x: 5,
          y: height - 25,
          size: 25,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
          rotate: degrees(0),
        });

        donorPdfDoc.addPage(donorPage);
      }
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await donorPdfDoc.save();

    // Trigger the browser to download the PDF document
    download(
      pdfBytes,
      startNum + "~" + endNum + "_" + type + ".pdf",
      "application/pdf"
    );
  }
}
