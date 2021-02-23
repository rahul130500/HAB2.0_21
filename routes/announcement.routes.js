const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isAdmin } = require("../middleware");
const announcementController = require("../controllers/announcement.controller");

router.get("/", isLoggedIn, isAdmin, announcementController.getAnnouncements);

router.get(
  "/add",
  isLoggedIn,
  isAdmin,
  announcementController.addAnnouncementForm
);

router.post("/", isLoggedIn, isAdmin, announcementController.postAnnouncement);

router.post(
  "/find",
  isLoggedIn,
  isAdmin,
  announcementController.findAnnouncement
);

router.get("/:id", isLoggedIn, isAdmin, announcementController.getEditForm);

router.put(
  "/:id",
  isLoggedIn,
  isAdmin,
  announcementController.editAnnouncement
);

router.delete(
  "/:id",
  isLoggedIn,
  isAdmin,
  announcementController.deleteAnnouncement
);

module.exports = router;
