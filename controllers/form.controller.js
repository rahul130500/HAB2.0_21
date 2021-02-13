const Form = require("../models/form");
const fs = require("fs");
const Category = require("../models/category");


exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find({});
    const categories = await Category.find({});

    forms.sort(compare);
    return res.render("forms/index", { forms, categories });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addFormForm =async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.render("forms/add", { categories });
  } catch (error) {
    console.log(error.message);
  }
};

exports.postForm = async (req, res) => {
  try {
    const { title, description,category, link } = req.body;
    let name = category.toLowerCase();

    const path = req.file ? req.file.filename : link;

    const newForm = new Form({ title, description,category: name, path });
    await newForm.save();
    const savedCategory = await Category.find({ name: name });

    if (savedCategory.length == 0) {
      const newCategory = new Category({ name });
      await newCategory.save();
    }

    return res.redirect("/admin/form");
  } catch (error) {
    console.log(error.message);
  }
};

exports.findForm = async (req, res) => {
  try {
    const val = req.body.mySearch1;
    Form.find(
      {
        $or: [
          { title: { $regex: val, $options: "i" } },
          { description: { $regex: val, $options: "i" } },
        ],
      },
      (err, forms) => {
        if (err) {
          console.log(err);
        } else {
          res.render("forms/index", { forms });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    const categories = await Category.find({});

    return res.render("forms/edit", { form, categories  });
  } catch (error) {
    console.log(error.message);
  }
};

exports.editForm = async (req, res) => {
  try {
    const { title, description, category, link } = req.body;
    let name = category.toLowerCase();

    const path = req.file ? req.file.filename : link;
    let data;
    if (!req.file && !link) {
      data = { title, description , category: name};
    } else {
      data = { title, description, path, category: name };
    }
    const savedCategory = await Category.find({ name: name });

    if (savedCategory.length == 0) {
      const newCategory = new Category({ name });
      await newCategory.save();
    }

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
