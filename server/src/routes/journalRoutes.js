const express = require("express");
const {
  createJournalEntry,
  getMyJournalEntries,
} = require("../controllers/journalController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createJournalEntry);
router.get("/", protect, getMyJournalEntries);

module.exports = router;