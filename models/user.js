const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  accessToken: { type: String, required: true, select: false },
  name: { type: String },
  isAdmin: { type: Boolean, default: false },
  isHostelAdmin: { type: Boolean, default: false },
  hostel: { type: String },
  role: { type: String, required: true, default: "NA" },
  contact: { type: Number, length: 10 },
});
module.exports = mongoose.model("User", UserSchema);
