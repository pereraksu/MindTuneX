const JournalEntry = require("../models/JournalEntry");

const createJournalEntry = async (req, res) => {
  try {
    const { title, content, moodEntry, tags } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Journal content is required" });
    }

    const journal = await JournalEntry.create({
      user: req.user._id,
      title: title || "",
      content,
      moodEntry: moodEntry || null,
      tags: tags || [],
    });

    res.status(201).json({
      message: "Journal entry created successfully",
      data: journal,
    });
  } catch (error) {
    res.status(500).json({ message: "Create failed", error: error.message });
  }
};

const getMyJournalEntries = async (req, res) => {
  try {
    const journals = await JournalEntry.find({ user: req.user._id })
      .populate("moodEntry")
      .sort({ createdAt: -1 });

    res.json({
      message: "Journal entries fetched successfully",
      data: journals,
    });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed", error: error.message });
  }
};

module.exports = {
  createJournalEntry,
  getMyJournalEntries,
};