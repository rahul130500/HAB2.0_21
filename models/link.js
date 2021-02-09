const mongoose = require("mongoose");

const sublinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  priority_number: { type: Number, required: true },
});

const LinkSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  priority_number: { type: Number, required: true },
  sublinks: [sublinkSchema],
});

module.exports = mongoose.model("Link", LinkSchema);
