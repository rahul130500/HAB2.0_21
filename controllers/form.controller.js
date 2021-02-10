const Form = require("../models/form");
const fs = require("fs");

exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find({});
    forms.sort(compare);
    return res.render("forms/index", { forms });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addFormForm = (req, res) => {
  try {
    return res.render("forms/add");
  } catch (error) {
    console.log(error.message);
  }
};

exports.postForm = async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const path = req.file ? req.file.filename : link;

    const newForm = new Form({ title, description, path });
    await newForm.save();

    return res.redirect("/admin/form");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    return res.render("forms/edit", { form });
  } catch (error) {
    console.log(error.message);
  }
};

exports.editForm = async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const path = req.file ? req.file.filename : link;
    const data = { title, description, link, path };
    await Form.findByIdAndUpdate(req.params.id, data);
    return res.redirect("/admin/form");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getOneForm = async (req, res) => {
  try {
    const id = req.params.id;
    const form = await Form.findById(id);
    const filePath = "uploads/form_pdf/" + form.path;
    console.log(filePath);
    fs.readFile(filePath, (err, data) => {
      res.contentType("application/pdf");
      return res.send(data);
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const id = req.params.id;
    const form = await Form.findById(id);

    if (form.path.indexOf("https://") == -1) {
      fs.unlinkSync(`uploads/form_pdf/${form.path}`);
      console.log("successfully deleted /tmp/hello");
    }
    await Form.findByIdAndRemove(id);
    return res.redirect("/admin/form");
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/admin/form");
  }
};

const compare = (a, b) => {
  return b.creation - a.creation;
};
