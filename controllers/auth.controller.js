const User = require("../models/user");
const passport = require("passport");
const Hostel = require("../models/hostel");

exports.getLoginPage = (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/hab/admin");
  // return res.render("login");
  return res.redirect("/auth/azureadoauth2");
};

exports.getSignupPage = (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/hab/admin");
  return res.render("signup");
};

exports.postSignup = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      req.flash("error", "User already exists!");
      return res.redirect("/hab/admin/signup");
    }

    if (!username.includes("@iitg.ac.in")) {
      req.flash("error", "Invalid Email!");
      return res.redirect("/hab/admin/signup");
    }

    const newUser = new User({ username, name });
    const users = await User.find({});
    if (users.length == 0) {
      newUser.isAdmin = true;
    }

    const user = await User.register(newUser, password);

    if (!user) {
      req.flash("error", "Signup Failed!");
      return res.redirect("/hab/admin/signup");
    }
    passport.authenticate("azure_ad_oauth2")(req, res, () => {
      req.flash("success", "Welcome to HAB Portal!");
      return res.redirect("/hab/admin");
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Logged out successfully!");
  return res.redirect("/hab/");
};

exports.getUsers = async (req, res) => {
  const users = await User.find({});
  return res.render("users/index", { users });
};

exports.changeAdmin = async (req, res) => {
  try {
    const id = req.params.user_id;
    const user = await User.findById(id);
    if (!user) {
      req.flash("error", "User doesn't exist!");
      return res.redirect("/hab/admin/users");
    }
    user.isAdmin = !user.isAdmin;
    await user.save();
    req.flash("success", "Admin status changed!");
    return res.redirect("/hab/admin/users");
  } catch (error) {
    console.log(error.message);
    return res.redirect("/hab/admin");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.user_id;
    await User.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted user");
    res.redirect("/hab/admin/users");
  } catch (error) {
    console.log(error.message);
    return res.redirect("/hab/admin");
  }
};

exports.getEditUser = async (req, res) => {
  try {
    const id = req.params.user_id;
    const user = await User.findById(id);
    const hostels = await Hostel.find({});
    return res.render("users/edit", { user, hostels });
  } catch (error) {
    console.log(error.message);
    return res.redirect("/hab/admin");
  }
};

exports.editUser = async (req, res) => {
  try {
    // console.log(req.body);
    const { hostel } = req.body;
    let isAdmin = req.body.isAdmin;
    if (!req.body.isAdmin) {
      isAdmin = false;
      // console.log("isadmin");
    }
    let isHostelAdmin = req.body.isHostelAdmin;
    if (!req.body.isHostelAdmin) {
      isHostelAdmin = false;
      // console.log("ishosteladmin");
    }
    // console.log("final");
    // console.log(name, email, isAdmin, isHostelAdmin, hostel);
    await User.findByIdAndUpdate(req.params.user_id, {
      isAdmin,
      isHostelAdmin,
      hostel,
    });
    req.flash("success", "User Updated Successfully");
    res.redirect("/hab/admin/users");
  } catch (error) {
    console.log(error.message);
    res.redirect("/hab/admin");
  }
};
