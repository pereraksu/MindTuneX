const express = require("express");
const {
  predictMood,
  quickMoodCheckIn,
  saveMoodEntry,
  getMyMoodEntries,
} = require("../controllers/moodController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔒 Apply auth middleware globally
router.use(protect);

// 🧠 AI prediction only
router.post("/predict", predictMood);

// ⚡ Quick mood check-in
router.post("/", quickMoodCheckIn);

// ✍️ Journal entry + AI analysis
router.post("/journal", saveMoodEntry);

// 📖 Get logged-in user's mood history
router.get("/", getMyMoodEntries);

module.exports = router;