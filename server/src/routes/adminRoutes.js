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
  deleteUser,
  updateUserRole,
  getAuditLogs,
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
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Risk Monitoring
router.get("/high-risk", getHighRiskEntries);
router.patch("/alerts/:id/review", markAlertReviewed);
router.post("/alerts/:id/contact", contactRiskUser);

// Audit Logs
router.get("/audit-logs", getAuditLogs);

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