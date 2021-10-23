//Check the hostelprofile.controller file this file is not in use

const home = require("../../models/hostelModels/home.models");
const fs = require("fs");

exports.getWeb = async (req, res) => {
  home.find().exec((err, home) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("hostelAdmin/home/index", {
        home: home,
      });
    }
  });
};

exports.getEditWeb = async (req, res) => {
  const id = req.params.id;
  home.findById(id, (err, detail) => {
    if (err) {
      res.redirect("/");
    } else {
      if (detail == null) {
        res.redirect("/");
      } else {
        res.render("hostelAdmin/home/add", {
          detail: detail,
        });
      }
    }
  });
};
