const express = require("express");
const router = express.Router({ mergeParams: true });
const linkController = require("../controllers/link.controller");

router.get("/", linkController.getAllLinks);
router.get("/add", linkController.addLinkForm);
router.post("/", linkController.postLink);
router.get("/:link_id", linkController.getEditForm);
router.put("/:link_id", linkController.editLink);
router.delete("/:link_id", linkController.deleteLink);

router.get("/:link_id/sublinks", linkController.getAllSublinks);
router.get("/:link_id/sublinks/add", linkController.addSublinkForm);
router.post("/:link_id/sublinks", linkController.postSublink);
router.get("/:link_id/sublinks/:sublink_id", linkController.getSublinkEditForm);
router.put("/:link_id/sublinks", linkController.editSublink);
router.delete("/:link_id/sublinks.:sublink_id", linkController.deleteSublink);

module.exports = router;
