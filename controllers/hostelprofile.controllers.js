const About = require("../models/hostelModels/about.models");
const hmcDetail = require("../models/hostelModels/hmc.models");
const fs = require("fs");
const personalweb = require("../models/hostelModels/personalweb.models");

exports.getAboutDetails = async (req, res) => {
  try {
    const aboutdetails = await About.find({}).sort({ _id: -1 }).limit(1);
    return res.render("hostelAdmin/about/index", { aboutdetails });
  } catch (err) {
    console.error(err);
    return res.json({
      message: err.message,
      type: "database connection error",
    });
  }
};

exports.addAboutDetails = async (req, res) => {
  try {
    await About.create(req.body);
    return res.redirect("/hab/admin/hostel/:hostelName/about");
  } catch (err) {
    console.error(err.message);
    return res.json({
      message: err.message,
      type: "database connection error",
    });
  }
};

exports.getDetails = async (req, res) => {
  try {
    // res.render("../views/admin/hmc/index");
    hmcDetail.find().exec((err, hmcdetails) => {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.render("hostelAdmin/hmc/index", {
          hmcdetails: hmcdetails,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.redirect("/hab/admin");
  }
};

exports.postDetails = async (req, res) => {
  try {
    const detail = new hmcDetail({
      name: req.body.name,
      post: req.body.post,
      image: req.file.filename,
      contno: req.body.contno,
      roomno: req.body.roomno,
      email: req.body.email,
      priono: req.body.priono,
    });
    detail.save((err) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        res.redirect("/hab/admin/hostel/:hostelName/hmc");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getEditDetails = async (req, res) => {
  try {
    const id = req.params.id;
    hmcDetail.findById(id, (err, detail) => {
      if (err) {
        res.redirect("/");
      } else {
        if (detail == null) {
          res.redirect("/");
        } else {
          res.render("hostelAdmin/hmc/edit", {
            detail: detail,
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.editDetails = async (req, res) => {
  const id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/details_img" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  hmcDetail.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      post: req.body.post,
      image: new_image,
      contno: req.body.contno,
      roomno: req.body.roomno,
      email: req.body.email,
      priono: req.body.priono,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.redirect("/hab/admin/hostel/:hostelName/hmc");
      }
    }
  );
};

exports.deleteDetails = async (req, res) => {
  const id = req.params.id;
  hmcDetail.findByIdAndRemove(id, (err, result) => {
    if (result.image != "") {
      try {
        fs.unlinkSync("./uploads/details_img/" + result.image);
      } catch (err) {
        console.log(err);
      }
    }
    if (err) {
      res.json({ message: err.message });
    } else {
      res.redirect("/hab/admin/hostel/:hostelName/hmc");
    }
  });
};

exports.getWeb = async (req, res) => {
  personalweb.find().exec((err, personalwebs) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("hostelAdmin/personalweb/index", {
        personalwebs: personalwebs,
      });
    }
  });
};

exports.getEditWeb = async (req, res) => {
  const id = req.params.id;
  personalweb.findById(id, (err, detail) => {
    if (err) {
      res.redirect("/");
    } else {
      if (detail == null) {
        res.redirect("/");
      } else {
        res.render("hostelAdmin/personalweb/add", {
          detail: detail,
        });
      }
    }
  });
};
