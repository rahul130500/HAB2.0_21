const Functionary = require("../models/functionary");
const fs = require("fs");

exports.getFunctionary = async (req, res) => {
  const functionaries = await Functionary.find({});
  functionaries.sort(compare);
  return res.render("functionary/index", { functionaries });
};

exports.addFunctionaryForm = (req, res) => {
  return res.render("functionary/add");
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
  const pic = `uploads/functionary_images/${req.file.filename}`;
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
  return res.redirect("/admin/functionary");
};

exports.getEditForm = async (req, res) => {
  const functionary = await Functionary.findById(req.params.func_id);
  return res.render("functionary/edit", { functionary });
};

exports.editFunctionary = async (req, res) => {
  const {
    name,
    post,
    priority_number,
    contact_line1,
    contact_line2,
    contact_line3,
    contact_line4,
  } = req.body;

  const data = {
    name,
    post,
    priority_number: Number(priority_number),
    contact: [contact_line1, contact_line2, contact_line3, contact_line4],
  };
  if (req.file) {
    const pic = `uploads/functionary_images/${req.file.filename}`;
    data["pic"] = pic;
  }
  console.log(data);
  await Functionary.findByIdAndUpdate(req.params.func_id, data);
  return res.redirect("/admin/functionary");
};

exports.deleteFunctionary = async (req, res) => {
  try {
    const id = req.params.func_id;
    const functionary = await Functionary.findById(id);
    fs.unlinkSync(`${functionary.pic}`);
    console.log("successfully deleted!");
    await Functionary.findByIdAndRemove(id);
    return res.redirect("/admin/functionary");
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/admin/functionary");
  }
};

const compare = (a, b) => {
  console.log(a, b);
  return a.priority_number - b.priority_number;
};
