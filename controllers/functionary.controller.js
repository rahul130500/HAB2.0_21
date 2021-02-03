const Functionary = require("../models/functionary");
const fs = require("fs");

exports.getFunctionary = async (req, res) => {
  const functionaries = await Functionary.find({});
  res.render("functionary", { functionaries });
};

exports.addFunctionaryForm = (req, res) => {
  res.render("functionary_add");
};

exports.postFunctionary = async (req, res) => {
  const {
    name,
    post,
    priority_number,
    contact_line1,
    contact_line2,
    contact_line3,
    contact_line4,
  } = req.body;
  const pic = `/functionary/${req.file.filename}`;
  const data = {
    name,
    post,
    priority_number: Number(priority_number),
    contact: [contact_line1, contact_line2, contact_line3, contact_line4],
    pic,
  };
  const newFunctionary = new Functionary(data);
  await newFunctionary.save();
  console.log(data);
  return res.redirect("/functionary");
};

exports.getEditForm = (req, res) => {};

exports.deleteFunctionary = async (req, res) => {
  try {
    const id = req.params.func_id;
    const functionary = await Functionary.findById(id);
    fs.unlinkSync(`uploads/${functionary.pic}`);
    console.log("successfully deleted!");
    await Functionary.findByIdAndRemove(id);
    return res.redirect("/functionary");
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/functionary");
  }
};
