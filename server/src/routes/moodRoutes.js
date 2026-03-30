const express = require("express");
const {
  predictMood,
  saveMoodEntry,
  getMyMoodEntries,
  quickMoodCheckIn, // අලුත් එක මෙතනට Import කරගන්න
} = require("../controllers/moodController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// 1. AI එකෙන් විතරක් අඳුරගන්න (Prediction only)
router.post("/predict", protect, predictMood);

// 2. Dashboard එකේ Emoji Buttons සඳහා (Quick Check-in)
// සටහන: අපි මෙතනට 'quickMoodCheckIn' එක දුන්නා
router.post("/", protect, quickMoodCheckIn);

// 3. Journal එකේ ලියන දේවල් සේව් කරන්න (අවශ්‍ය නම් වෙනම route එකක්)
router.post("/journal", protect, saveMoodEntry);

// 4. කලින් සේව් කරපු ඔක්කොම Moods ටික ලබාගන්න
router.get("/", protect, getMyMoodEntries);

module.exports = router;