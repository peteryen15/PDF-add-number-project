const modifyPdf = require("./modifyPdf");
const Pdf = require("../models/pdf-model");

const downloadPdf = async function (pdfType, copy) {
  // 查詢合約種類
  const findPdf = await Pdf.findOne({ pdfType }).exec();

  if (findPdf && copy > 0) {
    // 加上編號
    const url = "http://localhost:3000/pdfs/" + findPdf.pdfType + ".pdf";
    const { newUsedNumber, newPdf } = await modifyPdf(
      url,
      findPdf.usedNumber,
      copy,
      pdfType
    );

    if (newUsedNumber && newPdf) {
      // 更新以套用編號
      await Pdf.updateOne({ pdfType }, { usedNumber: newUsedNumber });
      return newPdf;
    } else {
      return;
    }
  } else {
    console.log('"pdf" not found or "份數" less than 1.');
    return;
  }
};

module.exports = downloadPdf;
