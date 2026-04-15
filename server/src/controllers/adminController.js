const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../models/User");
const MoodEntry = require("../models/MoodEntry");

// --------------------------------------------------
// 1. Admin Summary
// --------------------------------------------------
const getAdminSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMoodEntries = await MoodEntry.countDocuments();
    const totalHighRiskEntries = await MoodEntry.countDocuments({
      supportLevel: "high",
    });

    return res.status(200).json({
      success: true,
      message: "Admin summary fetched successfully",
      data: {
        totalUsers,
        totalMoodEntries,
        totalHighRiskEntries,
      },
    });
  } catch (error) {
    console.error("getAdminSummary error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Admin summary failed",
      error: error.message,
    });
  }
};

// --------------------------------------------------
// 2. Get All Users with Analytics
// --------------------------------------------------
const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    const moods = await MoodEntry.find().sort({ createdAt: -1 });

    const userStatsMap = new Map();

    moods.forEach((mood) => {
      const userId = String(mood.user);

      if (!userStatsMap.has(userId)) {
        userStatsMap.set(userId, {
          moodCount: 0,
          highSupportCount: 0,
          negativeEntries: 0,
          latestMood: null,
        });
      }

      const stats = userStatsMap.get(userId);
      stats.moodCount += 1;

      if (mood.supportLevel === "high") {
        stats.highSupportCount += 1;
      }

      if (mood.sentimentLabel === "negative") {
        stats.negativeEntries += 1;
      }

      if (!stats.latestMood) {
        stats.latestMood = mood.predictedEmotion || "neutral";
      }
    });

    const enrichedUsers = users.map((user) => {
      const stats = userStatsMap.get(String(user._id)) || {
        moodCount: 0,
        highSupportCount: 0,
        negativeEntries: 0,
        latestMood: "N/A",
      };

      return {
        ...user.toObject(),
        moodCount: stats.moodCount,
        highSupportCount: stats.highSupportCount,
        negativeEntries: stats.negativeEntries,
        latestMood: stats.latestMood,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: enrichedUsers,
    });
  } catch (error) {
    console.error("getAdminUsers error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Users fetch failed",
      error: error.message,
    });
  }
};

// --------------------------------------------------
// 3. Get High Risk Entries
// --------------------------------------------------
const getHighRiskEntries = async (req, res) => {
  try {
    const entries = await MoodEntry.find({ supportLevel: "high" })
      .populate("user", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "High risk entries fetched successfully",
      data: entries,
    });
  } catch (error) {
    console.error("getHighRiskEntries error:", error.message);
    return res.status(500).json({
      success: false,
      message: "High risk fetch failed",
      error: error.message,
    });
  }
};

// --------------------------------------------------
// 4. Get Support Users with Aggregated Stats
// --------------------------------------------------
const getSupportUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const moods = await MoodEntry.find().sort({ createdAt: -1 });

    const statsMap = new Map();

    moods.forEach((mood) => {
      const userId = String(mood.user);

      if (!statsMap.has(userId)) {
        statsMap.set(userId, {
          totalEntries: 0,
          highSupportEntries: 0,
          negativeEntries: 0,
        });
      }

      const stats = statsMap.get(userId);
      stats.totalEntries += 1;

      if (mood.supportLevel === "high") {
        stats.highSupportEntries += 1;
      }

      if (mood.sentimentLabel === "negative") {
        stats.negativeEntries += 1;
      }
    });

    const supportUsers = users
      .map((user) => {
        const stats = statsMap.get(String(user._id)) || {
          totalEntries: 0,
          highSupportEntries: 0,
          negativeEntries: 0,
        };

        return {
          ...user.toObject(),
          totalEntries: stats.totalEntries,
          highSupportEntries: stats.highSupportEntries,
          negativeEntries: stats.negativeEntries,
        };
      })
      .filter(
        (user) => user.highSupportEntries > 0 || user.negativeEntries > 0
      )
      .sort((a, b) => {
        if (b.highSupportEntries !== a.highSupportEntries) {
          return b.highSupportEntries - a.highSupportEntries;
        }
        return b.negativeEntries - a.negativeEntries;
      });

    return res.status(200).json({
      success: true,
      message: "Support users fetched successfully",
      data: supportUsers,
    });
  } catch (error) {
    console.error("getSupportUsers error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Support users fetch failed",
      error: error.message,
    });
  }
};

// --------------------------------------------------
// 5. Get Live System Status
// --------------------------------------------------
const getSystemStatus = async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: last24Hours },
      isActive: true,
    });

    const dbReadyState = mongoose.connection.readyState;
    const database = dbReadyState === 1 ? "Healthy" : "Disconnected";

    let aiModelApi = "Disconnected";

    try {
      await axios.get("http://127.0.0.1:8000/docs", {
        timeout: 3000,
      });
      aiModelApi = "Connected";
    } catch (aiError) {
      aiModelApi = "Disconnected";
    }

    const serverStatus = "Operational";

    return res.status(200).json({
      success: true,
      message: "System status fetched successfully",
      data: {
        serverStatus,
        aiModelApi,
        activeUsers,
        database,
      },
    });
  } catch (error) {
    console.error("getSystemStatus error:", error.message);
    return res.status(500).json({
      success: false,
      message: "System status fetch failed",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminSummary,
  getAdminUsers,
  getHighRiskEntries,
  getSupportUsers,
  getSystemStatus,
};