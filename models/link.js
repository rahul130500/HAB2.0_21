const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priority_number: { type: Number, required: true },
  sublinks: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
      priority_number: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Link", LinkSchema);
