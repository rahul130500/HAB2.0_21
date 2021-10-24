const express = require("express");

const { isHostelAdmin, isLoggedIn } = require("../middleware/index");
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
router.get("/", isLoggedIn, isHostelAdmin, (req, res) => {
  res.redirect("/hab/admin");
});

// Add about
router.get("/about/add", isLoggedIn, isHostelAdmin, (req, res) => {
  res.render("hostelAdmin/about/add");
});

router.post(
  "/about/add",
  isLoggedIn,
  isHostelAdmin,
  hostelController.addAboutDetails
);

router.get(
  "/about",
  isLoggedIn,
  isHostelAdmin,
  hostelController.getAboutDetails
);

//HMC Routes
router.get("/hmc", isLoggedIn, isHostelAdmin, hostelController.getDetails);

router.post(
  "/hmc/add",
  isLoggedIn,
  isHostelAdmin,
  upload,
  hostelController.postDetails
);

router.get("/hmc/add", isLoggedIn, isHostelAdmin, (req, res) => {
  res.render("hostelAdmin/hmc/add");
});

router.get(
  "/hmc/:id",
  isLoggedIn,
  isHostelAdmin,
  hostelController.getEditDetails
);

router.post(
  "/hmc/:id",
  isLoggedIn,
  isHostelAdmin,
  upload,
  hostelController.editDetails
);

router.get(
  "/hmc/delete/:id",
  isLoggedIn,
  isHostelAdmin,
  hostelController.deleteDetails
);

//Personal Website Routes
router.get("/personal/add", isLoggedIn, isHostelAdmin, (req, res) => {
  res.render("hostelAdmin/personalweb/add");
});

router.get("/personal", isLoggedIn, isHostelAdmin, hostelController.getWeb);

router.get(
  "/personal/:id",
  isLoggedIn,
  isHostelAdmin,
  hostelController.getEditWeb
);

router.post(
  "/personal/:id",
  isLoggedIn,
  isHostelAdmin,
  upload,
  hostelController.editWeb
);

module.exports = router;
