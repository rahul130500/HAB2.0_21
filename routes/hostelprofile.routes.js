const express = require("express");

const { isAdmin, isLoggedIn } = require("../middleware/adminauth");
const multer = require("multer");
const fs = require("fs");
const hostelController = require("../controllers/hostelprofile.controllers");

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

// Express Router
const router = express.Router();

// Home page - Check if user is admin and is logged in
router.get("/", isAdmin, isLoggedIn, (req, res) => {
  res.redirect("/hab/admin");
});

// Add about
router.get("/about/add", isLoggedIn, isAdmin, (req, res) => {
  res.render("hostelAdmin/about/add");
});

router.post(
  "/about/add",
  isLoggedIn,
  isAdmin,
  hostelController.addAboutDetails
);

router.get("/about", isLoggedIn, isAdmin, hostelController.getAboutDetails);

//Get details from database
router.get("/hmc", hostelController.getDetails);

//Add user to database
router.post("/hmc/add", upload, hostelController.postDetails);

router.get("/hmc/add", (req, res) => {
  res.render("hostelAdmin/hmc/add");
});

//Get details for editing
router.get("hmc/:id", hostelController.getEditDetails);

//Editing the user
router.post("hmc/:id", upload, hostelController.editDetails);

//Delete entry from database
router.get("/hmc/delete/:id", hostelController.deleteDetails);

router.get("/personal/add", (req, res) => {
  res.render("hostelAdmin/personalweb/add");
});

router.get("/personal", hostelController.getWeb);

router.get("/personal/:id", hostelController.getEditWeb);

router.post("/personal/:id", upload, hostelController.editWeb);

module.exports = router;
