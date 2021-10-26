const mongoose = require("mongoose");

const personalwebSchema = new mongoose.Schema({
  hostel: { type: String, required: true },
  link: { type: String, required: true },
});

module.exports = mongoose.model("personalweb", personalwebSchema);
