const mongoose = require("mongoose");

const topPredictionSchema = new mongoose.Schema(
  {
    emotion: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const moodEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    inputText: {
      type: String,
      required: [true, "Input text is required"],
      trim: true,
    },
    cleanText: {
      type: String,
      default: "",
      trim: true,
    },
    predictedEmotion: {
      type: String,
      required: true,
      trim: true,
    },
    rawPrediction: {
      type: String,
      default: "",
      trim: true,
    },
    confidence: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    confidenceLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    sentimentScore: {
      type: Number,
      default: 0,
      min: -1,
      max: 1,
    },
    sentimentLabel: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: "neutral",
    },
    recommendationType: {
      type: String,
      default: "general_reflection_content",
      trim: true,
    },
    supportLevel: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "moderate",
    },
    triggerCategory: {
      type: String,
      enum: [
        "work_study",
        "family_relationship",
        "health_energy",
        "daily_life",
        "general",
      ],
      default: "general",
    },
    explanationKeywords: {
      type: [String],
      default: [],
    },
    top3Predictions: {
      type: [topPredictionSchema],
      default: [],
    },
    source: {
      type: String,
      enum: ["journal", "quick_test", "support_page"],
      default: "journal",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MoodEntry", moodEntrySchema);