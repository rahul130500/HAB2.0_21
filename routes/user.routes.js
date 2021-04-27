const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middleware");
const userController = require("../controllers/user.controller");
const noticeController = require("../controllers/notice.controller");
const ordinanceController = require("../controllers/ordinance.controller");
const formController = require("../controllers/form.controller");

router.get("/", userController.getHome);
router.get("/notices/:notice_id", noticeController.getOneNotice);
router.get("/ordinances/:ordinance_id", ordinanceController.getOneOrdinance);
router.get("/forms/:id", formController.getOneForm);
router.get("/hostels/:hostel_id", userController.getOneHostel);

module.exports = router;
