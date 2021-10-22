const express = require("express");
const router = express.Router();
const hmcDetail = require("../../models/hostelModels/hmc.models");
// const { isAdmin, isLoggedIn } = require("../middlewares/adminauth");
const multer = require("multer");
const fs = require("fs");

//image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/details_img");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
}).single("image");

//Importing the controller
const hmcController = require("../../controllers/hostelControllers/hmc.controllers");
const hostel = require("../../models/hostel");
const { log } = require("console");

//Get details from database
router.get("/", hmcController.getDetails);

//Add user to database
router.post("/add", upload, hmcController.postDetails);


router.get("/add", (req, res) => {
  res.render("hostelAdmin/hmc/add");
});

//Get details for editing
router.get("/edit/:id", hmcController.getEditDetails);

//Editing the user
router.post("/edit/:id", upload, hmcController.editDetails); 

router.get("/deletee/:id", hmcController.deleteDetails);

module.exports = router;
