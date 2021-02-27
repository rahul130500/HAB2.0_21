const mongoose = require("mongoose");

const AdminUploadSchema = new mongoose.Schema({
  image_name: { type: String, required: true },
  image: { type: String, required: true },
  description:{type:String, required:true},
});

module.exports = mongoose.model("AdminUpload", AdminUploadSchema);
