const express = require("express");
const fs = require("fs");
const router = express.Router({ mergeParams: true });
const middleware = require("../middleware");
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

router.get("/",middleware.isLoggedIn, adminUploadController.getAllUploads);

router.get("/addUpload", middleware.isLoggedIn, adminUploadController.addUploadForm);

router.delete("/:id", middleware.isLoggedIn, adminUploadController.deleteUpload);

router.post(
  "/",
  middleware.isLoggedIn,
  upload.single("image"),
  adminUploadController.createUpload
);

router.get("/:id/updateUpload",middleware.isLoggedIn,adminUploadController.updateUploadForm);

router.patch("/:id",upload.single("image"), adminUploadController.updateUpload);

router.delete(
  "/delete/allUploads",
  middleware.isLoggedIn,
  adminUploadController.deleteAllImages
);


module.exports = router;
