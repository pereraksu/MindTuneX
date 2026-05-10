const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sender: {
      type: String,
      enum: ["user", "bot"],
      required: true,
      lowercase: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 5000,
    },

    detectedEmotion: {
      type: String,
      default: "neutral",
      trim: true,
      lowercase: true,
      index: true,
    },

    sentimentLabel: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: "neutral",
      lowercase: true,
      index: true,
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
    },

    recommendations: {
      type: [String],
      default: [],
    },

    aiModelVersion: {
      type: String,
      default: "MindTuneX-v1",
    },

    responseTimeMs: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

chatMessageSchema.index({ user: 1, createdAt: -1 });
chatMessageSchema.index({ user: 1, sentimentLabel: 1 });
chatMessageSchema.index({ user: 1, detectedEmotion: 1 });

chatMessageSchema.virtual("isHighRisk").get(function () {
  return this.riskScore >= 75;
});

chatMessageSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports =
  mongoose.models.ChatMessage ||
  mongoose.model("ChatMessage", chatMessageSchema);