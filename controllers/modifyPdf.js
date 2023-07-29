const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const mongoose = require("mongoose");
const fetch = require("node-fetch");

const modifyPdf = async function (existingPdfBytes, findPdf, copy) {
  // // Fetch an existing PDF document
  // const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

  const number = findPdf.metadata.usedNumber;
  const type = findPdf.metadata.type;

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Create a new PDFDocument
  const donorPdfDoc = await PDFDocument.create();

  // Get the pages of the document
  const pages = pdfDoc.getPages();

  // 第一份和最後一份
  const startNum = (parseFloat(number) + 1)
    .toLocaleString("en-US")
    .padStart(5, "0");
  const endNum = (parseFloat(number) + parseFloat(copy))
    .toLocaleString("en-US")
    .padStart(5, "0");

  // 完成pdf檔名
  const donePdfName = startNum + "~" + endNum + "_" + type + ".pdf";

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

  // 儲存完成的pdf到 "/downloads" 目錄
  fs.createWriteStream("./public/downloads/" + donePdfName).write(pdfBytes);

  // 更新"目前已套用編號"
  const file = mongoose.connection.db.collection("pdfs.files");
  await file.updateOne(
    {
      _id: findPdf._id,
    },
    { $set: { "metadata.usedNumber": endNum } }
  );

  return donePdfName;
};

module.exports = modifyPdf;
