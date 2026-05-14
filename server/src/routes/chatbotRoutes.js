const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
  sendChatMessage,
  getChatHistory,
} = require("../controllers/chatbotController");

const router = express.Router();

// Protected Chatbot Routes
router.use(protect);

// Chat History

// 📜 Get all chat messages for logged user
router.get("/", getChatHistory);

// Send Message to AI Chatbot

// 🤖 Send user message + receive AI response
router.post("/message", sendChatMessage);

// Health Check
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Chatbot service is running",
    timestamp: new Date(),
  });
});

module.exports = router;