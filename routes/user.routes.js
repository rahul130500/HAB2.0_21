const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middleware");
const userController = require("../controllers/user.controller");
const noticeController = require("../controllers/notice.controller");
router.get("/", userController.getHome);

router.get("/notices/:notice_id", noticeController.getOneNotice);

module.exports = router;
