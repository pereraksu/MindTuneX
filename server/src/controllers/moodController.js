const axios = require("axios");
const MoodEntry = require("../models/MoodEntry");
const JournalEntry = require("../models/JournalEntry");
const { encryptText, decryptText } = require("../utils/encryptionUtil");
const { calculateRiskScore } = require("../utils/riskAssessmentUtil");

const AI_SERVICE_URL = "http://127.0.0.1:8000/predict";

// --------------------------------------------------
// Constants
// --------------------------------------------------
const ALLOWED_SOURCES = ["journal", "analysis", "quick_checkin", "support_page"];

const POSITIVE_EMOTIONS = ["joy", "calm", "love", "surprise"];
const HIGH_SUPPORT_EMOTIONS = ["stress", "anxiety", "sadness", "fear", "anger"];
const MODERATE_SUPPORT_EMOTIONS = ["fatigue", "disgust"];

// --------------------------------------------------
// Helper: Normalize source
// --------------------------------------------------
const normalizeSource = (source, fallback = "journal") => {
  if (!source) return fallback;

  const cleaned = String(source)
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");

  return ALLOWED_SOURCES.includes(cleaned) ? cleaned : fallback;
};

// --------------------------------------------------
// Helper: Call AI service
// --------------------------------------------------
const callAIService = async (text) => {
  const res = await axios.post(AI_SERVICE_URL, { text });
  return res.data?.data || res.data;
};

// --------------------------------------------------
// Helper: Fallback prediction
// --------------------------------------------------
const fallbackPrediction = (text) => ({
  inputText: text,
  cleanText: text,
  rawPrediction: "neutral",
  predictedEmotion: "neutral",
  confidence: 0.5,
  confidenceLevel: "medium",
  sentimentScore: 0,
  sentimentLabel: "neutral",
  recommendationType: "general_reflection_content",
  supportLevel: "moderate",
  triggerCategory: "general",
  explanationKeywords: [],
  top3Predictions: [],
});

// --------------------------------------------------
// A. Predict Only
// --------------------------------------------------
const predictMood = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const prediction = await callAIService(text);

    if (!prediction?.predictedEmotion) {
      throw new Error("Invalid AI response");
    }

    res.json(prediction);
  } catch (err) {
    console.error("predictMood:", err.message);
    res.status(500).json({
      success: false,
      message: "Prediction failed",
    });
  }
};

// --------------------------------------------------
// B. Quick Check-in
// --------------------------------------------------
const quickMoodCheckIn = async (req, res) => {
  try {
    const {
      emotion,
      predictedEmotion,
      inputText,
      sentimentLabel,
      source,
      confidence,
    } = req.body;

    const finalEmotion = (emotion || predictedEmotion)?.toLowerCase();

    if (!finalEmotion) {
      return res.status(400).json({
        success: false,
        message: "Emotion is required",
      });
    }

    const finalConfidence = typeof confidence === "number" ? confidence : 1;

    const finalSentiment =
      sentimentLabel ||
      (POSITIVE_EMOTIONS.includes(finalEmotion) ? "positive" : "negative");

    const finalSupport =
      HIGH_SUPPORT_EMOTIONS.includes(finalEmotion)
        ? "high"
        : MODERATE_SUPPORT_EMOTIONS.includes(finalEmotion)
        ? "moderate"
        : "low";

    const confidenceLevel =
      finalConfidence >= 0.75
        ? "high"
        : finalConfidence >= 0.45
        ? "medium"
        : "low";

    const sentimentScore = POSITIVE_EMOTIONS.includes(finalEmotion) ? 0.7 : -0.5;

    // 🔥 Risk calculation
    const previousNegativeCount = await MoodEntry.countDocuments({
      user: req.user._id,
      sentimentLabel: "negative",
    });

    const riskScore = calculateRiskScore({
      predictedEmotion: finalEmotion,
      sentimentLabel: finalSentiment,
      confidence: finalConfidence,
      supportLevel: finalSupport,
      text: inputText || "",
      previousNegativeCount,
    });

    const mood = await MoodEntry.create({
      user: req.user._id,
      inputText: encryptText(inputText || `Quick: ${finalEmotion}`),
      cleanText: encryptText(""),
      predictedEmotion: finalEmotion,
      confidence: finalConfidence,
      confidenceLevel,
      sentimentScore,
      sentimentLabel: finalSentiment,
      supportLevel: finalSupport,
      source: normalizeSource(source, "quick_checkin"),
      riskScore,
    });

    res.status(201).json({
      success: true,
      data: mood,
    });
  } catch (err) {
    console.error("quickMoodCheckIn:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to save mood",
    });
  }
};

// --------------------------------------------------
// C. Journal + AI
// --------------------------------------------------
const saveMoodEntry = async (req, res) => {
  try {
    const { text, title, tags, source } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text required",
      });
    }

    let prediction;

    try {
      prediction = await callAIService(text);
    } catch {
      prediction = fallbackPrediction(text);
    }

    if (!prediction?.predictedEmotion) {
      prediction = fallbackPrediction(text);
    }

    const previousNegativeCount = await MoodEntry.countDocuments({
      user: req.user._id,
      sentimentLabel: "negative",
    });

    const riskScore = calculateRiskScore({
      predictedEmotion: prediction.predictedEmotion,
      sentimentLabel: prediction.sentimentLabel,
      confidence: prediction.confidence,
      supportLevel: prediction.supportLevel,
      text,
      previousNegativeCount,
    });

    const mood = await MoodEntry.create({
      user: req.user._id,
      inputText: encryptText(text),
      cleanText: encryptText(prediction.cleanText || text),
      predictedEmotion: prediction.predictedEmotion,
      confidence: prediction.confidence,
      confidenceLevel: prediction.confidenceLevel,
      sentimentScore: prediction.sentimentScore,
      sentimentLabel: prediction.sentimentLabel,
      supportLevel: prediction.supportLevel,
      source: normalizeSource(source),
      riskScore,
    });

    const journal = await JournalEntry.create({
      user: req.user._id,
      title: title || "",
      content: text,
      moodEntry: mood._id,
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      data: { mood, journal },
    });
  } catch (err) {
    console.error("saveMoodEntry:", err.message);
    res.status(500).json({
      success: false,
      message: "Save failed",
    });
  }
};

// --------------------------------------------------
// D. Get My Moods
// --------------------------------------------------
const getMyMoodEntries = async (req, res) => {
  try {
    const moods = await MoodEntry.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    const decrypted = moods.map((m) => ({
      ...m.toObject(),
      inputText: decryptText(m.inputText),
      cleanText: decryptText(m.cleanText),
    }));

    res.json({
      success: true,
      data: decrypted,
    });
  } catch (err) {
    console.error("getMyMoodEntries:", err.message);
    res.status(500).json({
      success: false,
      message: "Fetch failed",
    });
  }
};

module.exports = {
  predictMood,
  quickMoodCheckIn,
  saveMoodEntry,
  getMyMoodEntries,
};