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

const upload = multer({ storage: storage });

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/admin", middleware.isLoggedIn, async (req, res) => {
  res.render("admin");
});

router.get("/notice", middleware.isLoggedIn, async (req, res) => {
  const notices = await Notice.find({});
  notices.sort(compare);
  res.render("notice", { notices });
});

router.get("/announcement", middleware.isLoggedIn, async (req, res) => {
  const announcements = await Announcement.find({});
  announcements.sort(compare);
  res.render("announcement", { announcements });
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

router.get("/notice/add", middleware.isLoggedIn, (req, res) => {
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

    res.redirect("/notice");
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
    res.redirect("/notice");
  } catch (err) {
    // handle the error
    console.log(err);
    res.redirect("/notice");
  }
});

router.get("/announcement/add", middleware.isLoggedIn, (req, res) => {
  res.render("announcement_add");
});

router.post(
  "/announcement",
  middleware.isLoggedIn,
  upload.single("announcement"),
  async (req, res) => {
    const { description } = req.body;
    if (typeof req.file !== "undefined") {
      const path = req.file.filename;
      const newAnnouncement = new Announcement({ description, path });
      await newAnnouncement.save();
    } else {
      const newAnnouncement = new Announcement({ description });
      await newAnnouncement.save();
    }

    res.redirect("/announcement");
  }
);

router.get("/announcement/:id", async (req, res) => {
  const id = req.params.id;
  const announcement = await Announcement.findById(id);

  if (typeof announcement.path !== "undefined") {
    const filePath = "uploads/" + announcement.path;
    console.log(filePath);
    fs.readFile(filePath, (err, data) => {
      res.contentType("application/pdf");
      res.send(data);
    });
  }
});

router.delete("/announcement/:id", middleware.isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;
    const announcement = await Announcement.findById(id);
    if (typeof announcement.path !== "undefined") {
      fs.unlinkSync(`uploads/${announcement.path}`);
    }
    console.log("successfully deleted /tmp/hello");
    await Announcement.findByIdAndRemove(id);
    res.redirect("/announcement");
  } catch (err) {
    // handle the error
    console.log(err);
    res.redirect("/announcement");
  }
});

router.get("/profile", middleware.isLoggedIn, async (req, res) => {
  res.render("profile");
});

router.post("/profile", middleware.isLoggedIn, async (req, res) => {
  const { name, contact } = req.body;
  const id = req.user.id;
  const user = await User.findByIdAndUpdate(id, { name, contact });
  res.redirect("/profile");
});
router.get("/hostels", (req, res) => {
  res.render("hostel");
});

const compare = (a, b) => {
  return b.creation - a.creation;
};

module.exports = router;
