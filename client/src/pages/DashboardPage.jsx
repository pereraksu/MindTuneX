import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyMoodsApi } from "../api/moodApi";
import { getWeeklyInsightsApi } from "../api/insightApi";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import EmotionPieChart from "../components/charts/EmotionPieChart";
import SentimentTrendChart from "../components/charts/SentimentTrendChart";

import MoodCheckIn from "../components/dashboard/MoodCheckIn";
import AIRecommendationCard from "../components/dashboard/AIRecommendationCard";

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

const DashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();

  const [moods, setMoods] = useState([]);
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [moodsRes, insightRes] = await Promise.all([
        getMyMoodsApi(),
        getWeeklyInsightsApi(),
      ]);

      const moodsData = Array.isArray(moodsRes)
        ? moodsRes
        : Array.isArray(moodsRes?.data)
        ? moodsRes.data
        : [];

      const insightData = insightRes?.data || insightRes || null;

      setMoods(moodsData);
      setInsight(insightData);
    } catch (err) {
      console.error("Dashboard load failed:", err);
      setMoods([]);
      setInsight(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalEntries = moods.length;
  const latestEmotion = moods[0]?.predictedEmotion || "N/A";
  const averageSentiment =
    insight?.avgSentiment !== undefined && insight?.avgSentiment !== null
      ? Number(insight.avgSentiment).toFixed(3)
      : "N/A";
  const topEmotion = insight?.topEmotion || "N/A";

  const recentMoods = moods.slice(0, 7);

  const stressCount = moods.filter((m) =>
    ["stress", "anxiety", "sadness", "anger", "fear"].includes(
      m.predictedEmotion
    )
  ).length;

  const positiveCount = moods.filter((m) =>
    ["joy", "calm", "love"].includes(m.predictedEmotion)
  ).length;

  const neutralCount = moods.filter(
    (m) => m.predictedEmotion === "neutral"
  ).length;

  const wellnessLabel =
    averageSentiment !== "N/A"
      ? Number(averageSentiment) >= 0.5
        ? "Good"
        : Number(averageSentiment) >= 0
        ? "Balanced"
        : "Needs Attention"
      : "Not Enough Data";

  const recommendationText =
    topEmotion === "stress" || topEmotion === "anxiety"
      ? "Try a 5-minute breathing exercise or write a short reflection to reduce mental pressure."
      : topEmotion === "sadness"
      ? "A gentle journal prompt or supportive content may help improve your emotional state today."
      : topEmotion === "joy" || topEmotion === "calm"
      ? "You are doing well. Keep your positive momentum going with gratitude journaling or a mindful break."
      : topEmotion === "anger"
      ? "Take a short pause, breathe deeply, and reflect before reacting. A calm reset may help."
      : "Record a journal entry or mood check-in to receive more personalized recommendations.";

  const latestEmotionEmoji = EMOTION_EMOJI[latestEmotion] || "😐";

  const weeklyGoal = 7;
  const weeklyProgress = Math.min(totalEntries, weeklyGoal);
  const progressPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

  const journalingStreak = useMemo(() => {
    if (!moods.length) return 0;

    const uniqueDays = [
      ...new Set(
        moods
          .filter((m) => m.createdAt)
          .map((m) => new Date(m.createdAt).toISOString().split("T")[0])
      ),
    ].sort((a, b) => new Date(b) - new Date(a));

    if (!uniqueDays.length) return 0;

    let streak = 0;
    const today = new Date();
    let currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    for (let i = 0; i < uniqueDays.length; i++) {
      const compareDate = currentDate.toISOString().split("T")[0];

      if (uniqueDays[i] === compareDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (i === 0) {
        const yesterday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 1
        )
          .toISOString()
          .split("T")[0];

        if (uniqueDays[i] === yesterday) {
          streak++;
          currentDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 2
          );
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return streak;
  }, [moods]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Sidebar forceAdmin={false} />

      <div className="flex flex-1 flex-col">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white">
                  Analytics{" "}
                  <span className="bg-gradient-to-r from-teal-500 to-sky-600 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-300">
                  Welcome back,{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-100">
                    {user?.fullName || "User"}
                  </span>{" "}
                  ✨
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/journal"
                  className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700"
                >
                  New Journal Entry
                </Link>

                <Link
                  to="/support"
                  className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-sky-300 dark:hover:bg-slate-700"
                >
                  Get Support
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <MoodCheckIn onSuccess={loadDashboardData} />
              </div>

              <AIRecommendationCard
                topEmotion={topEmotion}
                wellnessLabel={wellnessLabel}
                positiveCount={positiveCount}
                stressCount={stressCount}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              <div className="group relative rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-sky-400 to-teal-400" />
                <p className="text-xs font-medium tracking-widest text-slate-400 dark:text-slate-400">
                  TOTAL MOOD ENTRIES
                </p>
                <p className="mt-2 text-5xl font-light text-slate-800 dark:text-white">
                  {totalEntries}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  All saved records
                </p>
              </div>

              <div className="group relative rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-amber-400 to-orange-400" />
                <p className="text-xs font-medium tracking-widest text-slate-400 dark:text-slate-400">
                  LATEST EMOTION
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-4xl">{latestEmotionEmoji}</span>
                  <p className="text-4xl font-light capitalize text-slate-800 dark:text-white">
                    {latestEmotion}
                  </p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  Detected mood
                </p>
              </div>

              <div className="group relative rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-emerald-400 to-teal-400" />
                <p className="text-xs font-medium tracking-widest text-slate-400 dark:text-slate-400">
                  AVG SENTIMENT
                </p>
                <p className="mt-2 text-5xl font-light text-slate-800 dark:text-white">
                  {averageSentiment}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  Weekly balance
                </p>
              </div>

              <div className="group relative rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-violet-400 to-fuchsia-400" />
                <p className="text-xs font-medium tracking-widest text-slate-400 dark:text-slate-400">
                  TOP EMOTION
                </p>
                <p className="mt-2 text-5xl font-light capitalize text-slate-800 dark:text-white">
                  {topEmotion}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  Most frequent
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400">
                  Sentiment Trend
                </p>
                <div className="h-96">
                  <SentimentTrendChart moods={moods} />
                </div>
              </div>

              <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400">
                  Emotion Distribution
                </p>
                <div className="h-96">
                  <EmotionPieChart insight={insight} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2 rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-sky-100/50 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400">
                    Weekly Wellness Summary
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                    Your emotional wellness at a glance
                  </h3>

                  <p className="mt-2 text-slate-500 dark:text-slate-300">
                    Here is a quick overview of how your week is going
                    emotionally.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-400">
                        Wellness Status
                      </p>
                      <p className="mt-2 text-xl font-semibold text-slate-800 dark:text-white">
                        {wellnessLabel}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-400">
                        Positive Entries
                      </p>
                      <p className="mt-2 text-xl font-semibold text-slate-800 dark:text-white">
                        {positiveCount}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-400">
                        Stress Signals
                      </p>
                      <p className="mt-2 text-xl font-semibold text-slate-800 dark:text-white">
                        {stressCount}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 dark:border-slate-700 dark:bg-slate-800/80">
                      <p className="text-sm font-semibold text-slate-700 dark:text-white">
                        Insight Summary
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        You have recorded{" "}
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {totalEntries}
                        </span>{" "}
                        total entries. Your dominant emotional pattern appears to
                        be{" "}
                        <span className="font-semibold capitalize text-slate-800 dark:text-white">
                          {topEmotion}
                        </span>{" "}
                        and your overall weekly sentiment suggests a{" "}
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {String(wellnessLabel).toLowerCase()}
                        </span>{" "}
                        emotional state.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 dark:border-slate-700 dark:bg-slate-800/80">
                      <p className="text-sm font-semibold text-slate-700 dark:text-white">
                        Suggested Next Step
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {recommendationText}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          to="/journal"
                          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                        >
                          Journal Now
                        </Link>
                        <Link
                          to="/mood-analysis"
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                        >
                          See Analysis
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-white">
                    <span className="text-xl">〇</span> Recent Entries
                  </p>

                  <Link
                    to="/mood-history"
                    className="text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                  >
                    View Full History
                  </Link>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-20 animate-pulse rounded-2xl bg-slate-100/70 dark:bg-slate-800"
                      />
                    ))}
                  </div>
                ) : recentMoods.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-10 text-center dark:border-slate-700 dark:bg-slate-800/70">
                    <p className="text-4xl">📝</p>
                    <p className="mt-3 text-slate-500 dark:text-slate-300">
                      No entries yet. Start journaling!
                    </p>
                  </div>
                ) : (
                  <div className="max-h-105 space-y-5 overflow-y-auto pr-1">
                    {recentMoods.slice(0, 5).map((item) => (
                      <HistoryItem key={item._id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400">
                  Positive Balance
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                  {positiveCount}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Entries marked as positive emotions
                </p>
              </div>

              <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400">
                  Neutral Moments
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                  {neutralCount}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Calm or neutral emotional states
                </p>
              </div>

              <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400">
                  Emotional Focus
                </p>
                <p className="mt-2 text-2xl font-semibold capitalize text-slate-800 dark:text-white">
                  {topEmotion}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Most frequently detected emotion this week
                </p>
              </div>

              <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400">
                  Journaling Goal
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                  {weeklyProgress}/{weeklyGoal}
                </p>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-teal-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                  Streak: {journalingStreak} day{journalingStreak === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const HistoryItem = ({ item }) => {
  const emoji = EMOTION_EMOJI[item.predictedEmotion] || "😐";
  const date = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : "N/A";

  return (
    <div className="rounded-2xl border border-white/70 bg-white/60 p-4 backdrop-blur-sm transition hover:bg-white/80 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-slate-800">
      <div className="mb-3 flex items-start justify-between">
        <p className="line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-200">
          {item.inputText || "No text available"}
        </p>
        <span className="ml-3 whitespace-nowrap font-mono text-xs text-slate-400 dark:text-slate-400">
          {date}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-3xl bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
          {emoji} {item.predictedEmotion}{" "}
          {item.confidence ? `${Math.round(item.confidence * 100)}%` : ""}
        </span>

        <span className="rounded-3xl bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          {item.sentimentLabel || "neutral"}
        </span>
      </div>
    </div>
  );
};

export default DashboardPage;