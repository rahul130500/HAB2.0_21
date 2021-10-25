const mongoose = require("mongoose");

const HostelNoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  path: { type: String, required: true },
  category: { type: String, required: true },
  creation: { type: Date, default: Date.now },
  hostel: { type: String, required: true },
});

module.exports = mongoose.model("HostelNotice", HostelNoticeSchema);
