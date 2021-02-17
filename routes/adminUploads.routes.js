const express = require("express");
const fs = require("fs");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isAdmin } = require("../middleware");
const authController = require("../controllers/auth.controller");
const adminUploadController = require("../controllers/adminUpload.controller");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/adminUploads/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s/g, "");
    cb(null, Date.now().toString() + fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/", isLoggedIn, isAdmin, adminUploadController.getAllUploads);

router.get(
  "/addUpload",
  isLoggedIn,
  isAdmin,
  adminUploadController.addUploadForm
);

router.delete("/:id", isLoggedIn, isAdmin, adminUploadController.deleteUpload);

router.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.single("image"),
  adminUploadController.createUpload
);

router.get(
  "/:id/updateUpload",
  isLoggedIn,
  isAdmin,
  adminUploadController.updateUploadForm
);

router.patch(
  "/:id",
  upload.single("image"),
  adminUploadController.updateUpload
);

router.delete(
  "/delete/allUploads",
  isLoggedIn,
  isAdmin,
  adminUploadController.deleteAllImages
);

module.exports = router;
