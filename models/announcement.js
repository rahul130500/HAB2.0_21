const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String, required: true },
  path: { type: String },
  important: { type: Boolean },
  creation: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);
