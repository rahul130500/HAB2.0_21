const express = require("express");

const { isAdmin, isLoggedIn } = require("../middleware/adminauth");
const multer = require("multer");
const fs = require("fs");
const hostelController = require("../controllers/hostelprofile.controllers");

//image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/details_img");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
}).single("image");

const router = express.Router();
router.get("/", isAdmin, isLoggedIn, (req, res) => {
  res.redirect("/hab/admin");
});

router.get("/about/add", isLoggedIn, isAdmin, (req, res) => {
  res.render("hostelAdmin/about/add");
});

router.post(
  "/about/add",
  isLoggedIn,
  isAdmin,
  hostelController.addAboutDetails
);

router.get("/about", isLoggedIn, isAdmin, hostelController.getAboutDetails);

//Get details from database
router.get("/hmc", hostelController.getDetails);

//Add user to database
router.post("/hmc/add", upload, (req, res) => {
  const detail = new hmcDetail({
    name: req.body.name,
    post: req.body.post,
    image: req.file.filename,
    contno: req.body.contno,
    roomno: req.body.roomno,
    email: req.body.email,
    priono: req.body.priono,
  });
  detail.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      res.redirect("/hab/admin/hostel/:hostelName/hmc");
    }
  });
});

router.get("/hmc/add", (req, res) => {
  res.render("hostelAdmin/hmc/add");
});

//Get details for editing
router.get("hmc/:id", hostelController.getEditDetails);

//Editing the user
router.post("hmc/:id", upload, (req, res) => {
  const id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/details_img" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  hmcDetail.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      post: req.body.post,
      image: new_image,
      contno: req.body.contno,
      roomno: req.body.roomno,
      email: req.body.email,
      priono: req.body.priono,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.redirect("/hab/admin/hostel/:hostelName/hmc");
      }
    }
  );
});

//Delete entry from database
router.get("/hmc/delete/:id", hostelController.deleteDetails);

router.get("/personal/add", (req, res) => {
  res.render("hostelAdmin/personalweb/add");
});

router.get("/personal", hostelController.getWeb);

router.get("/personal/:id", hostelController.getEditWeb);

router.post("/personal/:id", upload, (req, res) => {
  const id = req.params.id;

  personalweb.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      link: req.body.link,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.redirect("/hab/admin/hostel/:hostelName/personalweb");
      }
    }
  );
});

module.exports = router;
