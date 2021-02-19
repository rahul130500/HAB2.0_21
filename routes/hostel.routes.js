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

router.get("/:id1", hostelController.getHostel);

router.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.single("pic"),
  hostelController.createHostel
);

router.get(
  "/:id1/updateHostel",
  isLoggedIn,
  isAdmin,
  hostelController.updateHostelForm
);

router.patch("/:id1", upload.single("pic"), hostelController.updateHostel);

router.get(
  "/:id1/addMember",
  isLoggedIn,
  isAdmin,
  hostelController.addMemberForm
);

router.get(
  "/:id1/:id2/updateMember",
  isLoggedIn,
  isAdmin,
  hostelController.updateMemberForm
);

router.post(
  "/:id1",
  isLoggedIn,
  isAdmin,
  upload.single("photo"),
  hostelController.createMember
);

router.delete("/:id1/:id2", isLoggedIn, isAdmin, hostelController.deleteMember);
router.patch(
  "/:id1/:id2",
  isLoggedIn,
  isAdmin,
  upload.single("photo"),
  hostelController.updateMember
);

router.delete("/:id1", isLoggedIn, isAdmin, hostelController.deleteHostel);

router.delete(
  "/:id1/delete/allMembers",
  isLoggedIn,
  isAdmin,
  hostelController.deleteHostelMembers
);

module.exports = router;
