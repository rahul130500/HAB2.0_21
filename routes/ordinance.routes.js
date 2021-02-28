const express = require("express");
const router = express.Router({ mergeParams: true });
const { isAdmin, isLoggedIn } = require("../middleware");

const ordinanceController = require("../controllers/ordinance.controller");

router.get("/", isLoggedIn, isAdmin, ordinanceController.getOrdinance);

router.put(
  "/:ordinance_id",
  isLoggedIn,
  isAdmin,
  ordinanceController.editOrdinance
);

module.exports = router;
