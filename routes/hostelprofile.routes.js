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
    cb(null, "./uploads/hostel_files");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

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
  upload.single("image"),
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

router.put(
  "/hmc/:id",
  isLoggedIn,
  isHostelAdmin,
  upload.single("image"),
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
  hostelController.editWeb
);
// notice route
router.get("/notice", isLoggedIn, isHostelAdmin, hostelController.getNotices);

router.get(
  "/notice/add",
  isLoggedIn,
  isHostelAdmin,
  hostelController.addNoticeForm
);

router.post(
  "/notice",
  isLoggedIn,
  isHostelAdmin,
  upload.single("notice"),
  hostelController.postNotice
);

router.get("/notice/:notice_id", hostelController.getEditForm);

router.get("/notice/pdf/:notice_id", hostelController.getOneNotice);

router.put(
  "/notice/:notice_id",
  isLoggedIn,
  isHostelAdmin,
  upload.single("notice"),
  hostelController.editNotice
);

router.delete(
  "/notice/:notice_id",
  isLoggedIn,
  isHostelAdmin,
  hostelController.deleteNotice
);
// event routes

router.get("/event", isLoggedIn, isHostelAdmin, hostelController.getEvents);

router.get(
  "/event/add",
  isLoggedIn,
  isHostelAdmin,
  hostelController.addEventForm
);

router.post(
  "/event",
  isLoggedIn,
  isHostelAdmin,
  upload.single("event"),
  hostelController.postEvent
);

router.get("/event/:event_id", hostelController.getEditEvent);

router.get("/event/pdf/:event_id", hostelController.getOneEvent);

router.put(
  "/event/:event_id",
  isLoggedIn,
  isHostelAdmin,
  upload.single("event"),
  hostelController.editEvent
);

router.delete(
  "/event/:event_id",
  isLoggedIn,
  isHostelAdmin,
  hostelController.deleteEvent
);
















module.exports = router;
