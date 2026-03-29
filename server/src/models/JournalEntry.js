const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Journal content is required"],
      trim: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("JournalEntry", journalEntrySchema);