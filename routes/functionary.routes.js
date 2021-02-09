const express = require("express");
const router = express.Router();
const funcController = require("../controllers/functionary.controller");
const multer = require("multer");
const middleware = require("../middleware");
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

router.get("/", middleware.isLoggedIn, funcController.getFunctionary);
router.get("/add", middleware.isLoggedIn, funcController.addFunctionaryForm);
router.post(
  "/",
  middleware.isLoggedIn,
  upload.single("pic"),
  funcController.postFunctionary
);
router.get("/:func_id", middleware.isLoggedIn, funcController.getEditForm);
router.put(
  "/:func_id",
  middleware.isLoggedIn,
  upload.single("pic"),
  funcController.editFunctionary
);
router.delete(
  "/:func_id",
  middleware.isLoggedIn,
  funcController.deleteFunctionary
);

module.exports = router;
