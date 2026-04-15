const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔥 faster queries
    },

    reportType: {
      type: String,
      enum: ["weekly", "monthly", "custom"],
      default: "weekly",
      lowercase: true,
      index: true,
    },

    title: {
      type: String,
      default: "Mood Report",
      trim: true,
      maxlength: 150,
    },

    fileUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // 🔥 Report period
    generatedForStart: {
      type: Date,
      default: null,
    },

    generatedForEnd: {
      type: Date,
      default: null,
    },

    // 🔥 NEW: snapshot data (VERY IMPORTANT for FYP)
    summary: {
      totalEntries: { type: Number, default: 0 },
      avgSentiment: { type: Number, default: 0 },
      topEmotion: { type: String, default: "neutral" },
    },

    // 🔥 NEW: status tracking
    status: {
      type: String,
      enum: ["pending", "generated", "failed"],
      default: "generated",
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Useful indexes
reportSchema.index({ user: 1, createdAt: -1 });
reportSchema.index({ user: 1, reportType: 1 });

module.exports = mongoose.model("Report", reportSchema);