const router = require("express").Router();
const mongoose = require("mongoose");
const findPdf = require("../controllers/findPdf");
const modifyPdf = require("../controllers/modifyPdf");

// 完成的pdf的存放位置
const targetUrl = "https://pdf-add-number.onrender.com/downloads/";

router.post("/download1", async (req, res, next) => {
  const copy = req.body.copy1;
  const type = "N95";

  try {
    const findType = await findPdf(type);
    if (findType) {
      // 創建一個 bucket 與 mongodb 連結
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "pdfs",
      });

      let chunks = [];
      let size = 0;
      const readStream = bucket.openDownloadStream(findType._id);
      readStream.on("data", (chunk) => {
        chunks.push(chunk);
        size += chunk.length;
      });
      readStream.on("end", async () => {
        const buffer = Buffer.concat(chunks, size);
        const donePdfName = await modifyPdf(buffer, findType, copy);
        return res.redirect(targetUrl + donePdfName);
      });
      readStream.on("error", (e) => {
        return next(e);
      });
    } else {
      return next("找不到 " + type);
    }
  } catch (e) {
    return next(e);
  }
});

router.post("/download2", async (req, res, next) => {
  const copy = req.body.copy2;
  const type = "南區";

  try {
    const findType = await findPdf(type);
    if (findType) {
      // 創建一個 bucket 與 mongodb 連結
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "pdfs",
      });

      let chunks = [];
      let size = 0;
      const readStream = bucket.openDownloadStream(findType._id);
      readStream.on("data", (chunk) => {
        chunks.push(chunk);
        size += chunk.length;
      });
      readStream.on("end", async () => {
        const buffer = Buffer.concat(chunks, size);
        const donePdfName = await modifyPdf(buffer, findType, copy);
        return res.redirect(targetUrl + donePdfName);
      });
      readStream.on("error", (e) => {
        return next(e);
      });
    } else {
      return next("找不到 " + type);
    }
  } catch (e) {
    return next(e);
  }
});

router.post("/download3", async (req, res, next) => {
  const copy = req.body.copy3;
  const type = "原制度";

  try {
    const findType = await findPdf(type);
    if (findType) {
      // 創建一個 bucket 與 mongodb 連結
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "pdfs",
      });

      let chunks = [];
      let size = 0;
      const readStream = bucket.openDownloadStream(findType._id);
      readStream.on("data", (chunk) => {
        chunks.push(chunk);
        size += chunk.length;
      });
      readStream.on("end", async () => {
        const buffer = Buffer.concat(chunks, size);
        const donePdfName = await modifyPdf(buffer, findType, copy);
        return res.redirect(targetUrl + donePdfName);
      });
      readStream.on("error", (e) => {
        return next(e);
      });
    } else {
      return next("找不到 " + type);
    }
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
