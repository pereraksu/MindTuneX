const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema(
  {
    // --------------------------------------------------
    // User Reference
    // --------------------------------------------------
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // --------------------------------------------------
    // Journal Title
    // --------------------------------------------------
    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },

    // --------------------------------------------------
    // Main Journal Content
    // --------------------------------------------------
    content: {
      type: String,
      required: [true, "Journal content is required"],
      trim: true,
      minlength: 3,
      maxlength: 5000,
    },

    // --------------------------------------------------
    // Related Mood Analysis Entry
    // --------------------------------------------------
    moodEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MoodEntry",
      default: null,
    },

    // --------------------------------------------------
    // Optional Tags
    // --------------------------------------------------
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 10;
        },
        message: "Maximum 10 tags allowed",
      },
    },

    // --------------------------------------------------
    // Analysis Status
    // --------------------------------------------------
    isAnalyzed: {
      type: Boolean,
      default: true,
      index: true,
    },

    // --------------------------------------------------
    // Privacy & Favorites
    // --------------------------------------------------
    isPrivate: {
      type: Boolean,
      default: true,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    // --------------------------------------------------
    // AI Metadata
    // --------------------------------------------------
    aiSummary: {
      type: String,
      default: "",
      maxlength: 500,
    },

    detectedEmotion: {
      type: String,
      default: "neutral",
      lowercase: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// --------------------------------------------------
// Full Text Search Index
// --------------------------------------------------
journalEntrySchema.index({
  title: "text",
  content: "text",
  tags: "text",
});

// --------------------------------------------------
// Compound Indexes
// --------------------------------------------------
journalEntrySchema.index({ user: 1, createdAt: -1 });
journalEntrySchema.index({ user: 1, detectedEmotion: 1 });

// --------------------------------------------------
// Virtual: Short Preview
// --------------------------------------------------
journalEntrySchema.virtual("preview").get(function () {
  return this.content.length > 120
    ? `${this.content.substring(0, 120)}...`
    : this.content;
});

// --------------------------------------------------
// Clean JSON Response
// --------------------------------------------------
journalEntrySchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model(
  "JournalEntry",
  journalEntrySchema
);