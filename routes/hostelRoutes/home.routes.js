const express = require("express");
const router = express.Router();
const home = require("../../models/hostelModels/home.models");
// const { isAdmin, isLoggedIn } = require("../middlewares/adminauth");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/details_img');
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});
const upload = multer({
    storage: storage,
}).single("image");
const homeController = require("../../controllers/hostelControllers/home.controllers");

router.get("/add", (req, res) => {
  res.render("hostelAdmin/home/add");
});

router.get("/", homeController.getWeb);

router.get("/:id", homeController.getEditWeb);

router.post("/:id", upload, (req, res) => {
  const id = req.params.id;

  home.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      link: req.body.link,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.redirect("/hab/admin/hostel/:hostelName/home");
      }
    }
  );
});

module.exports = router;
