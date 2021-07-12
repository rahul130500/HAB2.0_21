const mongoose = require("mongoose");

const personalwebSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String, required: true },
    
  
});

module.exports = mongoose.model("personalweb", personalwebSchema);