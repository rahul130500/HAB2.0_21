const express = require("express");
const fs = require("fs");
const router = express.Router({ mergeParams: true });
const middleware = require("../middleware");
const authController = require("../controllers/auth.controller");
const hostelController = require("../controllers/hostel.controller");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/hostel/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s/g, "");
    cb(null, Date.now().toString() + fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/", hostelController.getAllHostels);

router.get(
  "/:name/addMember",
  middleware.isLoggedIn,
  hostelController.addMemberForm
);
router.get("/addHostel", middleware.isLoggedIn, hostelController.addHostelForm);
router.get("/:name/:id/updateMember", middleware.isLoggedIn, hostelController.updateMemberForm);


router.post(
  "/:name",
  middleware.isLoggedIn,
  upload.single("photo"),
  hostelController.createMember
);

router.delete(
  "/:name/:id",
  middleware.isLoggedIn,
  hostelController.deleteMember
);
router.patch(
  "/:name/:id",
  middleware.isLoggedIn,
  upload.single("photo"),
  hostelController.updateMember
);

router.delete("/:id", middleware.isLoggedIn, hostelController.deleteHostel);

router.post(
  "/",
  middleware.isLoggedIn,
  upload.single("pic"),
  hostelController.createHostel
);
router.get("/:name/updateHostel",middleware.isLoggedIn,hostelController.updateHostelForm);
router.get("/:name", hostelController.getHostel);
router.patch("/:name",upload.single("pic"), hostelController.updateHostel);
router.delete(
  "/:name/deleteAll/members",
  middleware.isLoggedIn,
  hostelController.deleteHostelMembers
);

module.exports = router;
