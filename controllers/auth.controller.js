const User = require("../models/user");
const passport = require("passport");
exports.getLoginPage = (req, res) => {
  res.render("login");
};

exports.getSignupPage = (req, res) => {
  res.render("signup");
};

exports.postSignup = (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("signup");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/admin");
      });
    }
  });
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/admin/login");
};
