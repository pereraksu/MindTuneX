const User = require("../models/User");
const MoodEntry = require("../models/MoodEntry");

const getAdminSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMoodEntries = await MoodEntry.countDocuments();
    const totalHighRiskEntries = await MoodEntry.countDocuments({
      supportLevel: "high",
    });

    res.json({
      message: "Admin summary fetched successfully",
      data: {
        totalUsers,
        totalMoodEntries,
        totalHighRiskEntries,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Admin summary failed", error: error.message });
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: "Users fetch failed", error: error.message });
  }
};

const getHighRiskEntries = async (req, res) => {
  try {
    const entries = await MoodEntry.find({ supportLevel: "high" })
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.json({
      message: "High risk entries fetched successfully",
      data: entries,
    });
  } catch (error) {
    res.status(500).json({ message: "High risk fetch failed", error: error.message });
  }
};

const getSupportUsers = async (req, res) => {
  try {
    const highRiskEntries = await MoodEntry.find({ supportLevel: "high" }).populate(
      "user",
      "fullName email role"
    );

    const map = new Map();

    highRiskEntries.forEach((entry) => {
      if (entry.user) {
        map.set(String(entry.user._id), entry.user);
      }
    });

    res.json({
      message: "Support users fetched successfully",
      data: Array.from(map.values()),
    });
  } catch (error) {
    res.status(500).json({ message: "Support users fetch failed", error: error.message });
  }
};

module.exports = {
  getAdminSummary,
  getAdminUsers,
  getHighRiskEntries,
  getSupportUsers,
};