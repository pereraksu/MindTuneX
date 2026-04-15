const express = require("express");
const { getSupportResponse } = require("../controllers/supportController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔒 Apply auth globally
router.use(protect);

// 💬 Get AI support response + recommendations + YouTube playlists
router.post("/", getSupportResponse);

module.exports = router;