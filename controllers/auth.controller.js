const User = require("../models/user");
const passport = require("passport");
exports.getLoginPage = (req, res) => {
  return res.render("login");
};

exports.getSignupPage = (req, res) => {
  return res.render("signup");
};

exports.postSignup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      req.flash("error", "User already exists!");
      return res.redirect("/admin/signup");
    }

    const newUser = new User({ username });
    const user = await User.register(newUser, password);

    if (!user) {
      req.flash("error", "Signup Failed!");
      return res.redirect("/admin/signup");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to HAB Portal!");
      return res.redirect("/admin");
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Logged out successfully!");
  return res.redirect("/admin/login");
};
