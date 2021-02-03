const Form = require("../models/form");
const fs = require("fs");

exports.getForms = async (req, res) => {
  const forms = await Form.find({});
  forms.sort(compare);
  res.render("form", { forms });
};

exports.addFormForm = (req, res) => {
  res.render("form_add");
};
exports.postForm = async (req, res) => {
  const { title, description } = req.body;
  const path = req.file.filename;

  const newForm = new Form({ title, description, path });
  await newForm.save();

  res.redirect("/form");
};

exports.getOneForm = async (req, res) => {
  const id = req.params.id;
  const form = await Form.findById(id);
  const filePath = "uploads/forms/" + form.path;
  console.log(filePath);
  fs.readFile(filePath, (err, data) => {
    res.contentType("application/pdf");
    res.send(data);
  });
};

exports.deleteForm = async (req, res) => {
  try {
    const id = req.params.id;
    const form = await Form.findById(id);
    fs.unlinkSync(`uploads/forms/${form.path}`);
    console.log("successfully deleted /tmp/hello");
    await Form.findByIdAndRemove(id);
    res.redirect("/form");
  } catch (err) {
    // handle the error
    console.log(err);
    res.redirect("/form");
  }
};

const compare = (a, b) => {
  return b.creation - a.creation;
};
