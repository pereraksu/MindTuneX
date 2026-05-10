const express = require("express");

const {
  predictMood,
  quickMoodCheckIn,
  saveMoodEntry,
  getMyMoodEntries,
} = require("../controllers/moodController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// --------------------------------------------------
// Protected Mood Routes
// --------------------------------------------------
router.use(protect);

// --------------------------------------------------
// AI Mood Prediction
// --------------------------------------------------

// 🧠 Predict emotion only (no DB save)
router.post("/predict", predictMood);

// --------------------------------------------------
// Quick Mood Check-In
// --------------------------------------------------

// ⚡ Fast emotional check-in
router.post("/", quickMoodCheckIn);

// --------------------------------------------------
// Journal + AI Mood Analysis
// --------------------------------------------------

// ✍️ Save journal + mood analysis
router.post("/journal", saveMoodEntry);

// --------------------------------------------------
// Mood History
// --------------------------------------------------

// 📖 Get logged user's mood entries
router.get("/", getMyMoodEntries);

// --------------------------------------------------
// Health Check
// --------------------------------------------------
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Mood analysis service is operational",
    timestamp: new Date(),
  });
});

module.exports = router;