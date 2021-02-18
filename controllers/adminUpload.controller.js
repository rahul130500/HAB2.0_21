const AdminUploads = require("../models/adminUploads");
const fs = require("fs");

exports.getAllUploads = async (req, res, next) => {
  try {
    const uploads = await AdminUploads.find({});

    return res.render("adminUploads/index", {
      uploads,
      link: "/uploads/addUpload",
    });
  } catch (error) {
    console.log(error.message);
  }
};
exports.addUploadForm = (req, res) => {
  try {
    return res.render("adminUploads/add", { link: "/uploads" });
  } catch (error) {
    console.log(error.message);
  }
};

exports.updateUploadForm = async (req, res) => {
  try {
    const id = req.params.id;
    const upload = await AdminUploads.findById(id);
    if (!upload) {
      req.flash("error", "Cannot update");
      return res.redirect("/admin/uploads");
    }

    return res.render("adminUploads/edit", {
      link: "/uploads/" + req.params.id,
      upload,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.updateUpload = async (req, res) => {
  try {
    const id = req.params.id;

    const upload = await AdminUploads.findById(id);
    if (!upload) {
      req.flash("error", "Cannot find uploaded file");
      return res.redirect("/admin/uploads");
    }

    var image_name = upload.image_name;
    var image = upload.image;
    if (req.body.image_name) {
      image_name = req.body.image_name;
      image_name = image_name.charAt(0).toUpperCase() + image_name.slice(1);
    }
    if (req.file) {
      fs.unlinkSync(`uploads/adminUploads/${upload.image}`);
      image = req.file.filename;
    }
    const obj = { image_name, image };
    const uploadFile = await AdminUploads.findByIdAndUpdate(id, obj, {
      runValidators: true,
    });
    if (!uploadFile) {
      req.flash("error", "Cannot upload file");
      return res.redirect("/admin/uploads");
    }
    req.flash("success", "Successfully updated upload file");

    return res.redirect("/admin/uploads");
  } catch (error) {
    console.log(error.message);
  }
};

exports.createUpload = async (req, res) => {
  try {
    var { image_name } = req.body;
    image_name = image_name.charAt(0).toUpperCase() + image_name.slice(1);
    var image;
    if (req.file) image = req.file.filename;
    const newUpload = new AdminUploads({ image_name, image });
    const upload = await newUpload.save();
    if (!upload) {
      req.flash("error", "Cannot add file");
      return res.redirect("/admin/uploads");
    }
    req.flash("success", "Successfully uploaded file");
    return res.redirect("/admin/uploads");
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteUpload = async (req, res) => {
  try {
    const id = req.params.id;
    const upload = await AdminUploads.findById(id);
    if (!upload) {
      req.flash("error", "Cannot find uploaded file");
      return res.redirect("/admin/uploads");
    }
    fs.unlinkSync(`uploads/adminUploads/${upload.image}`);

    console.log("successfully deleted!");
    await AdminUploads.findByIdAndRemove(id);

    req.flash("success", "Successfully deleted file");
    return res.redirect("/admin/uploads");
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/admin/uploads");
  }
};
exports.deleteAllImages = async (req, res) => {
  try {
    const uploads = await AdminUploads.find({});
    if (!uploads) {
      req.flash("error", "Cannot find uploaded files");
      return res.redirect("/admin/uploads");
    }

    uploads.forEach((upload) => {
      if (upload.image) fs.unlinkSync(`uploads/adminUploads/${upload.image}`);
    });
    await AdminUploads.deleteMany({});

    req.flash("success", "Successfully deleted all files");

    console.log("successfully deleted all images");

    return res.redirect("/admin/uploads");
  } catch (err) {
    // handle the error
    console.log(err);
    res.redirect("/admin/uploads");
  }
};
