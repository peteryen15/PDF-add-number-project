const router = require("express").Router();
const formidable = require("formidable");
const findPdf = require("../controllers/findPdf");
const updatePdf = require("../controllers/updatePdf");
const multer = require("multer");
const upload = multer();
// const fs = require("fs");
// const Pdf = require("../models/pdf-model");

router.post("/update1", async (req, res, next) => {
  const form = new formidable.IncomingForm();
  try {
    const [fields, files] = await form.parse(req);

    const pdfFilePath = files.pdf1[0].filepath;
    const pdfFileName = files.pdf1[0].originalFilename;

    const findPdf1 = await findPdf("N95");

    if (findPdf1) {
      updatePdf(pdfFilePath, pdfFileName, findPdf1)
        .then((stream) => {
          stream.on("finish", () => {
            console.log(
              `"N95" 已更新為 ${stream.filename}，目前已套用編號: ${stream.options.metadata.usedNumber}`
            );
            console.log("-----------------------");
            return res.redirect("/");
          });
        })
        .catch((e) => {
          return next(e);
        });
    } else {
      return next("找不到pdf，或是正在上傳");
      // const newPdf = {
      //   metadata: {
      //     type: "N95",
      //     usedNumber: "00000",
      //   },
      // };
      // updatePdf(pdfFilePath, pdfFileName, newPdf)
      //   .then((stream) => {
      //     stream.on("finish", () => {
      //       console.log(
      //         `"N95" 已更新為 ${stream.filename}，目前已套用編號: ${stream.options.metadata.usedNumber}`
      //       );
      //       return res.redirect("/");
      //     });
      //   })
      //   .catch((e) => {
      //     return next(e);
      //   });
    }
  } catch (e) {
    if (
      e.message ==
      "options.allowEmptyFiles is false, file size should be greater than 0"
    ) {
      req.flash("update_err_n95", "請選擇PDF");
      return res.redirect("/update");
    } else {
      return next(e);
    }
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
