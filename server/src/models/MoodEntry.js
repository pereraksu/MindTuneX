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

const topPredictionSchema = new mongoose.Schema(
  {
    emotion: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ALLOWED_EMOTIONS,
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
      enum: ALLOWED_EMOTIONS,
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
      lowercase: true,
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

    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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
      lowercase: true,
    },

    explanationKeywords: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return value.length <= 20;
        },
        message: "Maximum 20 explanation keywords allowed",
      },
    },

    top3Predictions: {
      type: [topPredictionSchema],
      default: [],
      validate: {
        validator(value) {
          return value.length <= 3;
        },
        message: "top3Predictions cannot contain more than 3 items",
      },
    },

    source: {
      type: String,
      enum: ["journal", "analysis", "quick_checkin", "support_page", "chatbot"],
      default: "journal",
      lowercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

moodEntrySchema.index({ user: 1, createdAt: -1 });
moodEntrySchema.index({ supportLevel: 1, createdAt: -1 });
moodEntrySchema.index({ riskScore: -1, createdAt: -1 });
moodEntrySchema.index({ user: 1, supportLevel: 1, createdAt: -1 });
moodEntrySchema.index({ user: 1, predictedEmotion: 1, createdAt: -1 });
moodEntrySchema.index({ user: 1, sentimentLabel: 1, createdAt: -1 });

moodEntrySchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("MoodEntry", moodEntrySchema);