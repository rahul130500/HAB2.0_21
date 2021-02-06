const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  path: { type: String, required: true },
  link: {type: String},
  creation: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Form", FormSchema);
