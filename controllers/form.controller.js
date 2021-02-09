const Form = require("../models/form");
const fs = require("fs");

exports.getForms = async (req, res) => {
  const forms = await Form.find({});
  forms.sort(compare);
  res.render("forms/index", { forms });
};

exports.addFormForm = (req, res) => {
  res.render("forms/add");
};
exports.postForm = async (req, res) => {
  const { title, description, link } = req.body;
  if (typeof req.file !== "undefined") { 
    const path = req.file.filename;
    const newForm = new Form({ title, description, path });
    await newForm.save();
  } else if(link != undefined) {
    const newForm = new Form({ title, description, path: link});
    await newForm.save();
  }
  res.redirect("/form");
};


exports.getEditForm = async (req, res) => {
  const form = await Form.findById(req.params.id);
  return res.render("forms/edit", { form });
};

exports.editForm = async (req, res) => {
  const { title, description, link } = req.body;

  const data = { title, description, link };
  if (req.file) {
    const form = `uploads/form_pdf/${req.file.filename}`;
    data["form"] = form;
  }
  console.log(data);
  await Form.findByIdAndUpdate(req.params.id, data);
  return res.redirect("/form");
};

exports.getOneForm = async (req, res) => {
  const id = req.params.id;
  const form = await Form.findById(id);
  const filePath = "uploads/form_pdf/" + form.path;
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
    fs.unlinkSync(`uploads/form_pdf/${form.path}`);
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
