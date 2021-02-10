var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/admin/login");
};

module.exports = middlewareObj;
