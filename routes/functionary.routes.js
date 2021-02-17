const express = require("express");
const router = express.Router();
const funcController = require("../controllers/functionary.controller");
const multer = require("multer");
const { isLoggedIn, isAdmin } = require("../middleware");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/functionary_images");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s/g, "");
    cb(null, Date.now().toString() + fileName);
  },
});
const upload = multer({ storage: storage });

router.get("/", isLoggedIn, isAdmin, funcController.getFunctionary);
router.get("/add", isLoggedIn, isAdmin, funcController.addFunctionaryForm);
router.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.single("pic"),
  funcController.postFunctionary
);
router.get("/:func_id", isLoggedIn, isAdmin, funcController.getEditForm);
router.put(
  "/:func_id",
  isLoggedIn,
  isAdmin,
  upload.single("pic"),
  funcController.editFunctionary
);
router.delete(
  "/:func_id",
  isLoggedIn,
  isAdmin,
  funcController.deleteFunctionary
);

module.exports = router;
