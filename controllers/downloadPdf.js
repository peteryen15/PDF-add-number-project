const mongoose = require("mongoose");
const modifyPdf = require("./modifyPdf");
const updatePdf = require("./updatePdf");

const downloadPdf = async function (pdfType, copy) {
  // 創建一個 bucket 與 mongodb 連結
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "pdfs",
  });

  // 找所有 bucket 內的檔案
  const pdfs = bucket.find({});
  for await (const pdf of pdfs) {
    if (pdf.metadata.type == pdfType) {
      const url = "http://localhost:3000/pdfs/" + pdfType + ".pdf";
      const { newUsedNumber, donePdfName } = await modifyPdf(
        url,
        pdf.metadata.usedNumber,
        copy,
        pdfType
      );

      const newPdf = {
        metadata: {
          type: pdfType,
          usedNumber: newUsedNumber,
        },
      };

      updatePdf("./public/pdfs/" + pdfType + ".pdf", pdf.filename, newPdf)
        .then((stream) => {
          stream.on("finish", () => {
            console.log(
              `"N95" 已更新為 ${stream.filename}，目前已套用編號: ${stream.options.metadata.usedNumber}`
            );
            console.log("-----------------------");
            return stream;
          });
        })
        .catch((e) => {
          return next(e);
        });
    }
  }

  // // 查詢合約種類
  // const findPdf = await Pdf.findOne({ pdfType }).exec();

  // if (findPdf && copy > 0) {
  //   // 加上編號
  //   const url = "http://localhost:3000/pdfs/" + findPdf.pdfType + ".pdf";
  //   const { newUsedNumber, newPdf } = await modifyPdf(
  //     url,
  //     findPdf.usedNumber,
  //     copy,
  //     pdfType
  //   );

  //   if (newUsedNumber && newPdf) {
  //     // 更新以套用編號
  //     await Pdf.updateOne({ pdfType }, { usedNumber: newUsedNumber });
  //     return newPdf;
  //   } else {
  //     return;
  //   }
  // } else {
  //   console.log('"pdf" not found or "份數" less than 1.');
  //   return;
  // }
};

module.exports = downloadPdf;
