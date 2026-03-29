import { useState } from "react";
import { saveMoodApi } from "../../api/moodApi";

const EMOTION_EMOJI = {
  joy: "😄",
  calm: "😌",
  stress: "😤",
  anxiety: "😰",
  sadness: "😢",
  neutral: "😐",
};

const QUICK_MOODS = [
  { key: "joy", label: "Joy" },
  { key: "calm", label: "Calm" },
  { key: "stress", label: "Stress" },
  { key: "anxiety", label: "Anxiety" },
  { key: "sadness", label: "Sadness" },
  { key: "neutral", label: "Neutral" },
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

      const payload = {
        inputText: `Quick mood check-in: ${emotion}`,
        predictedEmotion: emotion,
        sentimentLabel:
          emotion === "joy" || emotion === "calm"
            ? "positive"
            : emotion === "neutral"
            ? "neutral"
            : "negative",
        confidence: 1,
        source: "quick-check-in",
      };

      await saveMoodApi(payload);

      setMessage(`Saved as ${emotion} ✅`);

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
    <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400">
        Quick Mood Check-In
      </p>

      <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
        How are you feeling today?
      </h2>

      <p className="mt-2 text-slate-500 dark:text-slate-300">
        Click one mood to quickly log your feeling.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {QUICK_MOODS.map((mood) => {
          const isLoading = loading && selected === mood.key;

          return (
            <button
              key={mood.key}
              onClick={() => handleClick(mood.key)}
              disabled={loading}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                isLoading
                  ? "border-sky-300 bg-sky-100 text-sky-700 dark:border-sky-500 dark:bg-sky-900/40 dark:text-sky-300"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span>{EMOTION_EMOJI[mood.key]}</span>
              <span>{isLoading ? "Saving..." : mood.label}</span>
            </button>
          );
        })}
      </div>

      {message && (
        <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-2 text-sm text-sky-700 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
          {message}
        </div>
      )}
    </div>
  );
};

export default MoodCheckIn;