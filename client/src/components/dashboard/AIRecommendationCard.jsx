import { Link } from "react-router-dom";

const EMOTION_EMOJI = {
  joy: "😄",
  calm: "😌",
  stress: "😤",
  anxiety: "😰",
  sadness: "😢",
  anger: "😡",
  fatigue: "😴",
  love: "🥰",
  fear: "😨",
  disgust: "🤢",
  surprise: "😲",
  neutral: "😐",
};

const EMOTION_THEME = {
  joy: {
    ring: "from-yellow-400 to-amber-500",
    soft: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50",
  },
  calm: {
    ring: "from-sky-400 to-cyan-500",
    soft: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800/50",
  },
  stress: {
    ring: "from-rose-400 to-red-500",
    soft: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/50",
  },
  anxiety: {
    ring: "from-orange-400 to-amber-500",
    soft: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/50",
  },
  sadness: {
    ring: "from-violet-400 to-purple-500",
    soft: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800/50",
  },
  anger: {
    ring: "from-pink-500 to-rose-500",
    soft: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800/50",
  },
  fatigue: {
    ring: "from-slate-400 to-slate-600",
    soft: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  },
  love: {
    ring: "from-rose-400 to-pink-500",
    soft: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/50",
  },
  fear: {
    ring: "from-purple-500 to-indigo-500",
    soft: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50",
  },
  disgust: {
    ring: "from-lime-400 to-green-500",
    soft: "bg-lime-50 text-lime-700 border-lime-200 dark:bg-lime-900/30 dark:text-lime-300 dark:border-lime-800/50",
  },
  surprise: {
    ring: "from-teal-400 to-cyan-500",
    soft: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800/50",
  },
  neutral: {
    ring: "from-emerald-400 to-green-500",
    soft: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50",
  },
};

const AIRecommendationCard = ({
  topEmotion = "neutral",
  wellnessLabel = "Not Enough Data",
  positiveCount = 0,
  stressCount = 0,
}) => {
  const recommendationText =
    topEmotion === "stress" || topEmotion === "anxiety"
      ? "Try a five-minute breathing exercise or write a short reflection to reduce mental pressure."
      : topEmotion === "sadness"
      ? "A gentle journal prompt or supportive content may help improve your emotional state today."
      : topEmotion === "joy" || topEmotion === "calm"
      ? "You are doing well. Keep your positive momentum going with gratitude journaling or a mindful break."
      : topEmotion === "anger"
      ? "Take a short pause, breathe deeply, and reflect before reacting. A calm reset may help."
      : topEmotion === "fatigue"
      ? "Your recent mood suggests low energy. Prioritize rest, hydration, and lighter daily goals."
      : topEmotion === "fear"
      ? "Grounding techniques and reassurance-focused reflection may help reduce emotional discomfort."
      : topEmotion === "love"
      ? "You are experiencing warm positive emotion. Capture this moment through gratitude or connection-focused journaling."
      : topEmotion === "surprise"
      ? "Take a moment to process the unexpected event and reflect on how it is affecting your thoughts."
      : topEmotion === "disgust"
      ? "A short reset, distraction, or calming activity may help shift your emotional state."
      : "Record a journal entry or mood check-in to receive more personalized recommendations.";

  const topEmotionEmoji = EMOTION_EMOJI[topEmotion] || "😐";
  const emotionTheme = EMOTION_THEME[topEmotion] || EMOTION_THEME.neutral;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${emotionTheme.ring}`} />
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sky-100/40 blur-2xl dark:bg-slate-700/20" />

      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          AI Recommendation
        </p>

        <div className="mt-4 rounded-[1.5rem] border border-sky-100 bg-gradient-to-br from-sky-50/90 via-white to-teal-50/80 p-5 shadow-inner dark:border-slate-700 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950">
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Based on your recent emotional pattern
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl shadow-lg ${emotionTheme.ring}`}>
              <span>{topEmotionEmoji}</span>
            </div>

            <div>
              <h3 className="text-xl font-semibold capitalize text-slate-800 dark:text-white">
                Top emotion: {topEmotion}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Personalized guidance generated from your current mood pattern
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-100 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-800/70">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {recommendationText}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${emotionTheme.soft}`}>
              Mood: {topEmotion}
            </span>

            <span className="rounded-full border border-sky-200 bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-800/50 dark:bg-sky-900/30 dark:text-sky-300">
              Wellness: {wellnessLabel}
            </span>

            <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/30 dark:text-emerald-300">
              Positive: {positiveCount}
            </span>

            <span className="rounded-full border border-rose-200 bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:border-rose-800/50 dark:bg-rose-900/30 dark:text-rose-300">
              Stress signals: {stressCount}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/support"
              className="inline-flex items-center rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:from-slate-700 hover:to-slate-800 dark:from-slate-700 dark:to-slate-800 dark:hover:from-slate-600 dark:hover:to-slate-700"
            >
              View Support Options
            </Link>

            <Link
              to="/journal"
              className="inline-flex items-center rounded-2xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-sky-300 dark:hover:bg-slate-700"
            >
              Write Reflection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationCard;