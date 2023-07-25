const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const session = require("cookie-session");
const flash = require("connect-flash");
const downloadRoutes = require("./routes/download-routes");
const updateRoutes = require("./routes/update-routes");
const findPdf = require("./controllers/findPdf");
const mountPdf = require("./controllers/mountPdf");
// const Pdf = require("./models/pdf-model");

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connected to mongodb altas.");
  })
  .catch((e) => {
    console.log(e);
  });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.update_err_n95 = req.flash("update_err_n95");
  res.locals.update_err_south = req.flash("update_err_south");
  res.locals.update_err_orig = req.flash("update_err_orig");
  next();
});

// routes
app.use("/", downloadRoutes);
app.use("/update", updateRoutes);

app.get("/", async (req, res, next) => {
  try {
    const findPdf1 = await findPdf("N95");
    const findPdf2 = await findPdf("南區");
    const findPdf3 = await findPdf("原制度");

    if (findPdf1 && findPdf2 && findPdf3) {
      mountPdf().then((mounting) => {
        mounting.on("finish", () => {
          return res.render("index", {
            pdf1: findPdf1,
            pdf2: findPdf2,
            pdf3: findPdf3,
          });
        });
      });
    } else {
      next("Something not found.");
    }
  } catch (e) {
    next(e);
  }

  // // 創建一個 bucket 與 mongodb 連結
  // const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
  //   bucketName: "pdfs",
  // });

  // let findType1;
  // let findType2;
  // let findType3;
  // // 找所有 bucket 內的檔案
  // const pdfs = bucket.find({});
  // for await (const pdf of pdfs) {
  //   if (pdf.metadata.type == "N95") {
  //     findType1 = pdf;
  //     bucket
  //       .openDownloadStreamByName(pdf.filename)
  //       .pipe(
  //         fs.createWriteStream("./public/pdfs/" + pdf.metadata.type + ".pdf")
  //       );
  //   } else if (pdf.metadata.type == "南區") {
  //     findType2 = pdf;
  //     bucket
  //       .openDownloadStreamByName(pdf.filename)
  //       .pipe(
  //         fs.createWriteStream("./public/pdfs/" + pdf.metadata.type + ".pdf")
  //       );
  //   } else if (pdf.metadata.type == "原制度") {
  //     findType3 = pdf;
  //     bucket
  //       .openDownloadStreamByName(pdf.filename)
  //       .pipe(
  //         fs.createWriteStream("./public/pdfs/" + pdf.metadata.type + ".pdf")
  //       );
  //   } else return next("pdf type not found.");
  // }

  // return res.render("index", {
  //   pdf1: findType1,
  //   pdf2: findType2,
  //   pdf3: findType3,
  // });
  // try {
  //   const findType1 = await Pdf.findOne({ pdfType: "N95" }).exec();
  //   const findType2 = await Pdf.findOne({ pdfType: "南區" }).exec();
  //   const findType3 = await Pdf.findOne({ pdfType: "原制度" }).exec();

  //   if (findType1 && findType2 && findType3) {
  //     return res.render("index", {
  //       pdf1: findType1,
  //       pdf2: findType2,
  //       pdf3: findType3,
  //     });
  //   } else {
  //     console.log("something not found");
  //     return res.send("Something not found");
  //   }
  // } catch (e) {
  //   console.log(e);
  //   next(e);
  // }
});

app.get("/update", async (req, res) => {
  res.render("update");
});

app.get("/*", (req, res) => {
  res.status(404).render("notFound");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).render("error", { err });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
