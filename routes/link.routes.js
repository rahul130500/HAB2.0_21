const express = require("express");
const router = express.Router({ mergeParams: true });
const linkController = require("../controllers/link.controller");
const middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, linkController.getAllLinks);
router.get("/add", middleware.isLoggedIn, linkController.addLinkForm);
router.post("/", middleware.isLoggedIn, linkController.postLink);
router.get("/:link_id", middleware.isLoggedIn, linkController.getEditForm);
router.put("/:link_id", middleware.isLoggedIn, linkController.editLink);
router.delete("/:link_id", middleware.isLoggedIn, linkController.deleteLink);

router.get(
  "/:link_id/sublinks",
  middleware.isLoggedIn,
  linkController.getAllSublinks
);
router.get(
  "/:link_id/sublinks/add",
  middleware.isLoggedIn,
  linkController.addSublinkForm
);
router.post(
  "/:link_id/sublinks",
  middleware.isLoggedIn,
  linkController.postSublink
);
router.get(
  "/:link_id/sublinks/:sublink_id",
  middleware.isLoggedIn,
  linkController.getSublinkEditForm
);
router.put(
  "/:link_id/sublinks/:sublink_id",
  middleware.isLoggedIn,
  linkController.editSublink
);
router.delete(
  "/:link_id/sublinks/:sublink_id",
  middleware.isLoggedIn,
  linkController.deleteSublink
);

module.exports = router;
