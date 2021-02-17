const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isAdmin } = require("../middleware");
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

router.get("/", isLoggedIn, isAdmin, announcementController.getAnnouncements);

router.get(
  "/add",
  isLoggedIn,
  isAdmin,
  announcementController.addAnnouncementForm
);

router.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.single("announcement"),
  announcementController.postAnnouncement
);

router.post(
  "/find",
  isLoggedIn,
  isAdmin,
  upload.single("announcement"),
  announcementController.findAnnouncement
);

router.get("/:id", isLoggedIn, isAdmin, announcementController.getEditForm);

router.get("/pdf/:id", announcementController.getOneAnnouncement);

router.put(
  "/:id",
  isLoggedIn,
  isAdmin,
  upload.single("announcement"),
  announcementController.editAnnouncement
);

router.delete(
  "/:id",
  isLoggedIn,
  isAdmin,
  announcementController.deleteAnnouncement
);

module.exports = router;
