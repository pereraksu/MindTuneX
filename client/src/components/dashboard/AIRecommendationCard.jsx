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

const AIRecommendationCard = ({
  topEmotion = "neutral",
  wellnessLabel = "Not Enough Data",
  positiveCount = 0,
  stressCount = 0,
}) => {
  const recommendationText =
    topEmotion === "stress" || topEmotion === "anxiety"
      ? "Try a 5-minute breathing exercise or write a short reflection to reduce mental pressure."
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
      : "Record a journal entry or mood check-in to receive more personalized recommendations.";

  const topEmotionEmoji = EMOTION_EMOJI[topEmotion] || "😐";

  return (
    <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400">
        AI Recommendation
      </p>

      <div className="mt-4 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-teal-50 p-5 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Based on your recent emotional pattern
        </p>

        <h3 className="mt-3 flex items-center gap-2 text-xl font-semibold capitalize text-slate-800 dark:text-white">
          <span>{topEmotionEmoji}</span>
          <span>Top emotion: {topEmotion}</span>
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {recommendationText}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
            Wellness: {wellnessLabel}
          </span>

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            Positive: {positiveCount}
          </span>

          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
            Stress signals: {stressCount}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/support"
            className="inline-block rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            View Support Options
          </Link>

          <Link
            to="/journal"
            className="inline-block rounded-2xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-sky-300 dark:hover:bg-slate-700"
          >
            Write Reflection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationCard;