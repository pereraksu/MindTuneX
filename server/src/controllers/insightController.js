const MoodEntry = require("../models/MoodEntry");

const getSentimentScore = (label) => {
  const value = String(label || "neutral").toLowerCase();
  if (value === "positive") return 1;
  if (value === "negative") return -1;
  return 0;
};

const getWeeklyInsights = async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const moods = await MoodEntry.find({
      user: req.user._id,
      createdAt: { $gte: last7Days },
    }).sort({ createdAt: 1 });

    if (!moods.length) {
      return res.status(200).json({
        success: true,
        message: "No weekly insights available",
        data: null,
      });
    }

    const emotionCounts = {};
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    let totalScore = 0;

    moods.forEach((mood) => {
      const emotion = String(mood.predictedEmotion || "neutral")
        .toLowerCase()
        .trim();

      const sentiment = String(mood.sentimentLabel || "neutral")
        .toLowerCase()
        .trim();

      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;

      const score =
        typeof mood.sentimentScore === "number"
          ? mood.sentimentScore
          : getSentimentScore(sentiment);

      totalScore += score;

      if (sentiment === "positive") positiveCount++;
      else if (sentiment === "negative") negativeCount++;
      else neutralCount++;
    });

    let avgSentiment = "Neutral";
    if (positiveCount > negativeCount && positiveCount >= neutralCount) {
      avgSentiment = "Positive";
    } else if (negativeCount > positiveCount && negativeCount >= neutralCount) {
      avgSentiment = "Negative";
    }

    const topEmotion =
      Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "neutral";

    let trend = "stable";

    if (moods.length >= 2) {
      const firstMood = moods[0];
      const lastMood = moods[moods.length - 1];

      const firstScore =
        typeof firstMood.sentimentScore === "number"
          ? firstMood.sentimentScore
          : getSentimentScore(firstMood.sentimentLabel);

      const lastScore =
        typeof lastMood.sentimentScore === "number"
          ? lastMood.sentimentScore
          : getSentimentScore(lastMood.sentimentLabel);

      if (lastScore > firstScore + 0.2) trend = "improving";
      else if (lastScore < firstScore - 0.2) trend = "declining";
    }

    let summaryText = "";

    if (avgSentiment === "Positive") {
      summaryText = `You had a positive emotional trend this week, with ${topEmotion} appearing most often. Keep maintaining these healthy emotional patterns.`;
    } else if (avgSentiment === "Negative") {
      summaryText = `This week showed more challenging emotions, especially ${topEmotion}. Consider focusing on self-care, reflection, and support strategies.`;
    } else {
      summaryText = `Your emotions were fairly balanced this week, with ${topEmotion} appearing most often. Keep tracking your moods to understand your patterns better.`;
    }

    if (trend === "improving") {
      summaryText += " Your emotional trend also appears to be improving over time.";
    } else if (trend === "declining") {
      summaryText += " There is a slight downward trend recently, so extra care may be helpful.";
    }

    return res.status(200).json({
      success: true,
      message: "Weekly insights generated successfully",
      data: {
        totalEntries: moods.length,
        avgSentiment,
        avgSentimentScore: Number((totalScore / moods.length).toFixed(2)),
        topEmotion,
        emotionCounts,
        trend,
        positiveCount,
        negativeCount,
        neutralCount,
        summaryText,
      },
    });
  } catch (error) {
    console.error("getWeeklyInsights error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Insight generation failed",
      error: error.message,
    });
  }
};

module.exports = {
  getWeeklyInsights,
};