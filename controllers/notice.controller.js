const Notice = require("../models/notice");
const fs = require("fs");
const Announcement = require("../models/announcement");

exports.getNotices = async (req, res) => {
  const notices = await Notice.find({});
  notices.sort(compare);
  return res.render("notice", { notices });
};

exports.addNoticeForm = (req, res) => {
  return res.render("notice_add");
};
exports.postNotice = async (req, res) => {
  const { title, description, imp } = req.body;
  const path = req.file.filename;
  var important = 0;
  if (imp != undefined) {
    important = 1;
  }
  const newNotice = new Notice({ title, description, path });
  await newNotice.save();
  if (important) {
    const newAnnouncement = new Announcement({ title, description, path });
    await newAnnouncement.save();
  }

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
