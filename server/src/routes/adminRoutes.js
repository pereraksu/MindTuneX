const express = require("express");

const {
  getAdminSummary,
  getAdminUsers,
  getHighRiskEntries,
  getSupportUsers,
  getSystemStatus,
  getChatbotStats,
  markAlertReviewed,
  contactRiskUser,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(protect);
router.use(adminOnly);

// Dashboard Analytics
router.get("/summary", getAdminSummary);
router.get("/system-status", getSystemStatus);
router.get("/chatbot-stats", getChatbotStats);

// User Management
router.get("/users", getAdminUsers);
router.get("/support-users", getSupportUsers);

// Risk Monitoring
router.get("/high-risk", getHighRiskEntries);

// ✅ Mark Alert As Reviewed
router.patch("/alerts/:id/review", markAlertReviewed);

// 📩 Contact Risk User
router.post("/alerts/:id/contact", contactRiskUser);

// Health Check
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin routes operational",
    admin: req.user?.email || "Unknown",
    timestamp: new Date(),
  });
});

module.exports = router;