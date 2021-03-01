const mongoose = require("mongoose");

const HostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pic: { type: String, required: true },
  description: { type: String, required: true },
  management: [
    {
      Mname: { type: String, required: true },
      position: { type: String, required: true },
      priority: { type: Number, required: true },
      photo: { type: String, required: true },
      contact1: { type: String },
      contact2: { type: String },
      email: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Hostel", HostelSchema);
