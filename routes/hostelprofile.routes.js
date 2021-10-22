const express = require("express");

const { isAdmin, isLoggedIn } = require("../middleware/index");
const multer = require("multer");
const fs = require("fs");
const hostelController = require("../controllers/hostelprofile.controllers");
// Express Router
const router = express.Router();

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

// Home page - Check if user is admin and is logged in
router.get("/", isLoggedIn, isAdmin, (req, res) => {
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

//HMC Routes
router.get("/hmc", isLoggedIn, isAdmin, hostelController.getDetails);

router.post(
  "/hmc/add",
  isLoggedIn,
  isAdmin,
  upload,
  hostelController.postDetails
);

router.get("/hmc/add", isLoggedIn, isAdmin, (req, res) => {
  res.render("hostelAdmin/hmc/add");
});

router.get("/hmc/:id", isLoggedIn, isAdmin, hostelController.getEditDetails);

router.post(
  "/hmc/:id",
  isLoggedIn,
  isAdmin,
  upload,
  hostelController.editDetails
);

router.get(
  "/hmc/delete/:id",
  isLoggedIn,
  isAdmin,
  hostelController.deleteDetails
);

//Personal Website Routes
router.get("/personal/add", isLoggedIn, isAdmin, (req, res) => {
  res.render("hostelAdmin/personalweb/add");
});

router.get("/personal", isLoggedIn, isAdmin, hostelController.getWeb);

router.get("/personal/:id", isLoggedIn, isAdmin, hostelController.getEditWeb);

router.post(
  "/personal/:id",
  isLoggedIn,
  isAdmin,
  upload,
  hostelController.editWeb
);

module.exports = router;
