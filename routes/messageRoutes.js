const express = require("express");
const messageController = require("../controllers/messageController");
const verifyToken = require("../middleware");
const router = express.Router();
router.use(verifyToken);

router.post("/chat", messageController.postMessages);
router.get("/", messageController.getUsersList);
router.get("/messages", messageController.getMessageList);
module.exports = router;
