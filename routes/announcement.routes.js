const express = require("express");
const router = express.Router({ mergeParams: true });
const middleware = require("../middleware");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/announcement_pdf/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s/g, "");
    cb(null, Date.now().toString() + fileName);
  },
});
const announcementController = require("../controllers/announcement.controller");
const upload = multer({ storage: storage });

router.get("/", middleware.isLoggedIn, announcementController.getAnnouncements);

router.get("/add", middleware.isLoggedIn, announcementController.addAnnouncementForm);

router.post("/", middleware.isLoggedIn, upload.single("announcement"), announcementController.postAnnouncement);

router.get("/:id", announcementController.getEditForm);

router.get("/pdf/:id", announcementController.getOneAnnouncement);

router.put("/:id", middleware.isLoggedIn, upload.single("announcement"), announcementController.editAnnouncement);

router.delete("/:id", middleware.isLoggedIn, announcementController.deleteAnnouncement);

const compare = (a, b) => {
  return b.creation - a.creation;
};

module.exports = router;
