const router = require("express").Router();
const multer = require("multer");
const upload = multer();
const fs = require("fs");
const Pdf = require("../models/pdf-model");

router.post("/update1", upload.single("pdf1"), async (req, res, next) => {
  if (req.file) {
    const pdfName = req.file.originalname;
    const pdfBuffer = req.file.buffer;

    // 儲存pdf到 "/pdf" 目錄
    fs.createWriteStream("./public/pdfs/N95.pdf").write(pdfBuffer);

    try {
      await Pdf.updateOne({ pdfType: "N95" }, { pdfName });
    } catch (e) {
      next(e);
    }

    return res.redirect("/");
  } else {
    req.flash("update_err_n95", "請選擇PDF");
    return res.redirect("/update");
  }
});

router.post("/update2", upload.single("pdf2"), async (req, res, next) => {
  if (req.file) {
    const pdfName = req.file.originalname;
    const pdfBuffer = req.file.buffer;

    // 儲存pdf到 "/pdf" 目錄
    fs.createWriteStream("./public/pdfs/南區.pdf").write(pdfBuffer);

    try {
      await Pdf.updateOne({ pdfType: "南區" }, { pdfName });
    } catch (e) {
      next(e);
    }

    return res.redirect("/");
  } else {
    req.flash("update_err_south", "請選擇PDF");
    return res.redirect("/update");
  }
});

router.post("/update3", upload.single("pdf3"), async (req, res, next) => {
  if (req.file) {
    const pdfName = req.file.originalname;
    const pdfBuffer = req.file.buffer;

    // 儲存pdf到 "/pdf" 目錄
    fs.createWriteStream("./public/pdfs/原制度.pdf").write(pdfBuffer);

    try {
      await Pdf.updateOne({ pdfType: "原制度" }, { pdfName });
    } catch (e) {
      next(e);
    }

    return res.redirect("/");
  } else {
    req.flash("update_err_orig", "請選擇PDF");
    return res.redirect("/update");
  }
});

module.exports = router;
