const express = require("express");
const router = express.Router({ mergeParams: true });
const { isAdmin, isLoggedIn } = require("../middleware");

const aboutController = require("../controllers/about.controller");

router.get("/", isLoggedIn, isAdmin, aboutController.getAboutInfo);

router.get(
  "/addAboutInfo",
  isLoggedIn,
  isAdmin,
  aboutController.addAboutForm
);

router.delete("/:id", isLoggedIn, isAdmin, aboutController.deleteAboutInfo);

router.post(
  "/",
  isLoggedIn,
  isAdmin,
  aboutController.createAboutInfo
);

router.get(
  "/:id/updateAboutInfo",
  isLoggedIn,
  isAdmin,
  aboutController.updateAboutForm
);

router.patch(
  "/:id",
  aboutController.updateAboutInfo
);

router.delete(
  "/delete/allInfo",
  isLoggedIn,
  isAdmin,
  aboutController.deleteAllInfo
);

module.exports = router;
