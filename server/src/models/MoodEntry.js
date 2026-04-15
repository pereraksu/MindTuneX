const mongoose = require("mongoose");

const topPredictionSchema = new mongoose.Schema(
  {
    emotion: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
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
      index: true,
    },

    inputText: {
      type: String,
      required: [true, "Input text is required"],
      trim: true,
      maxlength: 5000,
    },

    cleanText: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    predictedEmotion: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
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
      lowercase: true,
      index: true,
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
      lowercase: true,
      index: true,
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
      validate: {
        validator: function (value) {
          return value.length <= 3;
        },
        message: "top3Predictions cannot contain more than 3 items",
      },
    },

    source: {
      type: String,
      enum: ["journal", "analysis", "quick_checkin", "support_page"],
      default: "journal",
      lowercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Useful compound indexes for analytics/admin queries
moodEntrySchema.index({ user: 1, createdAt: -1 });
moodEntrySchema.index({ supportLevel: 1, createdAt: -1 });
moodEntrySchema.index({ user: 1, supportLevel: 1, createdAt: -1 });

module.exports = mongoose.model("MoodEntry", moodEntrySchema);