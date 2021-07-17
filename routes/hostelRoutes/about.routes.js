const express = require("express");
const aboutController = require("../../controllers/hostelControllers/about.controllers");
const { isAdmin, isLoggedIn } = require("../../middleware/adminauth");

const router = express.Router();

router.get("/add", isLoggedIn,isAdmin, (req, res) => {
	res.render("../../hostelAdmin/about/add");
});
router.post("/add", isLoggedIn,isAdmin, aboutController.addAboutDetails);

router.get("/", isLoggedIn,isAdmin, aboutController.getAboutDetails);




module.exports = router;