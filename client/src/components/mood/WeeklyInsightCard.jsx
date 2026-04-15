import React, { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { getMyMoodsApi } from "../../api/moodApi";

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

const EMOTION_COLORS = {
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

const SENTIMENT_COLORS = {
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-rose-600 dark:text-rose-400",
  neutral: "text-slate-500 dark:text-slate-400",
};

const WeeklyInsights = () => {
  const { user, logout, isAdmin } = useAuth();

  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndCalculateInsights = async () => {
      try {
        setLoading(true);

        const response = await getMyMoodsApi();
        const allMoods = Array.isArray(response)
          ? response
          : Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
          ? response.data
          : [];

        if (allMoods.length === 0) {
          setInsight(null);
          return;
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentMoods = allMoods.filter(
          (m) => m.createdAt && new Date(m.createdAt) >= sevenDaysAgo
        );

        if (recentMoods.length === 0) {
          setInsight(null);
          return;
        }

        const emotionCounts = {};
        let posCount = 0;
        let negCount = 0;

        recentMoods.forEach((m) => {
          const emo = m.predictedEmotion?.toLowerCase() || "neutral";
          emotionCounts[emo] = (emotionCounts[emo] || 0) + 1;

          if (m.sentimentLabel === "positive") posCount++;
          if (m.sentimentLabel === "negative") negCount++;
        });

        let topEmotion = "neutral";
        let maxCount = 0;

        for (const [emo, count] of Object.entries(emotionCounts)) {
          if (count > maxCount) {
            maxCount = count;
            topEmotion = emo;
          }
        }

        let avgSentiment = "Neutral";
        if (posCount > negCount) avgSentiment = "Positive";
        else if (negCount > posCount) avgSentiment = "Negative";

        const summaryText = `Over the past week, you've checked in ${recentMoods.length} times. Your most common emotional state has been ${topEmotion}, contributing to a generally ${avgSentiment.toLowerCase()} emotional trend. Keep tracking your moods consistently to strengthen self-awareness and emotional balance.`;

        setInsight({
          totalEntries: recentMoods.length,
          avgSentiment,
          topEmotion,
          emotionCounts,
          summaryText,
        });
      } catch (err) {
        console.error("Failed to load insights:", err);
        setInsight(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateInsights();
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
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl animate-in fade-in slide-in-from-left-4 duration-700 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none lg:p-8">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-500 via-sky-500 to-cyan-500" />
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-100/50 blur-3xl dark:bg-sky-900/20" />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                  7 Day Emotional Analytics
                </p>
                <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white">
                  Weekly{" "}
                  <span className="bg-gradient-to-r from-teal-500 to-sky-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-sky-400">
                    Insights
                  </span>
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Your emotional landscape, dominant mood patterns, and weekly wellbeing summary.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-teal-500 dark:border-slate-700 dark:border-t-teal-400" />
              </div>
            ) : !insight ? (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white/70 py-20 text-center shadow-xl backdrop-blur-xl animate-in fade-in duration-700 dark:border-slate-700 dark:bg-slate-800/40 dark:shadow-none">
                <span className="mb-4 text-6xl opacity-80">📊</span>
                <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200">
                  Not enough data for this week
                </h3>
                <p className="mt-2 max-w-xs text-slate-400 dark:text-slate-500">
                  Keep logging your moods daily to unlock weekly trends and emotional insights.
                </p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Top Stats */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <StatCard
                    label="Total Entries"
                    value={insight.totalEntries}
                    subtitle="this week"
                  />

                  <StatCard
                    label="Average Sentiment"
                    value={insight.avgSentiment || "Neutral"}
                    subtitle="overall weekly tone"
                    valueClassName={
                      SENTIMENT_COLORS[insight.avgSentiment?.toLowerCase()] ||
                      "text-slate-700 dark:text-slate-300"
                    }
                  />

                  <div className="rounded-[1.75rem] border border-white/60 bg-white/75 p-6 shadow-xl shadow-sky-100/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      Top Emotion
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-5xl">
                        {EMOTION_EMOJI[insight.topEmotion?.toLowerCase()] || "😐"}
                      </span>
                      <span className="text-3xl font-light capitalize text-slate-800 dark:text-white">
                        {insight.topEmotion || "None"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {insight.summaryText && (
                  <div className="relative rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                    <div className="absolute -left-1 -top-1 text-7xl opacity-10 dark:opacity-5 text-slate-800 dark:text-white">
                      ❞
                    </div>

                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-400">
                      <span className="text-xl">✦</span> Weekly Summary
                    </h3>

                    <p className="text-[0.98rem] leading-relaxed text-slate-700 dark:text-slate-300">
                      {insight.summaryText}
                    </p>
                  </div>
                )}

                {/* Emotion Breakdown */}
                <div className="rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-xl shadow-sky-100/30 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                  <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    Emotion Breakdown (Last 7 Days)
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(insight.emotionCounts || {})
                      .sort((a, b) => b[1] - a[1])
                      .map(([key, count]) => {
                        const emoKey = key.toLowerCase();
                        const emoji = EMOTION_EMOJI[emoKey] || "😐";
                        const emoClass =
                          EMOTION_COLORS[emoKey] ||
                          "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300";

                        return (
                          <div
                            key={key}
                            className={`flex items-center gap-3 rounded-[1.5rem] border px-4 py-3 shadow-sm transition hover:-translate-y-0.5 ${emoClass}`}
                          >
                            <span className="text-2xl">{emoji}</span>
                            <div className="flex-1">
                              <p className="font-medium capitalize">{key}</p>
                            </div>
                            <span className="rounded-3xl bg-white px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, subtitle, valueClassName = "text-slate-800 dark:text-white" }) => {
  return (
    <div className="rounded-[1.75rem] border border-white/60 bg-white/75 p-6 shadow-xl shadow-sky-100/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className={`mt-3 text-4xl font-light capitalize ${valueClassName}`}>
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
        {subtitle}
      </p>
    </div>
  );
};

export default WeeklyInsights;