const Notice = require("../models/notice");
const fs = require("fs");

exports.getNotices = async (req, res) => {
  const notices = await Notice.find({});
  notices.sort(compare);
  return res.render("notice", { notices });
};

exports.addNoticeForm = (req, res) => {
  res.render("notice_add");
};
exports.postNotice = async (req, res) => {
  const { title, description } = req.body;
  const path = req.file.filename;

  const newNotice = new Notice({ title, description, path });
  await newNotice.save();

  return res.redirect("/notice");
};

exports.getOneNotice = async (req, res) => {
  const id = req.params.notice_id;
  const notice = await Notice.findById(id);
<<<<<<< HEAD
  const filePath = "uploads/notices/" + notice.path;
=======
  const filePath = "uploads/notice/" + notice.path;
>>>>>>> 3ea9cccfb72f8376b64df74a6bdb954defcf76dd
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
<<<<<<< HEAD
    fs.unlinkSync(`uploads/notices/${notice.path}`);
    console.log("successfully deleted /tmp/hello");
=======
    fs.unlinkSync(`uploads/notice/${notice.path}`);
    console.log("successfully deleted!");
>>>>>>> 3ea9cccfb72f8376b64df74a6bdb954defcf76dd
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
