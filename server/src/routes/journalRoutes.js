const express = require("express");

const {
  createJournalEntry,
  getMyJournalEntries,
} = require("../controllers/journalController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Journal Routes
router.use(protect);

// Journal Entry Management

// ✍️ Create New Journal Entry
router.post("/", createJournalEntry);

// 📖 Get Logged User Journal Entries
router.get("/", getMyJournalEntries);

// Health Check
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Journal service is running",
    timestamp: new Date(),
  });
});

module.exports = router;