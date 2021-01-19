const express = require("express");
const fs = require("fs");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const middleware = require("../middleware");
const User = require("../models/user");
const Notice = require("../models/notice");
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

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/admin", middleware.isLoggedIn, async (req, res) => {
  //console.log(res.locals.currentUser);
  const notices = await Notice.find({});
  notices.sort(compare);
  res.render("admin", { notices });
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
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
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/notice", middleware.isLoggedIn, (req, res) => {
  res.render("notice_add");
});

router.post(
  "/notice",
  middleware.isLoggedIn,
  upload.single("notice"),
  async (req, res) => {
    const { title, description } = req.body;
    const path = req.file.filename;

    const newNotice = new Notice({ title, description, path });
    await newNotice.save();

    res.redirect("/admin");
  }
);

router.get("/notice/:id", async (req, res) => {
  const id = req.params.id;
  const notice = await Notice.findById(id);
  const filePath = "uploads/" + notice.path;
  console.log(filePath);
  fs.readFile(filePath, (err, data) => {
    res.contentType("application/pdf");
    res.send(data);
  });
});

router.delete("/notice/:id", middleware.isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;
    const notice = await Notice.findById(id);
    fs.unlinkSync(`uploads/${notice.path}`);
    console.log("successfully deleted /tmp/hello");
    await Notice.findByIdAndRemove(id);
    res.redirect("/admin");
  } catch (err) {
    // handle the error
    console.log(err);
    res.redirect("/admin");
  }
});

const compare = (a, b) => {
  return b.creation - a.creation;
};

module.exports = router;
