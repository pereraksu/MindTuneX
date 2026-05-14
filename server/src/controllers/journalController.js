const mongoose = require("mongoose");
const JournalEntry = require("../models/JournalEntry");

// Create Journal Entry
const createJournalEntry = async (req, res) => {
  try {
    const { title, content, text, moodEntry, tags } = req.body;

    const finalContent = String(content || text || "").trim();
    const finalTitle = String(title || "").trim();

    if (!finalContent) {
      return res.status(400).json({
        success: false,
        message: "Journal content is required",
      });
    }

    const cleanTags = Array.isArray(tags)
      ? tags
          .map((tag) => String(tag).trim().toLowerCase())
          .filter(Boolean)
      : [];

    const validMoodEntry =
      moodEntry && mongoose.Types.ObjectId.isValid(moodEntry)
        ? moodEntry
        : null;

    const journal = await JournalEntry.create({
      user: req.user._id,
      title: finalTitle,
      content: finalContent,
      moodEntry: validMoodEntry,
      tags: cleanTags,
    });

    return res.status(201).json({
      success: true,
      message: "Journal entry created successfully",
      data: journal,
    });
  } catch (error) {
    console.error("createJournalEntry error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Create failed",
      error: error.message,
    });
  }
};

// Get My Journal Entries
const getMyJournalEntries = async (req, res) => {
  try {
    const journals = await JournalEntry.find({ user: req.user._id })
      .populate("moodEntry")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Journal entries fetched successfully",
      data: journals,
    });
  } catch (error) {
    console.error("getMyJournalEntries error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Fetch failed",
      error: error.message,
    });
  }
};

module.exports = {
  createJournalEntry,
  getMyJournalEntries,
};