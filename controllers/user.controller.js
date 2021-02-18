const Notice = require("../models/notice");
const Announcement = require("../models/announcement");
const AdminUpload = require("../models/adminUploads");
const Form = require("../models/form");
const Functionary = require("../models/functionary");

exports.getHome = async (req, res) => {
  let notices = await Notice.find({});
  let announcement = await Announcement.find({});
  let forms = await Form.find({});
  let uploads = await AdminUpload.find({});
  let functionaries = await Functionary.find({});
  notices.sort(compare);
  return res.render("home/index", {
    notices,
    announcement,
    uploads,
    forms,
    functionaries,
  });
};

const compare = (a, b) => {
  return b.creation - a.creation;
};
