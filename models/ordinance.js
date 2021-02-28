const mongoose = require("mongoose");

const OrdinanceSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    default: "NO LINK",
  },
  creation: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ordinance", OrdinanceSchema);
