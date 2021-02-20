const Notice = require("../models/notice");
const Announcement = require("../models/announcement");
const AdminUpload = require("../models/adminUploads");
const Form = require("../models/form");
const Functionary = require("../models/functionary");
const Hostel = require("../models/hostel");

exports.getHome = async (req, res) => {
  let notices = await Notice.find({}).sort("-creation");
  let announcements = await Announcement.find({}).sort("-creation");
  let forms = await Form.find({}).sort("-creation");
  let uploads = await AdminUpload.find({});
  let uploadImages = [];
  uploads.forEach((upload) => {
    uploadImages.push(`uploads/adminUploads/${upload.image}`);
  });

  let functionaries = await Functionary.find({}).sort("-priority");

  return res.render("home/index", {
    notices,
    announcements,
    uploads,
    forms,
    functionaries,
    uploadImages,
  });
};

exports.getOneHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.hostel_id);
    const hostels = await Hostel.find({});

    // if (!hostel) {
    //   req.flash("error", "Cannot find hostel");
    //   return res.redirect("/");
    // }

    const members = hostel.management;
    members.sort((a, b) => (a.priority > b.priority ? 1 : -1));

    return res.render("home/hostels/hostel", { members, hostel, hostels });
  } catch (error) {
    console.log(error.message);
    return res.redirect("/");
  }
};
