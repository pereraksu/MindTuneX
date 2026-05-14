const express = require("express");

const {
  getWeeklyInsights,
} = require("../controllers/insightController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();
// Protected Insight Routes
router.use(protect);

// Generate user weekly emotional insights
// Weekly AI Insights
router.get("/weekly", getWeeklyInsights);

// Health Check
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Insight service is operational",
    timestamp: new Date(),
  });
});

module.exports = router;