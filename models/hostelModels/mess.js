const mongoose = require("mongoose");

const MessSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hostel: { type: String, required: true },
  number: { type: String, default: "00" },
  path: { type: String, required: true },
  creation: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Mess", MessSchema);
