const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  pdfType: {
    type: String,
    required: true,
  },
  pdfName: {
    type: String,
    required: true,
  },
  usedNumber: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Pdf", pdfSchema);
