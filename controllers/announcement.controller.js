const Announcement = require("../models/announcement");
const fs = require("fs");

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({});
    announcements.sort(compare);
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
    const { title, description } = req.body;
    if (typeof req.file !== "undefined") {
      const path = req.file.filename;
      const newAnnouncement = new Announcement({ title, description, path });
      await newAnnouncement.save();
    } else {
      const newAnnouncement = new Announcement({ title, description });
      await newAnnouncement.save();
    }

    return res.redirect("/announcement");
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
    const { title, description } = req.body;

    const data = { title, description };
    if (req.file) {
      const announcement = req.file.filename;
      data["path"] = announcement;
    }
    await Announcement.findByIdAndUpdate(req.params.id, data);
    return res.redirect("/announcement");
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
    return res.redirect("/announcement");
  } catch (err) {
    // handle the error
    console.log(err.message);
    return res.redirect("/announcement");
  }
};

const compare = (a, b) => {
  return b.creation - a.creation;
};
