const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔥 faster queries (VERY IMPORTANT)
    },

    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120, // 🔒 prevent abuse
    },

    content: {
      type: String,
      required: [true, "Journal content is required"],
      trim: true,
      maxlength: 5000, // 🔒 limit size (production safety)
    },

    moodEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MoodEntry",
      default: null,
    },

    tags: {
      type: [String],
      default: [],
    },

    // 🔥 NEW (VERY USEFUL for analytics)
    isAnalyzed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Text Index (Search feature future use)
journalEntrySchema.index({ content: "text", title: "text" });

module.exports = mongoose.model("JournalEntry", journalEntrySchema);