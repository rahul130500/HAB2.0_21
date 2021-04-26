const express = require("express");
const router = express.Router({ mergeParams: true });
const { isAdmin, isLoggedIn } = require("../middleware");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/Ordinance_pdf");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s/g, "");
    cb(null, Date.now().toString() + fileName);
  },
});
const OrdinanceController = require("../controllers/Ordinance.controller");
const upload = multer({ storage: storage });

router.get("/", isLoggedIn, isAdmin, OrdinanceController.getOrdinances);

router.get("/add", isLoggedIn, isAdmin, OrdinanceController.addOrdinanceForm);

router.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.single("Ordinance"),
  OrdinanceController.postOrdinance
);

router.post(
  "/find",
  isLoggedIn,
  isAdmin,
  upload.single("Ordinance"),
  OrdinanceController.findOrdinance
);

router.get("/:Ordinance_id", OrdinanceController.getEditForm);

router.get("/pdf/:Ordinance_id", OrdinanceController.getOneOrdinance);

router.put(
  "/:Ordinance_id",
  isLoggedIn,
  isAdmin,
  upload.single("Ordinance"),
  OrdinanceController.editOrdinance
);

router.delete(
  "/:Ordinance_id",
  isLoggedIn,
  isAdmin,
  OrdinanceController.deleteOrdinance
);

module.exports = router;
