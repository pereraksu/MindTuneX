const axios = require("axios");
const MoodEntry = require("../models/MoodEntry");

// මේක තමයි අපේ Python AI Server එක Run වෙන තැන
const AI_SERVICE_URL = "http://127.0.0.1:8000/predict";

// AI එකට කතා කරන Function එක
const callAIService = async (text) => {
  const response = await axios.post(AI_SERVICE_URL, { text });
  return response.data.data;
};

const predictMood = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    // AI Model එකෙන් ප්‍රතිඵල ලබාගැනීම
    const prediction = await callAIService(text);

    res.json({
      message: "Prediction successful",
      data: prediction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Prediction failed (Is Python AI Service running?)",
      error: error.message,
    });
  }
};

const saveMoodEntry = async (req, res) => {
  try {
    const { text, source } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    // AI Model එකෙන් ප්‍රතිඵල ලබාගැනීම
    const prediction = await callAIService(text);

    // AI එකෙන් ආපු ප්‍රතිඵල Database එකේ සේව් කිරීම
    const moodEntry = await MoodEntry.create({
      user: req.user._id,
      inputText: prediction.inputText,
      cleanText: prediction.cleanText,
      predictedEmotion: prediction.predictedEmotion,
      rawPrediction: prediction.rawPrediction,
      confidence: prediction.confidence,
      confidenceLevel: prediction.confidenceLevel,
      sentimentScore: prediction.sentimentScore,
      sentimentLabel: prediction.sentimentLabel,
      recommendationType: prediction.recommendationType,
      supportLevel: prediction.supportLevel,
      triggerCategory: prediction.triggerCategory,
      explanationKeywords: prediction.explanationKeywords,
      top3Predictions: prediction.top3Predictions,
      source: source || "journal",
    });

    res.status(201).json({
      message: "Mood entry saved successfully",
      data: moodEntry,
    });
  } catch (error) {
    res.status(500).json({
      message: "Save failed",
      error: error.message,
    });
  }
};

const getMyMoodEntries = async (req, res) => {
  try {
    const moods = await MoodEntry.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      message: "Mood entries fetched successfully",
      data: moods,
    });
  } catch (error) {
    res.status(500).json({
      message: "Fetch failed",
      error: error.message,
    });
  }
};

module.exports = {
  predictMood,
  saveMoodEntry,
  getMyMoodEntries,
};