const express = require("express");
const {
  getAdminSummary,
  getAdminUsers,
  getHighRiskEntries,
  getSupportUsers,
  getSystemStatus, // ✅ ADD THIS
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

// 🔒 Apply middleware globally
router.use(protect);
router.use(adminOnly);

// 📊 Admin Dashboard Summary
router.get("/summary", getAdminSummary);

// 👥 All Users
router.get("/users", getAdminUsers);

// 🚨 High Risk Mood Entries
router.get("/high-risk", getHighRiskEntries);

// 🧠 Users needing support
router.get("/support-users", getSupportUsers);

// 🚀 NEW: System Status (LIVE DATA)
router.get("/system-status", getSystemStatus);

module.exports = router;