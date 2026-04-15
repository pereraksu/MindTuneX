const express = require("express");
const { getWeeklyInsights } = require("../controllers/insightController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔒 Apply auth middleware globally
router.use(protect);

// 📊 Weekly Insights
router.get("/weekly", getWeeklyInsights);

module.exports = router;