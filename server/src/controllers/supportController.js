const axios = require("axios");
const SupportLog = require("../models/SupportLog");

// --------------------------------------------------
// Emotion Recommendation Map
// --------------------------------------------------
const recommendationMap = {
  joy: ["Keep a gratitude journal today.", "Listen to uplifting music.", "Share your positive energy with a friend."],
  calm: ["Continue your mindfulness routine.", "Take a peaceful walk outdoors.", "Maintain your balanced daily routine."],
  stress: ["Take a short breathing break.", "Break tasks into smaller parts.", "Try a guided relaxation exercise."],
  anxiety: ["Practice deep breathing for two minutes.", "Write down your worries.", "Focus on the next small step."],
  sadness: ["Talk to someone you trust.", "Write your feelings in a journal.", "Do one comforting activity today."],
  anger: ["Pause before reacting.", "Take a short walk to cool down.", "Write down your thoughts first."],
  fatigue: ["Take a proper rest break.", "Drink water and stretch.", "Reduce non-essential tasks for now."],
  love: ["Spend time with someone meaningful.", "Express appreciation to a loved one.", "Capture this moment in writing."],
  fear: ["Use grounding techniques.", "Focus on what you can control.", "Take one small safe step forward."],
  disgust: ["Step away and reset your mind.", "Shift to a different activity.", "Take a few deep breaths."],
  surprise: ["Pause and reflect before reacting.", "Write what happened.", "Use curiosity to understand it."],
  neutral: ["Do a short reflection entry.", "Check in with yourself later today.", "Maintain your regular healthy routine."],
};

// --------------------------------------------------
// Emotion Support Messages
// --------------------------------------------------
const supportMap = {
  joy: "You seem to be feeling positive. This is a good time to maintain your momentum.",
  calm: "You seem emotionally balanced right now. Try to maintain this peaceful state.",
  stress: "It sounds like you are under pressure. Try slowing down and focusing on one task at a time.",
  anxiety: "You seem worried or uneasy. Take a slow breath and focus on the next step only.",
  sadness: "You may be feeling low right now. Be gentle with yourself and reach out if needed.",
  anger: "You seem frustrated. Taking a short pause may help before reacting.",
  fatigue: "You sound mentally or physically drained. Rest and recovery may help most right now.",
  love: "This sounds like a warm and meaningful emotion. Take time to appreciate it.",
  fear: "Something may feel uncertain right now. Grounding yourself could help.",
  disgust: "That seems uncomfortable. A short reset may help you refocus.",
  surprise: "Something unexpected may have happened. Take a moment to process it.",
  neutral: "You seem emotionally steady. This could be a good time for reflection.",
};

// --------------------------------------------------
// YouTube Playlist Fetcher (SAFE VERSION)
// --------------------------------------------------
const fetchYouTubePlaylists = async (emotion) => {
  try {
    // ⚠️ API key check
    if (!process.env.YOUTUBE_API_KEY) {
      console.warn("⚠️ Missing YouTube API Key");
      return [];
    }

    const emotionQueryMap = {
      joy: "happy chill music playlist",
      calm: "relaxing meditation music playlist",
      stress: "stress relief calming music playlist",
      anxiety: "anxiety relief binaural beats playlist",
      sadness: "comfort piano instrumental playlist",
      anger: "calming nature sounds playlist",
      fatigue: "focus energy music playlist",
      love: "romantic acoustic music playlist",
      fear: "grounding meditation playlist",
      disgust: "positive energy music playlist",
      surprise: "focus study music playlist",
      neutral: "lofi chill beats playlist",
    };

    const searchQuery = emotionQueryMap[emotion] || "relaxing music playlist";

    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: searchQuery,
        type: "playlist",
        maxResults: 4,
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    return response.data.items.map((item) => ({
      id: item.id.playlistId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.high?.url,
      url: `https://www.youtube.com/playlist?list=${item.id.playlistId}`,
    }));
  } catch (error) {
    console.error("YouTube API Error:", error.message);
    return [];
  }
};

// --------------------------------------------------
// MAIN CONTROLLER
// --------------------------------------------------
const getSupportResponse = async (req, res) => {
  try {
    const { emotion, moodEntryId } = req.body;

    const detectedEmotion = emotion ? emotion.toLowerCase() : "neutral";

    const supportResponse =
      supportMap[detectedEmotion] || supportMap.neutral;

    const recommendations =
      recommendationMap[detectedEmotion] || recommendationMap.neutral;

    // 🎵 Fetch playlists safely
    const youtubePlaylists = await fetchYouTubePlaylists(detectedEmotion);

    // 🧠 Save log
    const log = await SupportLog.create({
      user: req.user._id,
      moodEntry: moodEntryId || null,
      detectedEmotion,
      supportResponse,
      recommendations,
    });

    return res.status(200).json({
      success: true,
      message: "Support response generated successfully",
      data: {
        detectedEmotion,
        supportResponse,
        recommendations,
        youtubePlaylists,
        log,
      },
    });
  } catch (error) {
    console.error("Support Generation Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Support generation failed",
      error: error.message,
    });
  }
};

module.exports = {
  getSupportResponse,
};