const axios = require("axios");
const ChatMessage = require("../models/ChatMessage");
const MoodEntry = require("../models/MoodEntry");
const { calculateRiskScore } = require("../utils/riskAssessmentUtil");

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8000/predict";

const supportMap = {
  joy: "I’m glad you’re feeling positive. Let’s keep that momentum going.",
  calm: "You sound emotionally balanced right now. That’s a healthy place to be.",
  stress: "It sounds like things feel heavy right now. Let’s take one small step at a time.",
  anxiety: "I can sense some anxiety. Let’s slow things down and focus on what feels manageable.",
  sadness: "I’m sorry you’re feeling low. You don’t have to carry everything at once.",
  anger: "It sounds like something has frustrated you. Taking a pause may help before reacting.",
  fatigue: "You seem drained. Rest and reducing pressure may help right now.",
  love: "That sounds warm and meaningful. It’s good to notice and appreciate those moments.",
  fear: "Something may feel uncertain or scary right now. Let’s focus on what you can control.",
  disgust: "That sounds uncomfortable. A short reset may help you feel more grounded.",
  surprise: "Something unexpected seems to have happened. Let’s take a moment to process it.",
  neutral: "Thank you for sharing that. I’m here with you.",
};

const recommendationMap = {
  joy: ["Write down one thing you’re grateful for today.", "Share your positive energy with someone you trust."],
  calm: ["Take a mindful pause later today.", "Continue your current healthy routine."],
  stress: ["Try a 5-minute breathing exercise.", "Break one big task into 3 smaller steps.", "Take a short walk or stretch break."],
  anxiety: ["Try grounding: name 5 things you can see.", "Focus only on the next small step.", "Take slow deep breaths for 2 minutes."],
  sadness: ["Write what you’re feeling without judging it.", "Reach out to someone supportive.", "Do one gentle self-care activity today."],
  anger: ["Pause before responding.", "Step away for 5 minutes if possible.", "Write your thoughts first before acting."],
  fatigue: ["Drink water and rest for a few minutes.", "Reduce one non-essential task today."],
  love: ["Capture this moment in a journal entry.", "Express appreciation to someone meaningful."],
  fear: ["Focus on what is within your control.", "Take one small safe step forward."],
  disgust: ["Shift to a different activity for a short while.", "Take a few calm breaths and reset."],
  surprise: ["Pause and reflect before reacting.", "Write down what happened and how it made you feel."],
  neutral: ["Check in with yourself again later today.", "A short journal reflection may help."],
};

const normalizeEmotion = (emotion) =>
  String(emotion || "neutral").toLowerCase().trim();

const normalizeSentiment = (sentiment) =>
  String(sentiment || "neutral").toLowerCase().trim();

const callAIService = async (text) => {
  const response = await axios.post(
    AI_SERVICE_URL,
    { text },
    { timeout: 10000 }
  );

  return response.data?.data || response.data;
};

const getBotReply = (emotion, riskScore) => {
  const baseReply = supportMap[emotion] || supportMap.neutral;

  if (riskScore >= 75) {
    return `${baseReply} I’m also noticing signs of high emotional distress. Please consider reaching out to someone you trust or an immediate support resource.`;
  }

  if (riskScore >= 45) {
    return `${baseReply} This may be a good moment to slow down and take one supportive action.`;
  }

  return baseReply;
};

const sendChatMessage = async (req, res) => {
  try {
    const message = req.body.message?.trim();

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const prediction = await callAIService(message);

    const detectedEmotion = normalizeEmotion(prediction.predictedEmotion);
    const sentimentLabel = normalizeSentiment(prediction.sentimentLabel);
    const supportLevel = prediction.supportLevel || "moderate";
    const confidence = Number(prediction.confidence || 0);

    const previousNegativeCount = await MoodEntry.countDocuments({
      user: req.user._id,
      sentimentLabel: "negative",
    });

    const riskScore = calculateRiskScore({
      predictedEmotion: detectedEmotion,
      sentimentLabel,
      confidence,
      supportLevel,
      text: message,
      previousNegativeCount,
    });

    const recommendations =
      recommendationMap[detectedEmotion] || recommendationMap.neutral;

    const botReply = getBotReply(detectedEmotion, riskScore);

    await MoodEntry.create({
      user: req.user._id,
      inputText: message,
      cleanText: prediction.cleanText || message,
      predictedEmotion: detectedEmotion,
      rawPrediction: prediction.rawPrediction || detectedEmotion,
      confidence,
      confidenceLevel: prediction.confidenceLevel || "medium",
      sentimentScore: prediction.sentimentScore || 0,
      sentimentLabel,
      recommendationType: prediction.recommendationType || "chatbot_support",
      supportLevel,
      riskScore,
      triggerCategory: prediction.triggerCategory || "general",
      explanationKeywords: prediction.explanationKeywords || [],
      top3Predictions: prediction.top3Predictions || [],
      source: "analysis",
    });

    const userMessage = await ChatMessage.create({
      user: req.user._id,
      sender: "user",
      message,
      detectedEmotion,
      sentimentLabel,
      supportLevel,
      riskScore,
      recommendations: [],
    });

    const botMessage = await ChatMessage.create({
      user: req.user._id,
      sender: "bot",
      message: botReply,
      detectedEmotion,
      sentimentLabel,
      supportLevel,
      riskScore,
      recommendations,
    });

    return res.status(201).json({
      success: true,
      message: "Chat response generated successfully",
      data: {
        userMessage,
        botMessage: {
          ...botMessage.toObject(),
          analysis: {
            detectedEmotion,
            sentimentLabel,
            supportLevel,
            riskScore,
            confidence,
            recommendations,
            top3Predictions: prediction.top3Predictions || [],
            explanationKeywords: prediction.explanationKeywords || [],
          },
        },
      },
    });
  } catch (error) {
    console.error("sendChatMessage error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Chatbot response failed",
      error: error.message,
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ user: req.user._id })
      .sort({ createdAt: 1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("getChatHistory error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
      error: error.message,
    });
  }
};

module.exports = {
  sendChatMessage,
  getChatHistory,
};