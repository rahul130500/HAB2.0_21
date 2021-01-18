const express = require("express");
const router = express.Router();
const Notice = require("../models/notice");

router.get("/", async (req, res) => {
  //console.log(res.locals.currentUser);
  const notices = await Notice.find({});
  notices.sort(compare);
  res.render("home", { notices });
});

const compare = (a, b) => {
  return b.creation - a.creation;
};

module.exports = router;
