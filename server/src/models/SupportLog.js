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

const supportLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    moodEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MoodEntry",
      default: null,
      index: true,
    },

    detectedEmotion: {
      type: String,
      enum: ALLOWED_EMOTIONS,
      default: "neutral",
      trim: true,
      lowercase: true,
      index: true,
    },

    supportResponse: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    recommendations: {
      type: [String],
      default: [],
    },

    supportLevel: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "moderate",
      lowercase: true,
      index: true,
    },

    actionTaken: {
      type: String,
      enum: ["none", "viewed", "followed", "ignored"],
      default: "none",
      lowercase: true,
      index: true,
    },

    interactedPlaylist: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    clickedRecommendations: {
      type: [String],
      default: [],
    },

    responseSource: {
      type: String,
      enum: ["support_page", "chatbot", "journal", "system"],
      default: "support_page",
      lowercase: true,
      index: true,
    },

    sessionDuration: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

supportLogSchema.index({ user: 1, createdAt: -1 });
supportLogSchema.index({ supportLevel: 1, createdAt: -1 });
supportLogSchema.index({ detectedEmotion: 1, createdAt: -1 });
supportLogSchema.index({ user: 1, detectedEmotion: 1, createdAt: -1 });

supportLogSchema.virtual("hasInteraction").get(function () {
  return this.actionTaken !== "none";
});

supportLogSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const SupportLog =
  mongoose.models.SupportLog ||
  mongoose.model("SupportLog", supportLogSchema);

module.exports = SupportLog;