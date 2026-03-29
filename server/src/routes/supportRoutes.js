const express = require("express");
const { getSupportResponse } = require("../controllers/supportController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, getSupportResponse);

module.exports = router;