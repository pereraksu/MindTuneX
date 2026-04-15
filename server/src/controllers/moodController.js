const axios = require("axios");
const MoodEntry = require("../models/MoodEntry");
const JournalEntry = require("../models/JournalEntry");
const { encryptText, decryptText } = require("../utils/encryptionUtil");

const AI_SERVICE_URL = "http://127.0.0.1:8000/predict";

const ALLOWED_SOURCES = ["journal", "analysis", "quick_checkin", "support_page"];

const POSITIVE_EMOTIONS = ["joy", "calm", "love", "surprise"];
const HIGH_SUPPORT_EMOTIONS = ["stress", "anxiety", "sadness", "fear", "anger"];
const MODERATE_SUPPORT_EMOTIONS = ["fatigue", "disgust"];

// --------------------------------------------------
// Helper: Normalize source
// --------------------------------------------------
const normalizeSource = (source, fallback = "journal") => {
  if (!source) return fallback;

  const cleanedSource = String(source)
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");

  return ALLOWED_SOURCES.includes(cleanedSource) ? cleanedSource : fallback;
};

// --------------------------------------------------
// Helper: Call FastAPI AI service
// --------------------------------------------------
const callAIService = async (text) => {
  const response = await axios.post(AI_SERVICE_URL, { text });

  if (response.data?.data) {
    return response.data.data;
  }

  return response.data;
};

// --------------------------------------------------
// Helper: Build fallback prediction if AI fails
// --------------------------------------------------
const buildFallbackPrediction = (text) => ({
  inputText: text,
  cleanText: text,
  rawPrediction: "neutral",
  predictedEmotion: "neutral",
  confidence: 0.5,
  confidencePercentage: 50,
  confidenceLevel: "medium",
  sentimentScore: 0,
  sentimentLabel: "neutral",
  recommendationType: "general_reflection_content",
  supportLevel: "moderate",
  triggerCategory: "general",
  explanationKeywords: [],
  top3Predictions: [
    { emotion: "neutral", score: 0.5 },
    { emotion: "calm", score: 0.3 },
    { emotion: "sadness", score: 0.2 },
  ],
});

// --------------------------------------------------
// A. Prediction only
// POST /api/moods/predict
// --------------------------------------------------
const predictMood = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const prediction = await callAIService(text);

    if (!prediction || !prediction.predictedEmotion) {
      return res.status(500).json({
        success: false,
        message: "Invalid AI response",
      });
    }

    return res.status(200).json(prediction);
  } catch (error) {
    console.error("predictMood error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Prediction failed",
      error: error.message,
    });
  }
};

// --------------------------------------------------
// B. Quick mood check-in
// POST /api/moods/
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

    const finalEmotion = emotion || predictedEmotion;

    if (!finalEmotion) {
      return res.status(400).json({
        success: false,
        message: "Emotion value is required",
      });
    }

    const lowerEmotion = String(finalEmotion).toLowerCase();
    const normalizedSource = normalizeSource(source, "quick_checkin");

    const finalConfidence =
      typeof confidence === "number" && !Number.isNaN(confidence) ? confidence : 1;

    const finalSentimentLabel =
      sentimentLabel ||
      (POSITIVE_EMOTIONS.includes(lowerEmotion) ? "positive" : "negative");

    const finalSupportLevel = HIGH_SUPPORT_EMOTIONS.includes(lowerEmotion)
      ? "high"
      : MODERATE_SUPPORT_EMOTIONS.includes(lowerEmotion)
      ? "moderate"
      : "low";

    const finalConfidenceLevel =
      finalConfidence >= 0.75
        ? "high"
        : finalConfidence >= 0.45
        ? "medium"
        : "low";

    const finalSentimentScore = POSITIVE_EMOTIONS.includes(lowerEmotion) ? 0.7 : -0.5;

    const moodEntry = await MoodEntry.create({
      user: req.user._id,
      inputText: encryptText(inputText || `Quick mood check-in: ${finalEmotion}`),
      cleanText: encryptText(""),
      predictedEmotion: lowerEmotion,
      rawPrediction: "",
      confidence: finalConfidence,
      confidenceLevel: finalConfidenceLevel,
      sentimentScore: finalSentimentScore,
      sentimentLabel: finalSentimentLabel,
      recommendationType: "general_reflection_content",
      supportLevel: finalSupportLevel,
      triggerCategory: "general",
      explanationKeywords: [],
      top3Predictions: [],
      source: normalizedSource,
    });

    return res.status(201).json({
      success: true,
      message: "Mood saved successfully",
      data: moodEntry,
    });
  } catch (error) {
    console.error("quickMoodCheckIn error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error saving mood",
      error: error.message,
    });
  }
};

// --------------------------------------------------
// C. Save journal entry with AI prediction
// POST /api/moods/journal
// --------------------------------------------------
const saveMoodEntry = async (req, res) => {
  try {
    const { text, title, tags, source } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const normalizedSource = normalizeSource(source, "journal");

    let prediction;

    try {
      prediction = await callAIService(text);

      if (!prediction || !prediction.predictedEmotion) {
        prediction = buildFallbackPrediction(text);
      }
    } catch (aiError) {
      console.warn("AI service failed, using fallback prediction:", aiError.message);
      prediction = buildFallbackPrediction(text);
    }

    const moodEntry = await MoodEntry.create({
      user: req.user._id,
      inputText: encryptText(prediction.inputText || text),
      cleanText: encryptText(prediction.cleanText || text),
      predictedEmotion: prediction.predictedEmotion || "neutral",
      rawPrediction: prediction.rawPrediction || "",
      confidence: prediction.confidence || 0,
      confidenceLevel: prediction.confidenceLevel || "low",
      sentimentScore: prediction.sentimentScore || 0,
      sentimentLabel: prediction.sentimentLabel || "neutral",
      recommendationType:
        prediction.recommendationType || "general_reflection_content",
      supportLevel: prediction.supportLevel || "moderate",
      triggerCategory: prediction.triggerCategory || "general",
      explanationKeywords: Array.isArray(prediction.explanationKeywords)
        ? prediction.explanationKeywords
        : [],
      top3Predictions: Array.isArray(prediction.top3Predictions)
        ? prediction.top3Predictions
        : [],
      source: normalizedSource,
    });

    const journal = await JournalEntry.create({
      user: req.user._id,
      title: title || "",
      content: text,
      moodEntry: moodEntry._id,
      tags: Array.isArray(tags) ? tags : [],
    });

    return res.status(201).json({
      success: true,
      message: "Journal entry and mood analysis saved successfully",
      data: {
        moodEntry,
        journal,
      },
    });
  } catch (error) {
    console.error("saveMoodEntry error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Save failed",
      error: error.message,
    });
  }
};

// --------------------------------------------------
// D. Get all mood entries for logged-in user
// GET /api/moods/
// --------------------------------------------------
const getMyMoodEntries = async (req, res) => {
  try {
    const moods = await MoodEntry.find({ user: req.user._id }).sort({ createdAt: -1 });

    const decryptedMoods = moods.map((mood) => {
      const moodObj = mood.toObject();

      return {
        ...moodObj,
        inputText: moodObj.inputText ? decryptText(moodObj.inputText) : "",
        cleanText: moodObj.cleanText ? decryptText(moodObj.cleanText) : "",
      };
    });

    return res.status(200).json({
      success: true,
      message: "Mood entries fetched successfully",
      data: decryptedMoods,
    });
  } catch (error) {
    console.error("getMyMoodEntries error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Fetch failed",
      error: error.message,
    });
  }
};

module.exports = {
  predictMood,
  quickMoodCheckIn,
  saveMoodEntry,
  getMyMoodEntries,
};