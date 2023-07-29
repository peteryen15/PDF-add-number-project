const router = require("express").Router();
const formidable = require("formidable");
const findPdf = require("../controllers/findPdf");
const updatePdf = require("../controllers/updatePdf");

router.post("/update1", async (req, res, next) => {
  const type = "N95";

  const form = new formidable.IncomingForm();
  try {
    const [fields, files] = await form.parse(req);
    const pdfFilePath = files.pdf1[0].filepath;
    const pdfFileName = files.pdf1[0].originalFilename;

    const findType = await findPdf(type);

    if (findType) {
      updatePdf(pdfFilePath, pdfFileName, findType)
        .then((stream) => {
          stream.on("finish", () => {
            console.log(
              `${type} 已更新為 ${stream.filename}，目前已套用編號: ${stream.options.metadata.usedNumber}`
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

router.post("/update2", async (req, res, next) => {
  const type = "南區";

  const form = new formidable.IncomingForm();
  try {
    const [fields, files] = await form.parse(req);
    const pdfFilePath = files.pdf2[0].filepath;
    const pdfFileName = files.pdf2[0].originalFilename;

    const findType = await findPdf(type);

    if (findType) {
      updatePdf(pdfFilePath, pdfFileName, findType)
        .then((stream) => {
          stream.on("finish", () => {
            console.log(
              `${type} 已更新為 ${stream.filename}，目前已套用編號: ${stream.options.metadata.usedNumber}`
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
    }
  } catch (e) {
    if (
      e.message ==
      "options.allowEmptyFiles is false, file size should be greater than 0"
    ) {
      req.flash("update_err_south", "請選擇PDF");
      return res.redirect("/update");
    } else {
      return next(e);
    }
  }
});

router.post("/update3", async (req, res, next) => {
  const type = "原制度";

  const form = new formidable.IncomingForm();
  try {
    const [fields, files] = await form.parse(req);
    const pdfFilePath = files.pdf3[0].filepath;
    const pdfFileName = files.pdf3[0].originalFilename;

    const findType = await findPdf(type);

    if (findType) {
      updatePdf(pdfFilePath, pdfFileName, findType)
        .then((stream) => {
          stream.on("finish", () => {
            console.log(
              `${type} 已更新為 ${stream.filename}，目前已套用編號: ${stream.options.metadata.usedNumber}`
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
    }
  } catch (e) {
    if (
      e.message ==
      "options.allowEmptyFiles is false, file size should be greater than 0"
    ) {
      req.flash("update_err_orig", "請選擇PDF");
      return res.redirect("/update");
    } else {
      return next(e);
    }
  }
});

module.exports = router;
