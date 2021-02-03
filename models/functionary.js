const mongoose = require("mongoose");

const FunctionarySchema = mongoose.Schema({
  name: { type: String, required: true },
  pic: { type: String, required: true },
  post: { type: String, required: true },
  priority_number: { type: Number, required: true },
  contact: { type: [String] },
});

module.exports = mongoose.model("Functionary", FunctionarySchema);
