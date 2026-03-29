const mongoose = require("mongoose");

const supportLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moodEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MoodEntry",
      default: null,
    },
    detectedEmotion: {
      type: String,
      default: "neutral",
      trim: true,
    },
    supportResponse: {
      type: String,
      default: "",
      trim: true,
    },
    recommendations: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportLog", supportLogSchema);