const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imagepath: { type: String, required: true },
  path: { type: String },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("HostelEvent", EventSchema);
