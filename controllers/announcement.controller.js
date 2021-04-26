const Announcement = require("../models/announcement");

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
    const { title, imp, link } = req.body;
    const important = imp ? true : false;
    console.log(important);
    var newAnnouncement;
    const path = req.file ? req.file.filename : link;
    if (!path) {
      newAnnouncement = new Announcement({
        title,
        important,
      });
    } else {
      newAnnouncement = new Announcement({
        title,
        important,
        link,
      });
    }
    await newAnnouncement.save();
    req.flash("success", "Successfully added new announcement!");
    return res.redirect("/hab/admin/announcement");
  } catch (error) {
    console.log(error.message);
  }
};

exports.findAnnouncement = async (req, res) => {
  try {
    const val = req.body.mySearch1;
    var announcements = await Announcement.find({
      $or: [{ title: { $regex: val, $options: "i" } }],
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
    const { title, imp } = req.body;
    const important = imp ? true : false;
    const data = { title, important };
    await Announcement.findByIdAndUpdate(req.params.id, data);

    req.flash("success", "Successfully updated announcement!");
    return res.redirect("/hab/admin/announcement");
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;
    const announcement = await Announcement.findById(id);
    await Announcement.findByIdAndRemove(id);

    req.flash("success", "Successfully deleted announcement!");
    return res.redirect("/hab/admin/announcement");
  } catch (err) {
    // handle the error
    console.log(err.message);
    return res.redirect("/hab/admin/announcement");
  }
};
