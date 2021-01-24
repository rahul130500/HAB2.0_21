const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String },
  name: { type: String },
  isAdmin: { type: Boolean, default: false },
  role: { type: String, required: true, default: "NA" },
  contact: { type: Number, length: 10 },
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
