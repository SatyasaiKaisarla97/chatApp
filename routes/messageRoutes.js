const express = require("express");
const messageController = require("../controllers/messageController");
const verifyToken = require("../middleware");
const router = express.Router();
router.use(verifyToken);

router.post("/groups/:groupId/chat", messageController.postGroupMessages);
router.get("/groups/:groupId/users", messageController.getGroupUsersList);
router.get("/groups/:groupId/messages", messageController.getGroupMessageList);
router.post("/groups/:groupId/invite", messageController.inviteUsersToGroup); 
router.get("/search", messageController.searchUsers); 

module.exports = router;