const MoodEntry = require("../models/MoodEntry");

const getWeeklyInsights = async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const moods = await MoodEntry.find({
      user: req.user._id,
      createdAt: { $gte: last7Days },
    });

    if (!moods.length) {
      return res.json({
        message: "No weekly insights available",
        data: null,
      });
    }

    let totalSentiment = 0;
    const emotionCounts = {};

    moods.forEach((m) => {
      totalSentiment += m.sentimentScore || 0;
      emotionCounts[m.predictedEmotion] = (emotionCounts[m.predictedEmotion] || 0) + 1;
    });

    const avgSentiment = totalSentiment / moods.length;
    const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0][0];

    let summaryText = "Your emotional state was fairly balanced this week.";
    if (avgSentiment > 0.3) summaryText = "You had a generally positive emotional week.";
    if (avgSentiment < -0.3) summaryText = "You experienced more negative emotions this week.";

    res.json({
      message: "Weekly insights generated successfully",
      data: {
        totalEntries: moods.length,
        avgSentiment: Number(avgSentiment.toFixed(3)),
        topEmotion,
        emotionCounts,
        summaryText,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Insight generation failed", error: error.message });
  }
};

module.exports = {
  getWeeklyInsights,
};