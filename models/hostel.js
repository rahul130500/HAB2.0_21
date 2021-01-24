const mongoose = require("mongoose");

const HostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  warden: { type: mongoose.ObjectId, ref: "User" },
  associate_warden: { type: mongoose.ObjectId, ref: "User" },
  care_taker: { type: mongoose.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Hostel", HostelSchema);
