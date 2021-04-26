const mongoose = require("mongoose");

const OrdinanceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  path: { type: String, required: true },
  category: { type: String, required: true },
  creation: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ordinance", OrdinanceSchema);
