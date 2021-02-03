const express = require("express");
const router = express.Router();
const funcController = require("../controllers/functionary.controller");
const multer = require("multer");
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

router.get("/", funcController.getFunctionary);
router.get("/add", funcController.addFunctionaryForm);
router.post("/", upload.single("pic"), funcController.postFunctionary);
router.get("/:func_id", funcController.getEditForm);
router.put("/:func_id", upload.single("pic"), funcController.editFunctionary);
router.delete("/:func_id", funcController.deleteFunctionary);

module.exports = router;
