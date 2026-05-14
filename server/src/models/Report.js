const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    // User Reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Report Type
    reportType: {
      type: String,
      enum: ["weekly", "monthly", "custom"],
      default: "weekly",
      lowercase: true,
      index: true,
    },

    // Report Title
    title: {
      type: String,
      default: "Mood Report",
      trim: true,
      maxlength: 150,
    },

    // PDF / File URL
    fileUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // Report Time Period
    generatedForStart: {
      type: Date,
      default: null,
    },

    generatedForEnd: {
      type: Date,
      default: null,
    },
    // Analytics Snapshot
    summary: {
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
        default: "neutral",
        lowercase: true,
      },

      positiveCount: {
        type: Number,
        default: 0,
      },

      negativeCount: {
        type: Number,
        default: 0,
      },

      neutralCount: {
        type: Number,
        default: 0,
      },

      highRiskCount: {
        type: Number,
        default: 0,
      },

      trend: {
        type: String,
        enum: ["improving", "declining", "stable"],
        default: "stable",
      },

      summaryText: {
        type: String,
        default: "",
        maxlength: 1200,
      },
    },

    // Report Generation Status
    status: {
      type: String,
      enum: ["pending", "generated", "failed"],
      default: "generated",
      lowercase: true,
      index: true,
    },

    // Metadata
    generatedBy: {
      type: String,
      default: "MindTuneX AI Engine",
      trim: true,
    },

    version: {
      type: String,
      default: "v1.0",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reportSchema.index({ user: 1, createdAt: -1 });

reportSchema.index({
  user: 1,
  reportType: 1,
  createdAt: -1,
});

reportSchema.index({
  status: 1,
  createdAt: -1,
});
// Clean JSON Response
reportSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Report", reportSchema);