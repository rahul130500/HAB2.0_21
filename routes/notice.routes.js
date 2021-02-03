const express = require("express");
const router = express.Router({ mergeParams: true });
const middleware = require("../middleware");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/notices/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s/g, "");
    cb(null, Date.now().toString() + fileName);
  },
});
const noticeController = require("../controllers/notice.controller");
const announcementController = require("../controllers/announcement.controller");
const upload = multer({ storage: storage });

router.get("/", middleware.isLoggedIn, noticeController.getNotices);

router.get("/add", middleware.isLoggedIn, noticeController.addNoticeForm);

router.post(
  "/",
  middleware.isLoggedIn,
  upload.single("notice"),
  noticeController.postNotice
);

router.get("/:notice_id", noticeController.getOneNotice);

router.delete(
  "/:notice_id",
  middleware.isLoggedIn,
  noticeController.deleteNotice
);

const compare = (a, b) => {
  return b.creation - a.creation;
};

module.exports = router;
