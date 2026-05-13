const axios = require("axios");
const MoodEntry = require("../models/MoodEntry");
const JournalEntry = require("../models/JournalEntry");
const { encryptText, decryptText } = require("../utils/encryptionUtil");
const { calculateRiskScore } = require("../utils/riskAssessmentUtil");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000/predict";

const ALLOWED_SOURCES = ["journal", "analysis", "quick_checkin", "support_page"];

const POSITIVE_EMOTIONS = ["joy", "calm", "love", "surprise"];
const HIGH_SUPPORT_EMOTIONS = ["stress", "anxiety", "sadness", "fear", "anger"];
const MODERATE_SUPPORT_EMOTIONS = ["fatigue", "disgust"];

const normalizeSource = (source, fallback = "journal") => {
  const cleaned = String(source || fallback).trim().toLowerCase().replace(/-/g, "_");
  return ALLOWED_SOURCES.includes(cleaned) ? cleaned : fallback;
};

const safeDecrypt = (value) => {
  try {
    return value ? decryptText(value) : "";
  } catch {
    return value || "";
  }
};

const callAIService = async (text) => {
  const res = await axios.post(AI_SERVICE_URL, { text }, { timeout: 10000 });
  return res.data?.data || res.data;
};

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

const getPreviousNegativeCount = async (userId) =>
  MoodEntry.countDocuments({
    user: userId,
    sentimentLabel: "negative",
  });

// A. Predict Only
const predictMood = async (req, res) => {
  try {
    const text = String(req.body.text || "").trim();

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const prediction = await callAIService(text);

    if (!prediction?.predictedEmotion) {
      throw new Error("Invalid AI response");
    }

    return res.status(200).json({
      success: true,
      ...prediction,
    });
  } catch (err) {
    console.error("predictMood:", err.message);

    return res.status(500).json({
      success: false,
      message: "Prediction failed",
    });
  }
};

// B. Quick Check-in
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

    const finalEmotion = String(emotion || predictedEmotion || "")
      .trim()
      .toLowerCase();

    if (!finalEmotion) {
      return res.status(400).json({
        success: false,
        message: "Emotion is required",
      });
    }

    const finalConfidence =
      typeof confidence === "number" && confidence >= 0 && confidence <= 1
        ? confidence
        : 1;

    const finalSentiment =
      sentimentLabel ||
      (POSITIVE_EMOTIONS.includes(finalEmotion) ? "positive" : "negative");

    const finalSupport = HIGH_SUPPORT_EMOTIONS.includes(finalEmotion)
      ? "high"
      : MODERATE_SUPPORT_EMOTIONS.includes(finalEmotion)
      ? "moderate"
      : "low";

    const confidenceLevel =
      finalConfidence >= 0.75 ? "high" : finalConfidence >= 0.45 ? "medium" : "low";

    const sentimentScore = POSITIVE_EMOTIONS.includes(finalEmotion) ? 0.7 : -0.5;

    const finalText = String(inputText || `Quick: ${finalEmotion}`).trim();

    const previousNegativeCount = await getPreviousNegativeCount(req.user._id);

    const riskScore = calculateRiskScore({
      predictedEmotion: finalEmotion,
      sentimentLabel: finalSentiment,
      confidence: finalConfidence,
      supportLevel: finalSupport,
      text: finalText,
      previousNegativeCount,
    });

    const mood = await MoodEntry.create({
      user: req.user._id,
      inputText: encryptText(finalText),
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

    return res.status(201).json({
      success: true,
      message: "Quick mood check-in saved successfully",
      data: {
        ...mood.toObject(),
        inputText: finalText,
        cleanText: "",
      },
    });
  } catch (err) {
    console.error("quickMoodCheckIn:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to save mood",
    });
  }
};

// C. Journal + AI Save
const saveMoodEntry = async (req, res) => {
  try {
    const text = String(req.body.text || req.body.inputText || "").trim();
    const title = String(req.body.title || "").trim();
    const source = req.body.source;
    const tags = Array.isArray(req.body.tags)
      ? req.body.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean)
      : [];

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text required",
      });
    }

    let prediction;

    try {
      prediction = await callAIService(text);
    } catch (aiErr) {
      console.warn("AI service failed, using fallback:", aiErr.message);
      prediction = fallbackPrediction(text);
    }

    if (!prediction?.predictedEmotion) {
      prediction = fallbackPrediction(text);
    }

    const previousNegativeCount = await getPreviousNegativeCount(req.user._id);

    const riskScore = calculateRiskScore({
      predictedEmotion: prediction.predictedEmotion,
      sentimentLabel: prediction.sentimentLabel,
      confidence: prediction.confidence || 0.5,
      supportLevel: prediction.supportLevel || "moderate",
      text,
      previousNegativeCount,
    });

    const mood = await MoodEntry.create({
      user: req.user._id,
      inputText: encryptText(text),
      cleanText: encryptText(prediction.cleanText || text),
      predictedEmotion: prediction.predictedEmotion || "neutral",
      confidence: prediction.confidence || 0.5,
      confidenceLevel: prediction.confidenceLevel || "medium",
      sentimentScore: prediction.sentimentScore || 0,
      sentimentLabel: prediction.sentimentLabel || "neutral",
      recommendationType: prediction.recommendationType || "general_reflection_content",
      supportLevel: prediction.supportLevel || "moderate",
      triggerCategory: prediction.triggerCategory || "general",
      explanationKeywords: prediction.explanationKeywords || [],
      top3Predictions: prediction.top3Predictions || [],
      source: normalizeSource(source, "journal"),
      riskScore,
    });

    const journal = await JournalEntry.create({
      user: req.user._id,
      title,
      content: text,
      moodEntry: mood._id,
      tags,
    });

    return res.status(201).json({
      success: true,
      message: "Mood and journal entry saved successfully",
      data: {
        mood: {
          ...mood.toObject(),
          inputText: text,
          cleanText: prediction.cleanText || text,
        },
        journal,
      },
    });
  } catch (err) {
    console.error("saveMoodEntry:", err.message);

    return res.status(500).json({
      success: false,
      message: "Save failed",
    });
  }
};

// D. Get My Moods
const getMyMoodEntries = async (req, res) => {
  try {
    const moods = await MoodEntry.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    const decrypted = moods.map((mood) => ({
      ...mood.toObject(),
      inputText: safeDecrypt(mood.inputText),
      cleanText: safeDecrypt(mood.cleanText),
    }));

    return res.status(200).json({
      success: true,
      message: "Mood entries fetched successfully",
      data: decrypted,
    });
  } catch (err) {
    console.error("getMyMoodEntries:", err.message);

    return res.status(500).json({
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