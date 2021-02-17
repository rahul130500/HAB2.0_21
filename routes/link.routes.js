const express = require("express");
const router = express.Router({ mergeParams: true });
const linkController = require("../controllers/link.controller");
const { isLoggedIn, isAdmin } = require("../middleware");

router.get("/", isLoggedIn, isAdmin, linkController.getAllLinks);
router.get("/add", isLoggedIn, isAdmin, linkController.addLinkForm);
router.post("/", isLoggedIn, isAdmin, linkController.postLink);
router.get("/:link_id", isLoggedIn, isAdmin, linkController.getEditForm);
router.put("/:link_id", isLoggedIn, isAdmin, linkController.editLink);
router.delete("/:link_id", isLoggedIn, isAdmin, linkController.deleteLink);

router.get(
  "/:link_id/sublinks",
  isLoggedIn,
  isAdmin,
  linkController.getAllSublinks
);
router.get(
  "/:link_id/sublinks/add",
  isLoggedIn,
  isAdmin,
  linkController.addSublinkForm
);
router.post(
  "/:link_id/sublinks",
  isLoggedIn,
  isAdmin,
  linkController.postSublink
);
router.get(
  "/:link_id/sublinks/:sublink_id",
  isLoggedIn,
  isAdmin,
  linkController.getSublinkEditForm
);
router.put(
  "/:link_id/sublinks/:sublink_id",
  isLoggedIn,
  isAdmin,
  linkController.editSublink
);
router.delete(
  "/:link_id/sublinks/:sublink_id",
  isLoggedIn,
  isAdmin,
  linkController.deleteSublink
);

module.exports = router;
