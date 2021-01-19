const express = require("express");
const router = express.Router();
const Notice = require("../models/notice");

router.get("/", async (req, res) => {
  //console.log(res.locals.currentUser);
  let notices = await Notice.find({});
  notices.sort(compare);
  for (let i = 0; i < notices.length; i++) {
    notices[i].creation = notices[i].creation.toString().split(" ");
  }
  res.render("home", { notices });
});

const compare = (a, b) => {
  return b.creation - a.creation;
};

module.exports = router;
