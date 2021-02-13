var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("info", "You need to login first!");
  return res.redirect("/admin/login");
};

module.exports = middlewareObj;
