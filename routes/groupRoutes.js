const express = require("express");
const groupController = require("../controllers/groupController");
const verifyToken = require("../middleware");
const router = express.Router();
router.use(verifyToken);

router.get("/", groupController.getGroups);
router.post("/create", groupController.createGroup);

module.exports = router;
