const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isAdmin } = require("../middleware");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/form_pdf/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s/g, "");
    cb(null, Date.now().toString() + fileName);
  },
});
const formController = require("../controllers/form.controller");

const upload = multer({ storage: storage });

router.get("/", isLoggedIn, isAdmin, formController.getForms);

router.get("/add", isLoggedIn, isAdmin, formController.addFormForm);

router.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.single("form"),
  formController.postForm
);

router.post(
  "/find",
  isLoggedIn,
  isAdmin,
  upload.single("form"),
  formController.findForm
);

router.get("/:id", formController.getEditForm);

router.get("/pdf/:id", formController.getOneForm);

router.put(
  "/:id",
  isLoggedIn,
  isAdmin,
  upload.single("form"),
  formController.editForm
);

router.delete("/:id", isLoggedIn, isAdmin, formController.deleteForm);

const compare = (a, b) => {
  return b.creation - a.creation;
};

module.exports = router;
