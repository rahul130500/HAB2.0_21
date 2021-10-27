const express = require("express");
const router = express.Router({ mergeParams: true });
const { isAdmin, isLoggedIn } = require("../middleware/adminauth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/mess_pdf");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s/g, "");
    cb(null, Date.now().toString() + fileName);
  },
});
const messController = require("../controllers/mess.controller");
const upload = multer({ storage: storage });

router.get("/", isLoggedIn,isAdmin,messController.getMessInfo);

router.get("/add", isLoggedIn,isAdmin, messController.addMessForm);

router.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.single("mess"),
  messController.postMess
);



router.get("/:mess_id", messController.getMessEditForm);

router.get("/pdf/:mess_id", messController.getOneMess);

router.put(
  "/:mess_id",
  isLoggedIn,
  isAdmin,
  upload.single("mess"),
  messController.editMess
);

router.delete(
  "/:mess_id",
  isLoggedIn,
  isAdmin,
  messController.deleteMess
);


module.exports = router;