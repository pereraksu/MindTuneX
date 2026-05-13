const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../models/User");
const MoodEntry = require("../models/MoodEntry");

const AI_BASE_URL = process.env.AI_BASE_URL || "http://127.0.0.1:8000";

const sendError = (res, message, error) => {
  console.error(message, error.message);

  return res.status(500).json({
    success: false,
    message,
    error: error.message,
  });
};

// ADMIN SUMMARY

const getAdminSummary = async (req, res) => {
  try {
    const [totalUsers, totalMoodEntries, totalHighRiskEntries] =
      await Promise.all([
        User.countDocuments(),
        MoodEntry.countDocuments(),
        MoodEntry.countDocuments({
          $or: [
            { supportLevel: "high" },
            { riskScore: { $gte: 75 } },
          ],
        }),
      ]);

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
    return sendError(res, "Admin summary failed", error);
  }
};

// ADMIN USERS

const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const stats = await MoodEntry.aggregate([
      { $sort: { createdAt: -1 } },

      {
        $group: {
          _id: "$user",

          moodCount: { $sum: 1 },

          highSupportCount: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$supportLevel", "high"] },
                    { $gte: ["$riskScore", 75] },
                  ],
                },
                1,
                0,
              ],
            },
          },

          negativeEntries: {
            $sum: {
              $cond: [
                { $eq: ["$sentimentLabel", "negative"] },
                1,
                0,
              ],
            },
          },

          latestMood: { $first: "$predictedEmotion" },
        },
      },
    ]);

    const statsMap = new Map(
      stats.map((s) => [String(s._id), s])
    );

    const enrichedUsers = users.map((user) => {
      const userStats = statsMap.get(String(user._id));

      return {
        ...user,
        moodCount: userStats?.moodCount || 0,
        highSupportCount: userStats?.highSupportCount || 0,
        negativeEntries: userStats?.negativeEntries || 0,
        latestMood: userStats?.latestMood || "N/A",
      };
    });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: enrichedUsers,
    });
  } catch (error) {
    return sendError(res, "Users fetch failed", error);
  }
};

// HIGH RISK ENTRIES

const getHighRiskEntries = async (req, res) => {
  try {
    const entries = await MoodEntry.find({
      reviewed: { $ne: true },

      $or: [
        { supportLevel: "high" },
        { riskScore: { $gte: 75 } },
      ],
    })
      .populate("user", "fullName email role")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "High risk entries fetched successfully",
      data: entries,
    });
  } catch (error) {
    return sendError(res, "High risk fetch failed", error);
  }
};

// SUPPORT USERS

const getSupportUsers = async (req, res) => {
  try {
    const supportStats = await MoodEntry.aggregate([
      {
        $group: {
          _id: "$user",

          totalEntries: { $sum: 1 },

          highSupportEntries: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$supportLevel", "high"] },
                    { $gte: ["$riskScore", 75] },
                  ],
                },
                1,
                0,
              ],
            },
          },

          negativeEntries: {
            $sum: {
              $cond: [
                { $eq: ["$sentimentLabel", "negative"] },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $match: {
          $or: [
            { highSupportEntries: { $gt: 0 } },
            { negativeEntries: { $gt: 0 } },
          ],
        },
      },

      {
        $sort: {
          highSupportEntries: -1,
          negativeEntries: -1,
        },
      },
    ]);

    const userIds = supportStats
      .map((s) => s._id)
      .filter(Boolean);

    const users = await User.find({
      _id: { $in: userIds },
    })
      .select("-password")
      .lean();

    const userMap = new Map(
      users.map((u) => [String(u._id), u])
    );

    const supportUsers = supportStats
      .map((stats) => {
        const user = userMap.get(String(stats._id));

        if (!user) return null;

        return {
          ...user,
          totalEntries: stats.totalEntries,
          highSupportEntries: stats.highSupportEntries,
          negativeEntries: stats.negativeEntries,
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      message: "Support users fetched successfully",
      data: supportUsers,
    });
  } catch (error) {
    return sendError(res, "Support users fetch failed", error);
  }
};

// SYSTEM STATUS

const getSystemStatus = async (req, res) => {
  try {
    const last24Hours = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    );

    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: last24Hours },
      isActive: true,
    });

    const database =
      mongoose.connection.readyState === 1
        ? "Healthy"
        : "Disconnected";

    let aiModelApi = "Disconnected";

    try {
      await axios.get(`${AI_BASE_URL}/docs`, {
        timeout: 5000,
      });

      aiModelApi = "Connected";
    } catch (error) {
      console.error(
        "AI health check failed:",
        error.message
      );

      aiModelApi = "Disconnected";
    }

    return res.status(200).json({
      success: true,
      message: "System status fetched successfully",

      data: {
        serverStatus: "Operational",
        aiModelApi,
        activeUsers,
        database,
      },
    });
  } catch (error) {
    return sendError(
      res,
      "System status fetch failed",
      error
    );
  }
};

// CHATBOT STATS

const getChatbotStats = async (req, res) => {
  try {
    const totalChats = await MoodEntry.countDocuments();

    const stats = await MoodEntry.aggregate([
      {
        $facet: {
          topEmotionAgg: [
            {
              $match: {
                predictedEmotion: {
                  $exists: true,
                  $ne: null,
                },
              },
            },

            {
              $group: {
                _id: "$predictedEmotion",
                count: { $sum: 1 },
              },
            },

            { $sort: { count: -1 } },

            { $limit: 1 },
          ],

          sentimentAgg: [
            {
              $match: {
                sentimentLabel: {
                  $exists: true,
                  $ne: null,
                },
              },
            },

            {
              $group: {
                _id: "$sentimentLabel",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const result = stats[0] || {};

    const topEmotion =
      result.topEmotionAgg?.[0]?._id || "N/A";

    let positive = 0;
    let negative = 0;
    let neutral = 0;
    let total = 0;

    (result.sentimentAgg || []).forEach((item) => {
      const label = String(item._id || "").toLowerCase();

      total += item.count;

      if (label === "positive") {
        positive += item.count;
      } else if (label === "negative") {
        negative += item.count;
      } else {
        neutral += item.count;
      }
    });

    let avgSentiment = "Neutral";

    if (total > 0) {
      const positiveRatio = positive / total;
      const negativeRatio = negative / total;

      if (
        positiveRatio > negativeRatio &&
        positiveRatio >= 0.4
      ) {
        avgSentiment = `Positive (${Math.round(
          positiveRatio * 100
        )}%)`;
      } else if (
        negativeRatio > positiveRatio &&
        negativeRatio >= 0.4
      ) {
        avgSentiment = `Negative (${Math.round(
          negativeRatio * 100
        )}%)`;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Chatbot stats fetched successfully",

      data: {
        totalChats,
        avgSentiment,
        topEmotion,

        sentimentBreakdown: {
          positive,
          negative,
          neutral,
        },
      },
    });
  } catch (error) {
    return sendError(
      res,
      "Chatbot stats fetch failed",
      error
    );
  }
};

// MARK ALERT AS REVIEWED

const markAlertReviewed = async (req, res) => {
  try {
    const alert = await MoodEntry.findByIdAndUpdate(
      req.params.id,
      {
        reviewed: true,
        reviewedAt: new Date(),
        reviewedBy: req.user?._id,
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alert marked as reviewed",
      data: alert,
    });
  } catch (error) {
    return sendError(
      res,
      "Mark reviewed failed",
      error
    );
  }
};

// CONTACT RISK USER

const contactRiskUser = async (req, res) => {
  try {
    const alert = await MoodEntry.findById(
      req.params.id
    ).populate("user", "fullName email role");

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User contact details fetched",
      email: alert.user?.email,
      user: alert.user?.fullName,
    });
  } catch (error) {
    return sendError(
      res,
      "Contact user failed",
      error
    );
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (String(req.user._id) === String(userId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await MoodEntry.deleteMany({ user: userId });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    return sendError(res, "Delete user failed", error);
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "user"].includes(String(role).toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be admin or user",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: String(role).toLowerCase() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return sendError(res, "Update user role failed", error);
  }
};

module.exports = {
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
};