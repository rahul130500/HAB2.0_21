const Announcement = require("../models/announcement");
const fs = require("fs");

exports.getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find({});
  announcements.sort(compare);
  res.render("announcement", { announcements });
};

exports.addAnnouncementForm = (req, res) => {
  res.render("announcement_add");
};

exports.postNotice = async (req, res) => {
  const { description } = req.body;
  if (typeof req.file !== "undefined") {
    const path = req.file.filename;
    const newAnnouncement = new Announcement({ description, path });
    await newAnnouncement.save();
  } else {
    const newAnnouncement = new Announcement({ description });
    await newAnnouncement.save();
  }

  res.redirect("/announcement");
};

exports.getOneAnnouncement = async (req, res) => {
  const id = req.params.id;
  const announcement = await Announcement.findById(id);

  if (typeof announcement.path !== "undefined") {
    const filePath = "uploads/" + announcement.path;
    console.log(filePath);
    fs.readFile(filePath, (err, data) => {
      res.contentType("application/pdf");
      res.send(data);
    });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;
    const announcement = await Announcement.findById(id);
    if (typeof announcement.path !== "undefined") {
      fs.unlinkSync(`uploads/${announcement.path}`);
    }
    console.log("successfully deleted /tmp/hello");
    await Announcement.findByIdAndRemove(id);
    res.redirect("/announcement");
  } catch (err) {
    // handle the error
    console.log(err);
    res.redirect("/announcement");
  }
};

const compare = (a, b) => {
  return b.creation - a.creation;
};
