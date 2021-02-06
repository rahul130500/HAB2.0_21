const Announcement = require("../models/announcement");
const fs = require("fs");

exports.getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find({});
  announcements.sort(compare);
  res.render("announcements/index", { announcements });
};

exports.addAnnouncementForm = (req, res) => {
  res.render("announcements/add");
};

exports.postAnnouncement = async (req, res) => {
  const { title, description } = req.body;
  if (typeof req.file !== "undefined") {
    const path = req.file.filename;
    const newAnnouncement = new Announcement({ title, description, path });
    await newAnnouncement.save();
  } else {
    const newAnnouncement = new Announcement({ title, description });
    await newAnnouncement.save();
  }

  res.redirect("/announcement");
};


exports.getEditForm = async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  return res.render("announcements/edit", { announcement });
};

exports.editAnnouncement = async (req, res) => {
  const { title, description } = req.body;

  const data = { title, description };
  if (req.file) {
    const announcement = `uploads/announcement_pdf/${req.file.filename}`;
    data["announcement"] = announcement;
  }
  console.log(data);
  await Announcement.findByIdAndUpdate(req.params.id, data);
  return res.redirect("/announcement");
};

exports.getOneAnnouncement = async (req, res) => {
  const id = req.params.id;
  const announcement = await Announcement.findById(id);

  if (typeof announcement.path !== "undefined") {
    const filePath = "uploads/announcement_pdf/" + announcement.path;
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
      try {
        fs.unlinkSync(`uploads/announcement_pdf/${announcement.path}`);
      } catch (err) {}
    }
    console.log("successfully deleted /tmp/hello1");
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
