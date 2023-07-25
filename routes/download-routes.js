const router = require("express").Router();
const downloadPdf = require("../controllers/downloadPdf");

router.post("/download1", async (req, res, next) => {
  const { copy1 } = req.body;

  try {
    downloadPdf("N95", copy1).then((stream) => {
      stream.on("finish", () => {
        console.log(stream);
        return res.redirect("/");
      });
      // return res.redirect("http://localhost:3000/downloads/" + donePdfName);
    });
    // stream.on("finish", () => {
    //   console.log(stream);
    //   return res.redirect("/");
    // });
    // if (newPdf) {
    //   return res.redirect("http://localhost:3000/downloads/" + newPdf);
    // } else {
    //   return next("下載失敗");
    // }
  } catch (e) {
    return next(e);
  }
});

router.post("/download2", async (req, res, next) => {
  let { copy2 } = req.body;

  try {
    const newPdf = await downloadPdf("南區", copy2);
    if (newPdf) {
      return res.redirect("http://localhost:3000/downloads/" + newPdf);
    } else {
      return next("下載失敗");
    }
  } catch (e) {
    return next(e);
  }
});

router.post("/download3", async (req, res, next) => {
  let { copy3 } = req.body;

  try {
    const newPdf = await downloadPdf("原制度", copy3);
    if (newPdf) {
      return res.redirect("http://localhost:3000/downloads/" + newPdf);
    } else {
      return next("下載失敗");
    }
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
