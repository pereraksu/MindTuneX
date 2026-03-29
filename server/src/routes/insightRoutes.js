const express = require("express");
const { getWeeklyInsights } = require("../controllers/insightController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/weekly", protect, getWeeklyInsights);

module.exports = router;