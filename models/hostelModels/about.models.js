const mongoose = require("mongoose");

const detailsSchema = new mongoose.Schema({
    aboutdetail: { type: String, required: true },
});

module.exports = mongoose.model("aboutDetail", detailsSchema);