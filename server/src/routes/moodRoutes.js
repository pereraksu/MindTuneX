const express = require("express");
const {
  predictMood,
  saveMoodEntry,
  getMyMoodEntries,
} = require("../controllers/moodController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/predict", protect, predictMood);
router.post("/", protect, saveMoodEntry);
router.get("/", protect, getMyMoodEntries);

module.exports = router;