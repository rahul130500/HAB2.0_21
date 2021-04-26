const mongoose = require("mongoose");

const AboutSchema = mongoose.Schema({
  title: { type: String },
  description: { type: String, required: true },

  priority_number: { type: Number, required: true },
});

module.exports = mongoose.model("About", AboutSchema);
