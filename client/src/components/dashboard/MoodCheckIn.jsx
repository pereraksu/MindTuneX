import { useState } from "react";
import { saveMoodApi } from "../../api/moodApi";

const EMOTION_EMOJI = {
  joy: "😄",
  calm: "😌",
  love: "🥰",
  surprise: "😲",
  neutral: "😐",
  fatigue: "😴",
  stress: "😤",
  anxiety: "😰",
  sadness: "😢",
  anger: "😡",
  fear: "😨",
  disgust: "🤢",
};

const QUICK_MOODS = [
  { key: "joy", label: "Joy" },
  { key: "calm", label: "Calm" },
  { key: "love", label: "Love" },
  { key: "surprise", label: "Surprise" },
  { key: "neutral", label: "Neutral" },
  { key: "fatigue", label: "Fatigue" },
  { key: "stress", label: "Stress" },
  { key: "anxiety", label: "Anxiety" },
  { key: "sadness", label: "Sadness" },
  { key: "anger", label: "Anger" },
  { key: "fear", label: "Fear" },
  { key: "disgust", label: "Disgust" },
];

const MoodCheckIn = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");

  const handleClick = async (emotion) => {
    try {
      setLoading(true);
      setSelected(emotion);
      setMessage("");

      // 🎯 Sentiment Logic
      let sentiment = "neutral";

      if (["joy", "calm", "love", "surprise"].includes(emotion)) {
        sentiment = "positive";
      } else {
        sentiment = "negative";
      }

      const payload = {
        inputText: `Quick mood check-in: ${emotion}`,
        predictedEmotion: emotion,
        sentimentLabel: sentiment,
        confidence: 1.0,
        source: "quick_test", // ✅ FIXED
      };

      await saveMoodApi(payload);

      setMessage(`Saved as ${emotion} ${EMOTION_EMOJI[emotion]} ✨`);

      if (onSuccess) onSuccess();

      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setMessage("Failed to save ❌");
    } finally {
      setLoading(false);
      setSelected("");
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 transition-all">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          Quick Check-In
        </p>

        {loading && (
          <div className="flex items-center gap-2 text-xs text-sky-500">
            <div className="h-2 w-2 animate-ping rounded-full bg-sky-400" />
            Saving...
          </div>
        )}
      </div>

      <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
        How are you feeling today?
      </h2>

      {/* GRID */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {QUICK_MOODS.map((mood) => {
          const isActive = selected === mood.key;

          return (
            <button
              key={mood.key}
              onClick={() => handleClick(mood.key)}
              disabled={loading}
              className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-3 transition-all duration-200 active:scale-95
              
              ${
                isActive
                  ? "border-sky-400 bg-sky-50 text-sky-700 ring-2 ring-sky-100 dark:border-sky-500 dark:bg-sky-900/40 dark:text-sky-300"
                  : "border-slate-100 bg-white/60 text-slate-600 hover:border-sky-200 hover:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <span className="text-2xl transition-transform group-hover:scale-110">
                {EMOTION_EMOJI[mood.key]}
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider">
                {loading && isActive ? "..." : mood.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-2 text-center text-sm font-medium text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400 animate-in fade-in zoom-in-95">
          {message}
        </div>
      )}
    </div>
  );
};

export default MoodCheckIn;