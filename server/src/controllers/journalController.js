const JournalEntry = require("../models/JournalEntry");

// --------------------------------------------------
// Create Journal Entry
// --------------------------------------------------
const createJournalEntry = async (req, res) => {
  try {
    const { title, content, text, moodEntry, tags } = req.body;

    // frontend එකෙන් text එන්නත් පුළුවන්, content එන්නත් පුළුවන්
    const finalContent = content || text;

    if (!finalContent || !finalContent.trim()) {
      return res.status(400).json({
        success: false,
        message: "Journal content is required",
      });
    }

    const journal = await JournalEntry.create({
      user: req.user._id,
      title: title || "",
      content: finalContent,
      moodEntry: moodEntry || null,
      tags: Array.isArray(tags) ? tags : [],
    });

    res.status(201).json({
      success: true,
      message: "Journal entry created successfully",
      data: journal,
    });
  } catch (error) {
    console.error("createJournalEntry error:", error.message);
    res.status(500).json({
      success: false,
      message: "Create failed",
      error: error.message,
    });
  }
};

// --------------------------------------------------
// Get My Journal Entries
// --------------------------------------------------
const getMyJournalEntries = async (req, res) => {
  try {
    const journals = await JournalEntry.find({ user: req.user._id })
      .populate("moodEntry")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Journal entries fetched successfully",
      data: journals,
    });
  } catch (error) {
    console.error("getMyJournalEntries error:", error.message);
    res.status(500).json({
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