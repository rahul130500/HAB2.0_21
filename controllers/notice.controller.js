const Notice = require("../models/notice");
const Category = require("../models/category");

const fs = require("fs");
const Announcement = require("../models/announcement");

exports.getNotices = async (req, res) => {
  const notices = await Notice.find({});
  notices.sort(compare);
  return res.render("notices/index", { notices });
};


exports.addNoticeForm = async (req, res) => {
  const categories = await Category.find({});
  return res.render("notices/add",{categories});
};

exports.postNotice = async (req, res) => {
  var { title, description,category, imp, link } = req.body;
  var important = 0;
  if (imp != undefined) {
    important = 1;
  }
  const name=req.body.category;
  name = name.toLowerCase();

  if (typeof req.file !== "undefined") {
    const path = req.file.filename;
    link=path;
    const newNotice = new Notice({ title, description, category, path });
    await newNotice.save();
  }
  else if(link != undefined) {
    const newNotice = new Notice({ title, description, category, path: link });
    await newNotice.save();
  }
  if (important) {
    const newAnnouncement = new Announcement({ title, description,category, path });
    await newAnnouncement.save();
  }
  const savedCategory=await Category.find({name:name})

  if(savedCategory.length==0){
    const newCategory=new Category({name});
    await newCategory.save();
  }

  return res.redirect("/notice");
};

exports.getEditForm = async (req, res) => {
  const notice = await Notice.findById(req.params.notice_id);
  return res.render("notices/edit", { notice });
};

exports.editNotice = async (req, res) => {
  const { title, description, link } = req.body;

  const data = { title, description, link };
  if (req.file) {
    const notice = `uploads/notices_pdf/${req.file.filename}`;
    data["notice"] = notice;
  }
  console.log(data);
  await Notice.findByIdAndUpdate(req.params.notice_id, data);
  return res.redirect("/notice");
};

exports.getOneNotice = async (req, res) => {
  const id = req.params.notice_id;
  const notice = await Notice.findById(id);
  const filePath = "uploads/notice_pdf/" + notice.path;
  console.log(filePath);
  fs.readFile(filePath, (err, data) => {
    res.contentType("application/pdf");
    return res.send(data);
  });
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
