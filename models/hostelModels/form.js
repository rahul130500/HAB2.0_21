const mongoose = require("mongoose");

const HostelFormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  hostel: { type: String, required: true },
  number: { type: String, required: true },
  creation: { type: Date, required: true },
});

module.exports = mongoose.model("HostelForm", HostelFormSchema);
