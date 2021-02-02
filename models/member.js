const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name:{type:String, required:true},
      Hname:{type:String, required:true},
      position:{type:String, required:true},
      photo:String,
      contact: {type:Number, length:10,required:true},
      email:{type:String, required:true},
  
});

module.exports = mongoose.model("Member", MemberSchema);
