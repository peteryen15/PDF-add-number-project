const router = require("express").Router();
const mongoose = require("mongoose");
const findPdf = require("../controllers/findPdf");

router.get("/n95", async (req, res, next) => {
  // 創建一個 bucket 與 mongodb 連結
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "pdfs",
  });

  try {
    const findN95 = await findPdf("N95");
    const readStream = bucket.openDownloadStream(findN95._id);
    readStream.on("data", (chunk) => {
      res.write(chunk);
    });
    readStream.on("end", () => {
      res.status(200).end();
    });
    readStream.on("error", (e) => {
      return next(e);
    });
  } catch (e) {
    return next(e);
  }
});

router.get("/south", async (req, res, next) => {
  // 創建一個 bucket 與 mongodb 連結
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "pdfs",
  });

  try {
    const findSouth = await findPdf("南區");
    const readStream = bucket.openDownloadStream(findSouth._id);
    readStream.on("data", (chunk) => {
      res.write(chunk);
    });
    readStream.on("end", () => {
      res.status(200).end();
    });
    readStream.on("error", (e) => {
      return next(e);
    });
  } catch (e) {
    return next(e);
  }
});

router.get("/original", async (req, res, next) => {
  // 創建一個 bucket 與 mongodb 連結
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "pdfs",
  });

  try {
    const findOrig = await findPdf("原制度");
    const readStream = bucket.openDownloadStream(findOrig._id);
    readStream.on("data", (chunk) => {
      res.write(chunk);
    });
    readStream.on("end", () => {
      res.status(200).end();
    });
    readStream.on("error", (e) => {
      return next(e);
    });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
