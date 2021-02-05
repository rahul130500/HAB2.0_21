const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  path: { type: String },
  creation: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notice", NoticeSchema);
