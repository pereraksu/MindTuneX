const mongoose = require("mongoose");

const weeklyInsightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weekStartDate: {
      type: Date,
      required: true,
    },
    weekEndDate: {
      type: Date,
      required: true,
    },
    totalEntries: {
      type: Number,
      default: 0,
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
    },
    emotionCounts: {
      type: Object,
      default: {},
    },
    summaryText: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WeeklyInsight", weeklyInsightSchema);