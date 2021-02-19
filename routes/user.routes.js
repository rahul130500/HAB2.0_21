const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middleware");
const userController = require("../controllers/user.controller");
const noticeController = require("../controllers/notice.controller");
const formController = require("../controllers/form.controller");

router.get("/", userController.getHome);
router.get("/notices/:notice_id", noticeController.getOneNotice);
router.get("/forms/:id", formController.getOneForm);
router.get("/hostels/:name", userController.getOneHostel);

module.exports = router;
