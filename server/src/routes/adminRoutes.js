const express = require("express");
const {
  getAdminSummary,
  getAdminUsers,
  getHighRiskEntries,
  getSupportUsers,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/summary", protect, adminOnly, getAdminSummary);
router.get("/users", protect, adminOnly, getAdminUsers);
router.get("/high-risk", protect, adminOnly, getHighRiskEntries);
router.get("/support-users", protect, adminOnly, getSupportUsers);

module.exports = router;