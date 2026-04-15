const mongoose = require("mongoose");

const weeklyInsightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    weekStartDate: {
      type: Date,
      required: true,
      index: true,
    },

    weekEndDate: {
      type: Date,
      required: true,
    },

    totalEntries: {
      type: Number,
      default: 0,
      min: 0,
    },

    avgSentiment: {
      type: Number,
      default: 0,
      min: -1,
      max: 1,
    },

    topEmotion: {
      type: String,
      default: "neutral",
      trim: true,
      lowercase: true,
    },

    // 🔥 Better structure instead of raw Object
    emotionCounts: {
      type: Map,
      of: Number,
      default: {},
    },

    summaryText: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    // 🔥 NEW: trend direction (VERY IMPORTANT)
    trend: {
      type: String,
      enum: ["improving", "declining", "stable"],
      default: "stable",
    },

    // 🔥 NEW: risk level (admin analytics)
    riskLevel: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "low",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Prevent duplicate weekly insight for same user/week
weeklyInsightSchema.index(
  { user: 1, weekStartDate: 1 },
  { unique: true }
);

module.exports = mongoose.model("WeeklyInsight", weeklyInsightSchema);