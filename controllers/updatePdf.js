const mongoose = require("mongoose");
const fs = require("fs");

const updatePdf = async (pdfFilePath, pdfFileName, newPdf) => {
  // 創建一個 bucket 與 mongodb 連結
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "pdfs",
  });

  // 找所有 bucket 內的檔案，並刪除原有的同名檔案
  const pdfs = bucket.find({});
  for await (const pdf of pdfs) {
    if (pdf.metadata.type == newPdf.metadata.type) {
      bucket.delete(pdf._id);
      console.log(
        `delete ${pdf.metadata.type} ${pdf.filename} ${pdf.metadata.usedNumber}.`
      );
    }
  }

  // upload data
  const pdfStream = bucket.openUploadStream(pdfFileName, {
    metadata: {
      type: newPdf.metadata.type,
      usedNumber: newPdf.metadata.usedNumber,
    },
  });
  const pdfData = fs.createReadStream(pdfFilePath);
  pdfData.pipe(pdfStream);

  return pdfStream;
};

module.exports = updatePdf;
