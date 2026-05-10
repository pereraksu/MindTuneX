const mongoose = require("mongoose");

const ALLOWED_EMOTIONS = [
  "joy",
  "calm",
  "stress",
  "anxiety",
  "sadness",
  "anger",
  "fatigue",
  "love",
  "fear",
  "disgust",
  "surprise",
  "neutral",
];

const weeklyInsightSchema = new mongoose.Schema(
  {
    // --------------------------------------------------
    // User Reference
    // --------------------------------------------------
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // --------------------------------------------------
    // Week Period
    // --------------------------------------------------
    weekStartDate: {
      type: Date,
      required: true,
      index: true,
    },

    weekEndDate: {
      type: Date,
      required: true,
    },

    // --------------------------------------------------
    // Analytics Summary
    // --------------------------------------------------
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

    avgSentimentLabel: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: "neutral",
      lowercase: true,
    },

    topEmotion: {
      type: String,
      enum: ALLOWED_EMOTIONS,
      default: "neutral",
      trim: true,
      lowercase: true,
      index: true,
    },

    // --------------------------------------------------
    // Emotion Distribution
    // --------------------------------------------------
    emotionCounts: {
      type: Map,
      of: Number,
      default: {},
    },

    // --------------------------------------------------
    // Sentiment Breakdown
    // --------------------------------------------------
    positiveCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    negativeCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    neutralCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // --------------------------------------------------
    // High Risk Tracking
    // --------------------------------------------------
    highRiskCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    riskLevel: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "low",
      lowercase: true,
      index: true,
    },

    // --------------------------------------------------
    // Mood Trend
    // --------------------------------------------------
    trend: {
      type: String,
      enum: ["improving", "declining", "stable"],
      default: "stable",
      lowercase: true,
      index: true,
    },

    // --------------------------------------------------
    // AI Generated Summary
    // --------------------------------------------------
    summaryText: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1200,
    },

    // --------------------------------------------------
    // AI Metadata
    // --------------------------------------------------
    generatedBy: {
      type: String,
      default: "MindTuneX AI",
      trim: true,
    },

    modelVersion: {
      type: String,
      default: "v1.0",
    },
  },
  {
    timestamps: true,
  }
);

// --------------------------------------------------
// Prevent Duplicate Weekly Insight
// --------------------------------------------------
weeklyInsightSchema.index(
  { user: 1, weekStartDate: 1 },
  { unique: true }
);

// --------------------------------------------------
// Performance Indexes
// --------------------------------------------------
weeklyInsightSchema.index({
  user: 1,
  createdAt: -1,
});

weeklyInsightSchema.index({
  riskLevel: 1,
  createdAt: -1,
});

weeklyInsightSchema.index({
  trend: 1,
  createdAt: -1,
});

weeklyInsightSchema.index({
  topEmotion: 1,
  createdAt: -1,
});

// --------------------------------------------------
// Virtual Field
// --------------------------------------------------
weeklyInsightSchema.virtual("isHighRisk").get(function () {
  return this.riskLevel === "high";
});

// --------------------------------------------------
// Clean JSON Output
// --------------------------------------------------
weeklyInsightSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model(
  "WeeklyInsight",
  weeklyInsightSchema
);