const Notice = require("../models/notice");
const Announcement = require("../models/announcement");
const AdminUpload = require("../models/adminUploads");
const Form = require("../models/form");
const Functionary = require("../models/functionary");
const Hostel = require("../models/hostel");

exports.getHome = async (req, res) => {
  let notices = await Notice.find({}).sort("-creation");
  let announcement = await Announcement.find({}).sort("-creation");
  let forms = await Form.find({}).sort("-creation");
  let uploads = await AdminUpload.find({});
  let functionaries = await Functionary.find({}).sort("-priority");

  return res.render("home/index", {
    notices,
    announcement,
    uploads,
    forms,
    functionaries,
  });
};

exports.getOneHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ name: req.params.name });

    if (!hostel) {
      req.flash("error", "Cannot find hostel");
      return res.redirect("/");
    }

    const members = hostel.management;
    members.sort((a, b) => (a.priority > b.priority ? 1 : -1));

    return res.render("home/hostels/hostel", { members, hostel });
  } catch (error) {
    console.log(error.message);
    return res.redirect("/");
  }
};
