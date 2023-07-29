const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const session = require("cookie-session");
const flash = require("connect-flash");
const downloadRoutes = require("./routes/download-routes");
const pdfRoutes = require("./routes/pdf-routes");
const updateRoutes = require("./routes/update-routes");
const findPdf = require("./controllers/findPdf");

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
app.use("/pdf", pdfRoutes);
app.use("/update", updateRoutes);

app.get("/", async (req, res, next) => {
  try {
    const findPdf1 = await findPdf("N95");
    const findPdf2 = await findPdf("南區");
    const findPdf3 = await findPdf("原制度");

    if (findPdf1 && findPdf2 && findPdf3) {
      return res.render("index", {
        pdf1: findPdf1,
        pdf2: findPdf2,
        pdf3: findPdf3,
      });
    } else {
      next("Something not found.");
    }
  } catch (e) {
    next(e);
  }
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
