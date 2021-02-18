const Announcement = require("../models/announcement");
const fs = require("fs");

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({}).sort("-creation");
    return res.render("announcements/index", { announcements });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addAnnouncementForm = (req, res) => {
  try {
    return res.render("announcements/add");
  } catch (error) {
    console.log(error.message);
  }
};

exports.postAnnouncement = async (req, res) => {
  try {
    const { title, description, imp } = req.body;
    const important = imp ? true : false;
    console.log(important);
    if (typeof req.file !== "undefined") {
      const path = req.file.filename;
      const newAnnouncement = new Announcement({
        title,
        description,
        path,
        important,
      });
      await newAnnouncement.save();
    } else {
      const newAnnouncement = new Announcement({
        title,
        description,
        important,
      });
      await newAnnouncement.save();
    }

    return res.redirect("/admin/announcement");
  } catch (error) {
    console.log(error.message);
  }
};

exports.findAnnouncement = async (req, res) => {
  try {
    const val = req.body.mySearch1;
    var announcements = await Announcement.find({
      $or: [
        { title: { $regex: val, $options: "i" } },
        { description: { $regex: val, $options: "i" } },
      ],
    });
    res.render("announcements/index", { announcements });
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditForm = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    return res.render("announcements/edit", { announcement });
  } catch (error) {
    console.log(error.message);
  }
};

exports.editAnnouncement = async (req, res) => {
  try {
    const { title, description, imp } = req.body;
    const important = imp ? true : false;
    const data = { title, description, important };
    if (req.file) {
      data["path"] = req.file.filename;
    }
    await Announcement.findByIdAndUpdate(req.params.id, data);
    return res.redirect("/admin/announcement");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getOneAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;
    const announcement = await Announcement.findById(id);

    if (typeof announcement.path !== "undefined") {
      const filePath = "uploads/announcement_pdf/" + announcement.path;
      console.log(filePath);
      fs.readFile(filePath, (err, data) => {
        res.contentType("application/pdf");
        return res.send(data);
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;
    const announcement = await Announcement.findById(id);
    if (typeof announcement.path !== "undefined") {
      try {
        fs.unlinkSync(`uploads/announcement_pdf/${announcement.path}`);
      } catch (err) {
        console.log(err.message);
      }
    }
    await Announcement.findByIdAndRemove(id);
    return res.redirect("/admin/announcement");
  } catch (err) {
    // handle the error
    console.log(err.message);
    return res.redirect("/admin/announcement");
  }
};

// const compare = (a, b) => {
//   return b.creation - a.creation;
// };
