const Notice = require("../models/notice");
const Announcement = require("../models/announcement");
const AdminUpload = require("../models/adminUploads");

exports.getHome = async (req, res) => {
  let notices = await Notice.find({});
  let announcement = await Announcement.find({});
  let uploads = await AdminUpload.find({});
  notices.sort(compare);
  return res.render("users/home", { notices, announcement, uploads });
};

const compare = (a, b) => {
  return b.creation - a.creation;
};
