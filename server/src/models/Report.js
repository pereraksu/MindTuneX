const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportType: {
      type: String,
      enum: ["weekly", "monthly", "custom"],
      default: "weekly",
    },
    title: {
      type: String,
      default: "Mood Report",
      trim: true,
    },
    fileUrl: {
      type: String,
      default: "",
      trim: true,
    },
    generatedForStart: {
      type: Date,
      default: null,
    },
    generatedForEnd: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);