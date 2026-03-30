const axios = require('axios');
const SupportLog = require("../models/SupportLog");

const recommendationMap = {
  joy: [
    "Keep a gratitude journal today.",
    "Listen to uplifting music.",
    "Share your positive energy with a friend.",
  ],
  calm: [
    "Continue your mindfulness routine.",
    "Take a peaceful walk outdoors.",
    "Maintain your balanced daily routine.",
  ],
  stress: [
    "Take a short breathing break.",
    "Break tasks into smaller parts.",
    "Try a guided relaxation exercise.",
  ],
  anxiety: [
    "Practice deep breathing for two minutes.",
    "Write down your worries.",
    "Focus on the next small step.",
  ],
  sadness: [
    "Talk to someone you trust.",
    "Write your feelings in a journal.",
    "Do one comforting activity today.",
  ],
  anger: [
    "Pause before reacting.",
    "Take a short walk to cool down.",
    "Write down your thoughts first.",
  ],
  fatigue: [
    "Take a proper rest break.",
    "Drink water and stretch.",
    "Reduce non-essential tasks for now.",
  ],
  love: [
    "Spend time with someone meaningful.",
    "Express appreciation to a loved one.",
    "Capture this moment in writing.",
  ],
  fear: [
    "Use grounding techniques.",
    "Focus on what you can control.",
    "Take one small safe step forward.",
  ],
  disgust: [
    "Step away and reset your mind.",
    "Shift to a different activity.",
    "Take a few deep breaths.",
  ],
  surprise: [
    "Pause and reflect before reacting.",
    "Write what happened.",
    "Use curiosity to understand it.",
  ],
  neutral: [
    "Do a short reflection entry.",
    "Check in with yourself later today.",
    "Maintain your regular healthy routine.",
  ],
};

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

// --- අලුත් Function එක: YouTube Playlists ගේන එක ---
const fetchYouTubePlaylists = async (emotion) => {
  try {
    let searchQuery = 'relaxing lo-fi study music playlist'; // Default Search

    // Pro-level therapeutic search queries (අගට playlist එකතු කරලා තියෙන්නේ)
    const emotionQueryMap = {
      joy: 'upbeat instrumental lo-fi chillhop happy mood playlist',
      calm: '432Hz healing frequency relaxing nature sounds ambient playlist',
      stress: 'weightless relaxing deep sleep stress relief instrumental playlist', 
      anxiety: '528Hz anxiety relief deep healing meditation binaural beats playlist',
      sadness: 'comforting warm ambient piano relaxing instrumental playlist',
      anger: 'calming water sounds deep zen meditation music playlist',
      fatigue: 'alpha waves brain focus energizing ambient music playlist',
      love: 'soft acoustic guitar instrumental calm background playlist',
      fear: 'grounding meditation root chakra healing sounds playlist',
      disgust: 'cleansing aura positive energy ambient music playlist',
      surprise: 'focus concentration calm lo-fi beats studying playlist',
      neutral: 'chill lofi hip hop radio beats to relax study to playlist'
    };

    if (emotionQueryMap[emotion]) {
      searchQuery = emotionQueryMap[emotion];
    }

    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search`;
    const response = await axios.get(youtubeUrl, {
      params: {
        part: 'snippet',
        q: searchQuery,
        type: 'playlist', // මෙතන 'video' වෙනුවට 'playlist' හැදුවා
        maxResults: 4, // ගේන Playlist ගාණ 4යි
        key: process.env.YOUTUBE_API_KEY
      }
    });

    const playlists = response.data.items.map(item => ({
      id: item.id.playlistId, // මෙතන videoId වෙනුවට playlistId හැදුවා
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      url: `https://www.youtube.com/playlist?list=${item.id.playlistId}` // Playlist URL එක හැදුවා
    }));

    return playlists;
  } catch (error) {
    console.error("YouTube API Error:", error.message);
    return []; // Error එකක් ආවොත් හිස් Array එකක් යවනවා
  }
};

const getSupportResponse = async (req, res) => {
  try {
    const { emotion, moodEntryId } = req.body;

    const detectedEmotion = emotion ? emotion.toLowerCase() : "neutral";
    const supportResponse = supportMap[detectedEmotion] || supportMap.neutral;
    const recommendations = recommendationMap[detectedEmotion] || recommendationMap.neutral;

    // YouTube Playlists ටික අරගන්නවා
    const recommendedPlaylists = await fetchYouTubePlaylists(detectedEmotion);

    const log = await SupportLog.create({
      user: req.user._id,
      moodEntry: moodEntryId || null,
      detectedEmotion,
      supportResponse,
      recommendations,
    });

    res.json({
      message: "Support response generated successfully",
      data: {
        detectedEmotion,
        supportResponse,
        recommendations,
        youtubePlaylists: recommendedPlaylists, // අලුතින් යවන YouTube Data එක (Playlists)
        log,
      },
    });
  } catch (error) {
    console.error("Support Generation Error:", error);
    res.status(500).json({ message: "Support generation failed", error: error.message });
  }
};

module.exports = {
  getSupportResponse,
};