const Ordinance = require("../models/ordinance");
const Category = require("../models/category");

const fs = require("fs");

exports.getOrdinances = async (req, res) => {
  try {
    const ordinances = await Ordinance.find({});
    const categories = await Category.find({});

    ordinances.sort(compare);
    return res.render("ordinances/index", { ordinances, categories });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addOrdinanceForm = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.render("ordinances/add", { categories });
  } catch (error) {
    console.log(error.message);
  }
};

exports.postOrdinance = async (req, res) => {
  try {
    var { title, description, category, link } = req.body;
    let name = category.toLowerCase();

    const path = req.file ? req.file.filename : link;
    if (!path) {
      req.flash("error", "You need to add ordinance pdf or link!");
      return res.redirect("/hab/admin/ordinance/add");
    }
    //console.log(path);
    const newOrdinance = await new Ordinance({
      title,
      description,
      category: name,
      path,
    }).save();
    if (!newOrdinance) {
      req.flash("error", "Unable to add new ordinance");
      res.redirect("/hab/admin/ordinance/add");
    }
    const savedCategory = await Category.find({ name: name });

    if (savedCategory.length == 0) {
      const newCategory = new Category({ name });
      await newCategory.save();
    }
    req.flash("success", "Successfully added new ordinance");
    return res.redirect("/hab/admin/ordinance");
  } catch (error) {
    console.log(error.message);
  }
};

exports.findOrdinance = async (req, res) => {
  try {
    const val = req.body.mySearch1;
    const val2 = req.body.dropdown;
    var ordinances = await Ordinance.find({
      $and: [
        {
          $or: [
            { title: { $regex: val, $options: "i" } },
            { description: { $regex: val, $options: "i" } },
          ],
        },
        { category: { $regex: val2, $options: "i" } },
      ],
    });
    var categories = await Category.find({});
    ordinances.sort(compare);
    res.render("ordinances/index", { ordinances, categories });
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditForm = async (req, res) => {
  try {
    const ordinance = await Ordinance.findById(req.params.ordinance_id);
    const categories = await Category.find({});

    return res.render("ordinances/edit", { ordinance, categories });
  } catch (error) {
    console.log(error.message);
  }
};

exports.editOrdinance = async (req, res) => {
  try {
    var { title, description, category, link } = req.body;
    let name = category.toLowerCase();

    const path = req.file ? req.file.filename : link;
    let data;
    if (!req.file && !link) {
      data = { title, description, category: name };
    } else {
      data = { title, description, path, category: name };
    }

    const savedCategory = await Category.find({ name: name });

    if (savedCategory.length == 0) {
      const newCategory = new Category({ name });
      await newCategory.save();
    }

    const updatedOrdinance = await Ordinance.findByIdAndUpdate(
      req.params.ordinance_id,
      data
    );

    if (!updatedOrdinance) {
      req.flash("error", "Unable to edit ordinance");
      return res.redirect("/hab/admin/ordinance");
    }
    req.flash("success", "Successfully editted ordinance");
    return res.redirect("/hab/admin/ordinance");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getOneOrdinance = async (req, res) => {
  try {
    const id = req.params.ordinance_id;
    const ordinance = await Ordinance.findById(id);
    const filePath = "uploads/ordinance_pdf/" + ordinance.path;
    console.log(filePath);
    fs.readFile(filePath, (err, data) => {
      res.contentType("application/pdf");
      return res.send(data);
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteOrdinance = async (req, res) => {
  try {
    const id = req.params.ordinance_id;
    const ordinance = await Ordinance.findById(id);
    if (ordinance.path.indexOf("https://") == -1) {
      fs.unlinkSync(`uploads/ordinance_pdf/${ordinance.path}`);
      console.log("successfully deleted!");
    }
    await Ordinance.findByIdAndRemove(id);
    req.flash("success", "Successfully deleted ordinance");
    return res.redirect("/hab/admin/ordinance");
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/hab/admin/ordinance");
  }
};

const compare = (a, b) => {
  return b.creation - a.creation;
};
