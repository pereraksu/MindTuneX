const express = require("express");

const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Authentication Routes

// 📝 Register New User
router.post("/register", registerUser);

// 🔑 Login Existing User
router.post("/login", loginUser);

// Protected Routes

// 👤 Get Current Logged User
router.get("/me", protect, getMe);

// Auth Health Check
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authentication service is running",
    timestamp: new Date(),
  });
});

module.exports = router;