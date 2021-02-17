const express = require("express");
const fs = require("fs");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isAdmin } = require("../middleware");
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

router.get("/", isLoggedIn, isAdmin, hostelController.getAllHostels);

router.get("/addHostel", isLoggedIn, isAdmin, hostelController.addHostelForm);

router.get("/:name", hostelController.getHostel);

router.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.single("pic"),
  hostelController.createHostel
);

router.get(
  "/:name/updateHostel",
  isLoggedIn,
  isAdmin,
  hostelController.updateHostelForm
);

router.patch("/:name", upload.single("pic"), hostelController.updateHostel);

router.get(
  "/:name/addMember",
  isLoggedIn,
  isAdmin,
  hostelController.addMemberForm
);

router.get(
  "/:name/:id/updateMember",
  isLoggedIn,
  isAdmin,
  hostelController.updateMemberForm
);

router.post(
  "/:name",
  isLoggedIn,
  isAdmin,
  upload.single("photo"),
  hostelController.createMember
);

router.delete("/:name/:id", isLoggedIn, isAdmin, hostelController.deleteMember);
router.patch(
  "/:name/:id",
  isLoggedIn,
  isAdmin,
  upload.single("photo"),
  hostelController.updateMember
);

router.delete("/:id", isLoggedIn, isAdmin, hostelController.deleteHostel);

router.delete(
  "/:name/delete/allMembers",
  isLoggedIn,
  isAdmin,
  hostelController.deleteHostelMembers
);

module.exports = router;
