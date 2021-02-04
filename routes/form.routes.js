const express = require("express");
const router = express.Router({ mergeParams: true });
const middleware = require("../middleware");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/forms/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s/g, "");
    cb(null, Date.now().toString() + fileName);
  },
});
const formController = require("../controllers/form.controller");

const upload = multer({ storage: storage });

router.get("/", middleware.isLoggedIn, formController.getForms);

router.get("/add", middleware.isLoggedIn, formController.addFormForm);

router.post(
  "/",
  middleware.isLoggedIn,
  upload.single("form"),
  formController.postForm
);

router.get("/:id", formController.getOneForm);

router.delete("/:id", middleware.isLoggedIn, formController.deleteForm);

const compare = (a, b) => {
  return b.creation - a.creation;
};

module.exports = router;
