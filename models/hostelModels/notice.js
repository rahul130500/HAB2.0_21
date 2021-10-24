const mongoose = require("mongoose");

const HostelNoticeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  hostel: { type: String, required: true },
  description: { type: String, required: true },
  creation: { type: Date, required: true },
});

module.exports = mongoose.model("HostelNotice", HostelNoticeSchema);
