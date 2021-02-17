exports.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("info", "You need to login first!");
  return res.redirect("/admin/login");
};

exports.isAdmin = function (req, res, next) {
  if (req.user.isAdmin) {
    return next();
  }
  req.flash("info", "You are unauthorized!");
  //req.logout();
  return res.redirect("/admin");
};
