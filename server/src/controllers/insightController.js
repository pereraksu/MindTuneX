const MoodEntry = require("../models/MoodEntry");

const getWeeklyInsights = async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const moods = await MoodEntry.find({
      user: req.user._id,
      createdAt: { $gte: last7Days },
    }).sort({ createdAt: 1 });

    if (!moods.length) {
      return res.json({
        success: true,
        data: null,
        message: "No weekly insights available",
      });
    }

    // ---------------------------
    // 1. Emotion Counts
    // ---------------------------
    const emotionCounts = {};
    let totalSentimentScore = 0;
    let positiveCount = 0;
    let negativeCount = 0;

    moods.forEach((m) => {
      const emo = m.predictedEmotion || "neutral";

      emotionCounts[emo] = (emotionCounts[emo] || 0) + 1;

      totalSentimentScore += m.sentimentScore || 0;

      if (m.sentimentLabel === "positive") positiveCount++;
      if (m.sentimentLabel === "negative") negativeCount++;
    });

    // ---------------------------
    // 2. Average Sentiment (Label)
    // ---------------------------
    let avgSentimentLabel = "Neutral";
    if (positiveCount > negativeCount) avgSentimentLabel = "Positive";
    if (negativeCount > positiveCount) avgSentimentLabel = "Negative";

    // ---------------------------
    // 3. Top Emotion
    // ---------------------------
    const topEmotion = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])[0][0];

    // ---------------------------
    // 4. Trend Detection (NEW 🔥)
    // ---------------------------
    let trend = "stable";

    if (moods.length >= 2) {
      const first = moods[0].sentimentScore || 0;
      const last = moods[moods.length - 1].sentimentScore || 0;

      if (last > first + 0.2) trend = "improving";
      else if (last < first - 0.2) trend = "declining";
    }

    // ---------------------------
    // 5. Smart AI Summary (UPGRADED 🔥)
    // ---------------------------
    let summaryText = "";

    if (avgSentimentLabel === "Positive") {
      summaryText = `You had a positive emotional trend this week with dominant feelings of ${topEmotion}. Keep maintaining these healthy patterns!`;
    } else if (avgSentimentLabel === "Negative") {
      summaryText = `This week showed more challenging emotions, especially ${topEmotion}. Consider focusing on self-care and support strategies.`;
    } else {
      summaryText = `Your emotions were balanced this week, with ${topEmotion} being most frequent. Keep tracking to understand patterns better.`;
    }

    if (trend === "improving") {
      summaryText += " The good news is your mood is improving over time 📈.";
    } else if (trend === "declining") {
      summaryText += " There is a slight downward trend recently ⚠️.";
    }

    // ---------------------------
    // FINAL RESPONSE
    // ---------------------------
    res.json({
      success: true,
      message: "Weekly insights generated successfully",
      data: {
        totalEntries: moods.length,
        avgSentiment: avgSentimentLabel, // ✅ FIXED
        topEmotion,
        emotionCounts,
        trend, // 🔥 NEW
        positiveCount,
        negativeCount,
        summaryText,
      },
    });

  } catch (error) {
    console.error("getWeeklyInsights error:", error.message);

    res.status(500).json({
      success: false,
      message: "Insight generation failed",
      error: error.message,
    });
  }
};

module.exports = {
  getWeeklyInsights,
};