const Notice = require("../models/notice");
const fs = require("fs");

exports.getNotices = async (req, res) => {
  const notices = await Notice.find({});
  notices.sort(compare);
  res.render("notice", { notices });
};

exports.addNoticeForm = (req, res) => {
  res.render("notice_add");
};
exports.postNotice = async (req, res) => {
  const { title, description } = req.body;
  const path = req.file.filename;

  const newNotice = new Notice({ title, description, path });
  await newNotice.save();

  res.redirect("/notice");
};

exports.getOneNotice = async (req, res) => {
  const id = req.params.id;
  const notice = await Notice.findById(id);
  const filePath = "uploads/notices/" + notice.path;
  console.log(filePath);
  fs.readFile(filePath, (err, data) => {
    res.contentType("application/pdf");
    res.send(data);
  });
};

exports.deleteNotice = async (req, res) => {
  try {
    const id = req.params.id;
    const notice = await Notice.findById(id);
    fs.unlinkSync(`uploads/notices/${notice.path}`);
    console.log("successfully deleted /tmp/hello");
    await Notice.findByIdAndRemove(id);
    res.redirect("/notice");
  } catch (err) {
    // handle the error
    console.log(err);
    res.redirect("/notice");
  }
};

const compare = (a, b) => {
  return b.creation - a.creation;
};
