const mongoose = require("mongoose");
const fs = require("fs");

const findPdf = async (type) => {
  // 創建一個 bucket 與 mongodb 連結
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "pdfs",
  });

  // 找所有 bucket 內的檔案是否有 type
  const pdfs = bucket.find({});
  for await (const pdf of pdfs) {
    if (pdf.metadata.type == type) {
      return pdf;
    }
  }

  return;
};

module.exports = findPdf;
