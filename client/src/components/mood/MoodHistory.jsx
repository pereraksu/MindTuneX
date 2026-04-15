import React, { useState, useEffect } from "react";
import { getMyMoodsApi } from "../../api/moodApi";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../../context/AuthContext";

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

const EMOTION_BADGE = {
  stress:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50",
  anxiety:
    "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50",
  calm:
    "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800/50",
  joy:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50",
  fatigue:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  sadness:
    "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800/50",
  anger:
    "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800/50",
  love:
    "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50",
  fear:
    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50",
  neutral:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50",
  surprise:
    "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800/50",
  disgust:
    "bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-900/30 dark:text-lime-400 dark:border-lime-800/50",
};

const EMOTION_ACCENT = {
  stress: "bg-red-500",
  anxiety: "bg-orange-500",
  calm: "bg-sky-500",
  joy: "bg-yellow-500",
  fatigue: "bg-slate-500",
  sadness: "bg-violet-500",
  anger: "bg-pink-500",
  love: "bg-rose-500",
  fear: "bg-purple-500",
  neutral: "bg-green-500",
  surprise: "bg-teal-500",
  disgust: "bg-lime-500",
};

const SENTIMENT_COLORS = {
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-rose-600 dark:text-rose-400",
  neutral: "text-slate-500 dark:text-slate-400",
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
  const { user, logout, isAdmin } = useAuth();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyMoodsApi();
        const fetchedMoods = Array.isArray(response)
          ? response
          : Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
          ? response.data
          : [];

        const sortedMoods = [...fetchedMoods].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 transition-colors duration-500 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_25%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_25%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.10),transparent_30%)]" />

      <Sidebar />

      <div className="relative flex flex-1 flex-col">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-5xl space-y-8">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none lg:p-8">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-500 via-sky-500 to-cyan-500" />
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-100/50 blur-3xl dark:bg-sky-900/20" />

              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    Emotional Timeline
                  </p>
                  <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white">
                    Mood{" "}
                    <span className="bg-gradient-to-r from-teal-500 to-sky-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-sky-400">
                      History
                    </span>
                  </h1>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Your complete emotional journey, entries, and AI insights in one place.
                  </p>
                </div>

                <div className="self-start rounded-3xl border border-white/60 bg-white/70 px-6 py-3 text-sm font-medium text-slate-600 shadow-inner dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                  Total Entries:{" "}
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {moods.length}
                  </span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[40vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-9 w-9 animate-spin rounded-full border-4 border-sky-100 border-t-teal-500 dark:border-slate-700 dark:border-t-teal-400" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Loading your mood journey...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex min-h-[40vh] items-center justify-center">
                <div className="max-w-md rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-xl dark:border-rose-900/50 dark:bg-rose-950/20">
                  <p className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-6 rounded-2xl border border-rose-200 bg-white px-6 py-3 text-sm font-medium text-rose-600 shadow-sm transition dark:border-rose-900/40 dark:bg-slate-800 dark:text-rose-400"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : !moods.length ? (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white/60 py-20 text-center backdrop-blur-xl dark:border-slate-700 dark:bg-slate-800/40">
                <span className="mb-4 text-6xl opacity-80">📖</span>
                <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200">
                  No entries yet
                </h3>
                <p className="mt-2 max-w-xs text-slate-400 dark:text-slate-500">
                  Start writing in your journal to build your emotional history.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {moods.map((item) => {
                  const emoKey = item.predictedEmotion?.toLowerCase() || "neutral";
                  const emoji = EMOTION_EMOJI[emoKey] || "😐";
                  const emoClass =
                    EMOTION_BADGE[emoKey] ||
                    "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
                  const accentClass = EMOTION_ACCENT[emoKey] || "bg-slate-400";
                  const sentColor =
                    SENTIMENT_COLORS[item.sentimentLabel?.toLowerCase()] ||
                    "text-slate-500 dark:text-slate-400";
                  const confPct = Math.max(
                    0,
                    Math.min(100, Math.round((item.confidence || 0) * 100))
                  );

                  return (
                    <div
                      key={item._id}
                      className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 shadow-2xl shadow-sky-100/30 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentClass}`} />

                      <div className="p-6 pl-8">
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{emoji}</span>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xl font-light capitalize text-slate-800 dark:text-white">
                                  {emoKey}
                                </p>
                                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${emoClass}`}>
                                  {item.sentimentLabel || "neutral"}
                                </span>
                              </div>
                              <p className={`mt-1 text-xs font-medium ${sentColor}`}>
                                {item.sentimentLabel || "Neutral"} sentiment
                              </p>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                              {formatDate(item.createdAt)}
                            </p>
                            <div className="mt-2 flex items-center gap-2 sm:justify-end">
                              <span className="text-xs font-mono text-teal-600 dark:text-teal-400">
                                {confPct}%
                              </span>
                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                <div
                                  className="h-full bg-gradient-to-r from-teal-400 to-sky-500"
                                  style={{ width: `${confPct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-5 rounded-[1.5rem] border border-transparent bg-white/60 p-5 leading-relaxed dark:border-slate-700/50 dark:bg-slate-900/50">
                          {item.title && (
                            <h4 className="mb-2 text-lg font-bold text-slate-900 underline decoration-teal-500/30 dark:text-white">
                              {item.title}
                            </h4>
                          )}

                          <p
                            className={
                              item.source === "journal"
                                ? "text-base font-normal text-slate-700 dark:text-slate-200"
                                : "text-sm italic opacity-80 text-slate-700 dark:text-slate-300"
                            }
                          >
                            “{item.text || item.inputText || item.content || "No details provided"}”
                          </p>

                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {item.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="rounded-full border border-teal-200/50 bg-teal-100/50 px-3 py-1 text-[10px] font-medium text-teal-700 dark:border-teal-800/50 dark:bg-teal-900/30 dark:text-teal-300"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
                          <InfoBox
                            label="Source"
                            value={item.source || "Manual"}
                            accent="text-teal-600 dark:text-teal-400"
                          />
                          <InfoBox
                            label="Recommendation"
                            value={
                              item.recommendationType?.replace(/_/g, " ") ||
                              "General Reflection"
                            }
                          />
                          <InfoBox
                            label="Support Level"
                            value={item.supportLevel || "Moderate"}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value, accent = "text-slate-700 dark:text-slate-300" }) => {
  return (
    <div className="rounded-2xl border border-transparent bg-white/60 p-3 dark:border-slate-700/50 dark:bg-slate-900/40">
      <p className="mb-1 text-slate-400 dark:text-slate-500">{label}</p>
      <p className={`font-medium capitalize ${accent}`}>{value}</p>
    </div>
  );
};

export default MoodHistory;