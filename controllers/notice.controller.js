const Notice = require("../models/notice");
const Category = require("../models/category");

const fs = require("fs");

exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({});
    notices.sort(compare);
    return res.render("notices/index", { notices });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addNoticeForm = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.render("notices/add", { categories });
  } catch (error) {
    console.log(error.message);
  }
};

exports.postNotice = async (req, res) => {
  try {
    var { title, description, category, link } = req.body;
    let name = req.body.category.toLowerCase();

    const path = req.file ? req.file.filename : link;
    const newNotice = new Notice({ title, description, category: name, path });
    await newNotice.save();

    const savedCategory = await Category.find({ name: name });

    if (savedCategory.length == 0) {
      const newCategory = new Category({ name });
      await newCategory.save();
    }

    return res.redirect("/notice");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditForm = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.notice_id);
    const categories = await Category.find({});

    return res.render("notices/edit", { notice, categories });
  } catch (error) {
    console.log(error.message);
  }
};

exports.editNotice = async (req, res) => {
  try {
    var { title, description, category, link } = req.body;
    let name = category.toLowerCase();

    const path = req.file ? req.file.filename : link;

    const savedCategory = await Category.find({ name: name });

    if (savedCategory.length == 0) {
      const newCategory = new Category({ name });
      await newCategory.save();
    }

    const data = { title, description, path, category: name };

    await Notice.findByIdAndUpdate(req.params.notice_id, data);

    return res.redirect("/notice");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getOneNotice = async (req, res) => {
  try {
    const id = req.params.notice_id;
    const notice = await Notice.findById(id);
    const filePath = "uploads/notice_pdf/" + notice.path;
    console.log(filePath);
    fs.readFile(filePath, (err, data) => {
      res.contentType("application/pdf");
      return res.send(data);
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const id = req.params.notice_id;
    const notice = await Notice.findById(id);
    fs.unlinkSync(`uploads/notice_pdf/${notice.path}`);
    console.log("successfully deleted!");
    await Notice.findByIdAndRemove(id);
    return res.redirect("/notice");
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/notice");
  }
};

const compare = (a, b) => {
  return b.creation - a.creation;
};
