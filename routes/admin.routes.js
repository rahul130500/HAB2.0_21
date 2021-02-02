const express = require("express");
const fs = require("fs");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const middleware = require("../middleware");
const User = require("../models/user");
const Notice = require("../models/notice");
const Announcement = require("../models/announcement");
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
const authController = require("../controllers/auth.controller");
const upload = multer({ storage: storage });

router.get("/login", authController.getLoginPage);

router.get("/admin", middleware.isLoggedIn, async (req, res) => {
  res.render("admin");
});

router.get("/signup", authController.getSignupPage);

router.post("/signup", authController.postSignup);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

router.get("/logout", authController.logout);

router.get("/profile", middleware.isLoggedIn, async (req, res) => {
  res.render("profile");
});

router.post("/profile", middleware.isLoggedIn, async (req, res) => {
  const { name, contact } = req.body;
  const id = req.user.id;
  const user = await User.findByIdAndUpdate(id, { name, contact });
  res.redirect("/profile");
});




const compare = (a, b) => {
  return b.creation - a.creation;
};

module.exports = router;
