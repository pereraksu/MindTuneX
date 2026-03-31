import { useState } from "react";
import { saveMoodApi } from "../../api/moodApi";

// 🚨 Emotions 12ම ඇතුළත් කළා
const EMOTION_EMOJI = {
  joy: "😄", calm: "😌", love: "🥰", surprise: "😲",
  neutral: "😐", fatigue: "😴", stress: "😤", anxiety: "😰",
  sadness: "😢", anger: "😡", fear: "😨", disgust: "🤢"
};

const QUICK_MOODS = [
  { key: "joy", label: "Joy" },
  { key: "calm", label: "Calm" },
  { key: "love", label: "Love" },
  { key: "surprise", label: "Surprise" },
  { key: "neutral", label: "Neutral" },
  { key: "fatigue", label: "Fatigue" },
  { key: "stress", label: "Stress" },
  { key: "anxiety", label: "Anxious" },
  { key: "sadness", label: "Sadness" },
  { key: "anger", label: "Angry" },
  { key: "fear", label: "Fearful" },
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

      // 🚨 Sentiment එක තීරණය කිරීමේ logic එක (Professional approach)
      let sentiment = "neutral";
      if (["joy", "calm", "love", "surprise"].includes(emotion)) {
        sentiment = "positive";
      } else if (["stress", "anxiety", "sadness", "anger", "fear", "disgust", "fatigue"].includes(emotion)) {
        sentiment = "negative";
      }

      const payload = {
        inputText: `Quick mood check-in: ${emotion}`,
        predictedEmotion: emotion,
        sentimentLabel: sentiment,
        confidence: 1.0,
        source: "quick-check-in",
      };

      await saveMoodApi(payload);
      setMessage(`Logged as ${emotion} ${EMOTION_EMOJI[emotion]} ✨`);

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setMessage("Error saving mood ❌");
    } finally {
      setLoading(false);
      setSelected("");
    }
  };

  return (
    <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none transition-all">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Quick Mood Check-In
        </p>
        {loading && (
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
        )}
      </div>

      <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white transition-colors">
        How are you feeling today?
      </h2>

      {/* 🚨 Responsive Grid එකක් පාවිච්චි කළා Emotions 12ටම ඉඩ ලැබෙන්න */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {QUICK_MOODS.map((mood) => {
          const isThisSelected = selected === mood.key;

          return (
            <button
              key={mood.key}
              onClick={() => handleClick(mood.key)}
              disabled={loading}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl border p-3 transition-all duration-200 active:scale-95 ${
                isThisSelected
                  ? "border-sky-400 bg-sky-50 text-sky-700 ring-2 ring-sky-100 dark:border-sky-500 dark:bg-sky-900/40 dark:text-sky-300"
                  : "border-slate-100 bg-white/50 text-slate-600 hover:border-sky-200 hover:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <span className="text-2xl">{EMOTION_EMOJI[mood.key]}</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {loading && isThisSelected ? "..." : mood.label}
              </span>
            </button>
          );
        })}
      </div>

      {message && (
        <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-2 text-center text-sm font-medium text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400 animate-in fade-in zoom-in-95">
          {message}
        </div>
      )}
    </div>
  );
};

export default MoodCheckIn;