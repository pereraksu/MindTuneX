const axios = require("axios");
const MoodEntry = require("../models/MoodEntry");

const AI_SERVICE_URL = "http://127.0.0.1:8000/predict";

const callAIService = async (text) => {
  const response = await axios.post(AI_SERVICE_URL, { text });
  return response.data.data;
};

/**
 * --- A. AI එකෙන් Prediction එක විතරක් ලබාගැනීමට ---
 */
const predictMood = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });
    const prediction = await callAIService(text);
    res.json({ message: "Prediction successful", data: prediction });
  } catch (error) {
    res.status(500).json({ message: "Prediction failed", error: error.message });
  }
};

/**
 * --- B. Dashboard එකේ Emoji Buttons සඳහා (Quick Check-in) ---
 */
const quickMoodCheckIn = async (req, res) => {
  try {
    const { emotion, predictedEmotion, inputText, sentimentLabel, source, confidence } = req.body;
    const finalEmotion = emotion || predictedEmotion;

    if (!finalEmotion) {
      return res.status(400).json({ message: "Emotion value is required" });
    }

    // Validation Error මගහැරීමට confidenceLevel පේළිය අයින් කරන ලදී
    const moodEntry = await MoodEntry.create({
      user: req.user._id,
      predictedEmotion: finalEmotion.toLowerCase(),
      source: "journal", 
      inputText: inputText || `Quick check-in: ${finalEmotion}`,
      confidence: confidence || 1,
      // මෙතන confidenceLevel පාවිච්චි නොකර සේව් කරමු (Schema default value එක ගනීවි)
      sentimentLabel: sentimentLabel || (["joy", "calm", "love"].includes(finalEmotion.toLowerCase()) ? "positive" : "negative")
    });

    res.status(201).json({ 
      success: true,
      message: "Mood saved successfully", 
      data: moodEntry 
    });
  } catch (error) {
    console.error("Quick save error:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Error saving mood", 
      error: error.message 
    });
  }
};

/**
 * --- C. Journal Entries AI හරහා සේව් කිරීමට ---
 */
const saveMoodEntry = async (req, res) => {
  try {
    const { text, source } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const prediction = await callAIService(text);

    const moodEntry = await MoodEntry.create({
      user: req.user._id,
      inputText: prediction.inputText,
      cleanText: prediction.cleanText,
      predictedEmotion: prediction.predictedEmotion,
      confidence: prediction.confidence,
      confidenceLevel: prediction.confidenceLevel,
      sentimentScore: prediction.sentimentScore,
      sentimentLabel: prediction.sentimentLabel,
      source: source || "journal",
    });

    res.status(201).json({ 
      success: true,
      message: "Mood entry saved successfully", 
      data: moodEntry 
    });
  } catch (error) {
    console.error("Journal save error:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Save failed", 
      error: error.message 
    });
  }
};

/**
 * --- D. පරිශීලකයාගේ සියලුම Mood Entries ලබාගැනීම ---
 */
const getMyMoodEntries = async (req, res) => {
  try {
    const moods = await MoodEntry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ 
      success: true,
      message: "Mood entries fetched successfully", 
      data: moods 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Fetch failed", 
      error: error.message 
    });
  }
};

module.exports = {
  predictMood,
  quickMoodCheckIn,
  saveMoodEntry,
  getMyMoodEntries,
};