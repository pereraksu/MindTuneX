const express = require("express");

const {
  getSupportResponse,
} = require("../controllers/supportController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// --------------------------------------------------
// Protected Support Routes
// --------------------------------------------------
router.use(protect);

// --------------------------------------------------
// AI Emotional Support
// --------------------------------------------------

// 💬 Generate emotional support response
// 🎵 Fetch YouTube playlists
// 🧠 Save support interaction log
router.post("/", getSupportResponse);

// --------------------------------------------------
// Health Check
// --------------------------------------------------
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Support service is running",
    timestamp: new Date(),
  });
});

module.exports = router;