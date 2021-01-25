const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  description: { type: String, required: true },
  path: { type: String },
  creation: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);
