const mongoose = require("mongoose");

const supportLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔥 faster queries
    },

    moodEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MoodEntry",
      default: null,
      index: true,
    },

    detectedEmotion: {
      type: String,
      default: "neutral",
      trim: true,
      lowercase: true,
      index: true,
    },

    supportResponse: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000, // 🔒 safety
    },

    recommendations: {
      type: [String],
      default: [],
    },

    // 🔥 NEW: support level tracking
    supportLevel: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "moderate",
      lowercase: true,
      index: true,
    },

    // 🔥 NEW: user action tracking
    actionTaken: {
      type: String,
      enum: ["none", "viewed", "followed", "ignored"],
      default: "none",
      lowercase: true,
    },

    // 🔥 NEW: YouTube engagement tracking (future analytics)
    interactedPlaylist: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Useful indexes
supportLogSchema.index({ user: 1, createdAt: -1 });
supportLogSchema.index({ supportLevel: 1, createdAt: -1 });

module.exports = mongoose.model("SupportLog", supportLogSchema);