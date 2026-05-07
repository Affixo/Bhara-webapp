const express = require("express");
const router = express.Router();
const {
  startConversation,
  getMyConversations,
  getConversation,
  sendMessage,
  getUnreadCount,
} = require("../controllers/conversationController");
const { protect } = require("../middleware/auth");

router.use(protect); // all conversation routes require login

router.get("/unread-count", getUnreadCount);
router.get("/", getMyConversations);
router.post("/", startConversation);
router.get("/:id", getConversation);
router.post("/:id/messages", sendMessage);

module.exports = router;
