const Notice = require("../models/notice");
const Announcement = require("../models/announcement");
const AdminUpload = require("../models/adminUploads");
const Form = require("../models/form");
const Functionary = require("../models/functionary");
const Hostel = require("../models/hostel");
const Category = require("../models/category");
const Link = require("../models/link");
const Ordinance = require("../models/ordinance");
const About = require("../models/about");
const fs = require('fs');

//Hostel Data Models
const HostelNotice = require("../models/hostelModels/notice");
const HostelWebsite = require("../models/hostelModels/personalweb.models");
const HMC = require("../models/hostelModels/hmc.models");
const HostelForm = require("../models/hostelModels/mess");
const HostelEvent = require("../models/hostelModels/event");

exports.getHome = async (req, res) => {
  let notices = await Notice.find({}).sort("-creation");
  let categories = await Category.find({});
  let announcements = await Announcement.find({}).sort("-creation");
  let links = await Link.find({}).sort("priority_number");
  let forms = await Form.find({}).sort("-creation");
  let uploads = await AdminUpload.find({});
  let ordinances = await Ordinance.find({});
  let aboutInfos = await About.find({}).sort("priority_number");
  let uploadImages = [];
  uploads.forEach((upload) => {
    uploadImages.push(`uploads/adminUploads/${upload.image}`);
  });

  let functionaries = await Functionary.find({}).sort("-priority");
  let hostels = await Hostel.find({});

  return res.render("home/index", {
    notices,
    announcements,
    uploads,
    forms,
    functionaries,
    hostels,
    uploadImages,
    aboutInfos,
    categories,
    links,
    ordinances,
  });
};

exports.getOneHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.hostel_id);
    const hostels = await Hostel.find({});

    const name = hostel.name;
    // if (!hostel) {
    //   req.flash("error", "Cannot find hostel");
    //   return res.redirect("/");
    // }

    //hostel data
    const notices = await HostelNotice.find({ hostel: name }).sort("-creation");;
    const website = await HostelWebsite.findOne({ hostel: name });
    const hmclist = await HMC.find({ hostel: name }).sort("priono");
    const forms = await HostelForm.find({ hostel: name }).sort("-creation");
    const events = await HostelEvent.find({ hostel: name }).sort("-date");
    hmclist.sort((a, b) => (a.priono > b.priono ? 1 : -1));
    const members = hostel.management;
    members.sort((a, b) => (a.priority > b.priority ? 1 : -1));
    return res.render("home/hostels/hostel", {
      members,
      hostel,
      hostels,
      notices,
      website,
      hmclist,
      forms,
      events,
    });
  } catch (error) {
    console.log(error.message);
    return res.redirect("/hab");
  }
};



exports.getOneNotice = async (req, res) => {
  try {
    const id = req.params.id;
    const notice = await HostelNotice.findById(id);
    const filePath = "uploads/hostel_files/" + notice.path;
    console.log(filePath);
    fs.readFile(filePath, (err, data) => {
      res.contentType("application/pdf");
      return res.send(data);
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.getOneForm = async (req, res) => {
  try {
    
    const id = req.params.id;
    const form = await HostelForm.findById(id);
    const filePath = "uploads/hostel_files/" + form.path;
    
    fs.readFile(filePath, (err, data) => {
      res.contentType("application/pdf");
      return res.send(data);
    });
  } catch (error) {
    console.log(error.message);
  }
};