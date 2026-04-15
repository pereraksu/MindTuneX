const express = require("express");
const {
  createJournalEntry,
  getMyJournalEntries,
} = require("../controllers/journalController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔒 Apply auth globally
router.use(protect);

// ✍️ Create Journal Entry
router.post("/", createJournalEntry);

// 📖 Get My Journal Entries
router.get("/", getMyJournalEntries);

module.exports = router;