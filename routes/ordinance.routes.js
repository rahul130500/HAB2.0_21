const express = require("express");
const router = express.Router({ mergeParams: true });
const { isAdmin, isLoggedIn } = require("../middleware");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/ordinance_pdf");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s/g, "");
    cb(null, Date.now().toString() + fileName);
  },
});
const ordinanceController = require("../controllers/ordinance.controller");
const upload = multer({ storage: storage });

router.get("/", isLoggedIn, isAdmin, ordinanceController.getOrdinances);

router.get("/add", isLoggedIn, isAdmin, ordinanceController.addOrdinanceForm);

router.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.single("ordinance"),
  ordinanceController.postOrdinance
);

router.post(
  "/find",
  isLoggedIn,
  isAdmin,
  upload.single("ordinance"),
  ordinanceController.findOrdinance
);

router.get("/:ordinance_id", ordinanceController.getEditForm);

router.get("/pdf/:ordinance_id", ordinanceController.getOneOrdinance);

router.put(
  "/:ordinance_id",
  isLoggedIn,
  isAdmin,
  upload.single("ordinance"),
  ordinanceController.editOrdinance
);

router.delete(
  "/:ordinance_id",
  isLoggedIn,
  isAdmin,
  ordinanceController.deleteOrdinance
);

module.exports = router;
