const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const middleware = require("../middleware");
const User = require("../models/user");
const authController = require("../controllers/auth.controller");

router.get("/login", authController.getLoginPage);

router.get("/", middleware.isLoggedIn, async (req, res) => {
  res.render("admin");
});

router.get("/signup", authController.getSignupPage);

router.post("/signup", authController.postSignup);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/admin/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome to HAB Portal!");
    return res.redirect("/admin");
  }
);

router.get("/logout", authController.logout);

router.get("/profile", middleware.isLoggedIn, async (req, res) => {
  res.render("profile");
});

router.post("/profile", middleware.isLoggedIn, async (req, res) => {
  const { name, contact } = req.body;
  const id = req.user.id;
  const user = await User.findByIdAndUpdate(id, { name, contact });
  res.redirect("admin/profile");
});

module.exports = router;
