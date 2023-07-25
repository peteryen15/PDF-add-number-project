const mongoose = require("mongoose");
const fs = require("fs");

const mountPdf = async () => {
  // 創建一個 bucket 與 mongodb 連結
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "pdfs",
  });

  let mounting;
  const pdfs = bucket.find({});
  for await (const pdf of pdfs) {
    // 從 db 下載到 pdfs資料夾
    mounting = bucket
      .openDownloadStreamByName(pdf.filename)
      .pipe(
        fs.createWriteStream("./public/pdfs/" + pdf.metadata.type + ".pdf")
      );
  }
  return mounting;
};

module.exports = mountPdf;
