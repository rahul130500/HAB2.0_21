const express = require("express");
const fs = require("fs");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const middleware = require("../middleware");
const authController = require("../controllers/auth.controller");
const hostelController = require("../controllers/hostel.controller");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s/g, "");
    cb(null, Date.now().toString() + fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
    res.render("hostel");
  });

router.get("/:name/addMember",middleware.isLoggedIn,hostelController.addMemberForm);

router.post(
  "/:name",
  middleware.isLoggedIn,
  upload.single("photo"),
  hostelController.createMember
);

router.delete("/:name/:id",middleware.isLoggedIn,hostelController.deleteMember);



router.get("/all",middleware.isLoggedIn,hostelController.getAllHostels);

  
router.get("/:name",middleware.isLoggedIn, hostelController.getHostel);
router.delete("/:name",middleware.isLoggedIn, hostelController.deleteHostelMembers);


  module.exports=router;