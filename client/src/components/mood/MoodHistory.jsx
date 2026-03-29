import React, { useState, useEffect } from "react";
import { getMyMoodsApi } from "../../api/moodApi";

const EMOTION_EMOJI = {
  joy: "😄", calm: "😌", stress: "😤", anxiety: "😰",
  sadness: "😢", anger: "😡", fatigue: "😴", love: "🥰",
  fear: "😨", disgust: "🤢", surprise: "😲", neutral: "😐",
};

// Dark Mode එකට ගැලපෙන පාටවල් Update කළා
const EMOTION_COLORS = {
  stress:  "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50",
  anxiety: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50",
  calm:    "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800/50",
  joy:     "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50",
  fatigue: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  sadness: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800/50",
  anger:   "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800/50",
  love:    "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800/50",
  fear:    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50",
  neutral: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50",
  surprise:"bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800/50",
  disgust: "bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-900/30 dark:text-lime-400 dark:border-lime-800/50",
};

const SENTIMENT_COLORS = {
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-rose-600 dark:text-rose-400",
  neutral:  "text-slate-500 dark:text-slate-400",
};

const formatDate = (dateString) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const MoodHistory = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        setLoading(true);
        const response = await getMyMoodsApi();
        const fetchedMoods = Array.isArray(response) ? response : (response.data || []);
        
        const sortedMoods = fetchedMoods.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setMoods(sortedMoods);
      } catch (err) {
        console.error("Failed to fetch mood history:", err);
        setError("Could not load your history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMoodHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-sky-100 dark:border-slate-700 border-t-teal-500 dark:border-t-teal-400"></div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your mood journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
        <div className="max-w-md rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-rose-200 dark:border-rose-900/50 p-8 text-center shadow-xl">
          <p className="text-rose-600 dark:text-rose-400 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 rounded-2xl bg-white dark:bg-slate-800 px-6 py-3 text-sm font-medium text-rose-600 dark:text-rose-400 shadow-sm hover:bg-rose-50 dark:hover:bg-slate-700 border border-rose-200 dark:border-rose-900/50 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    // Main Background - Dark Mode added
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 p-6 lg:p-8 transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white transition-colors">
              Mood <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-600 dark:from-teal-400 dark:to-sky-400">History</span>
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400 transition-colors">Your complete emotional journey at a glance</p>
          </div>
          
          <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 px-6 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 shadow-inner dark:shadow-none self-start">
            Total Entries: <span className="font-bold text-teal-600 dark:text-teal-400">{moods.length}</span>
          </div>
        </div>

        {/* Empty State */}
        {!moods.length ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl py-20 text-center shadow-xl dark:shadow-none">
            <span className="mb-4 text-6xl opacity-80">📖</span>
            <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200">No entries yet</h3>
            <p className="mt-2 max-w-xs text-slate-400 dark:text-slate-500">
              Start writing in your journal or analysing your mood to see your history here.
            </p>
          </div>
        ) : (
          /* Mood Cards */
          <div className="space-y-6">
            {moods.map((item) => {
              const emoKey = item.predictedEmotion?.toLowerCase() || "neutral";
              const emoji = EMOTION_EMOJI[emoKey] || "😐";
              const emoClass = EMOTION_COLORS[emoKey] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
              const sentColor = SENTIMENT_COLORS[item.sentimentLabel?.toLowerCase()] || "text-slate-500 dark:text-slate-400";
              const confPct = Math.round((item.confidence || 0) * 100);

              return (
                <div
                  key={item._id}
                  className="group relative rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-black/40"
                >
                  {/* Left accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-2 ${emoClass.split(" ")[0]}`} />

                  <div className="p-6 pl-9">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{emoji}</span>
                        <div>
                          <p className="text-xl font-light capitalize text-slate-800 dark:text-white transition-colors">{emoKey}</p>
                          <p className={`text-xs font-medium ${sentColor} transition-colors`}>
                            {item.sentimentLabel || "Neutral"}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium transition-colors">{formatDate(item.createdAt)}</p>
                        <div className="mt-1 flex items-center justify-start sm:justify-end gap-1 text-xs">
                          <span className="font-mono text-teal-600 dark:text-teal-400">{confPct}%</span>
                          <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-teal-400 to-sky-500 dark:from-teal-500 dark:to-sky-400"
                              style={{ width: `${confPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Journal Text */}
                    <div className="mb-5 rounded-2xl bg-white/60 dark:bg-slate-900/50 p-5 text-slate-700 dark:text-slate-200 leading-relaxed border border-transparent dark:border-slate-700/50 transition-colors">
                      "{item.inputText || item.text || item.content}"
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="rounded-2xl bg-white/60 dark:bg-slate-900/40 p-3 border border-transparent dark:border-slate-700/50 transition-colors">
                        <p className="text-slate-400 dark:text-slate-500 mb-1">Confidence</p>
                        <p className="font-semibold text-teal-600 dark:text-teal-400">{confPct}%</p>
                      </div>
                      <div className="rounded-2xl bg-white/60 dark:bg-slate-900/40 p-3 border border-transparent dark:border-slate-700/50 transition-colors">
                        <p className="text-slate-400 dark:text-slate-500 mb-1">Recommendation</p>
                        <p className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                          {item.recommendationType?.replace(/_/g, " ") || "General"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/60 dark:bg-slate-900/40 p-3 border border-transparent dark:border-slate-700/50 transition-colors">
                        <p className="text-slate-400 dark:text-slate-500 mb-1">Support Level</p>
                        <p className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                          {item.supportLevel || "Moderate"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodHistory;