import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyMoodsApi } from "../api/moodApi";
import { getWeeklyInsightsApi } from "../api/insightApi";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import EmotionPieChart from "../components/charts/EmotionPieChart";
import SentimentTrendChart from "../components/charts/SentimentTrendChart";
import MoodWordCloud from "../components/charts/MoodWordCloud";

import MoodCheckIn from "../components/dashboard/MoodCheckIn";
import AIRecommendationCard from "../components/dashboard/AIRecommendationCard";
import BadgesCard from "../components/dashboard/BadgesCard";

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
        : Array.isArray(moodsRes?.data?.data)
        ? moodsRes.data.data
        : [];

      const insightData =
        insightRes?.data?.data || insightRes?.data || insightRes || null;

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

  const stressCount = moods.filter((m) =>
    ["stress", "anxiety", "sadness", "anger", "fear"].includes(m.predictedEmotion)
  ).length;

  const positiveCount = moods.filter((m) =>
    ["joy", "calm", "love"].includes(m.predictedEmotion)
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
      ? "You are doing well. Keep your positive momentum going."
      : "Record a journal entry to receive personalized recommendations.";

  const latestEmotionEmoji = EMOTION_EMOJI[latestEmotion] || "😐";

  const journalingStreak = useMemo(() => {
    if (!moods.length) return 0;

    const uniqueDays = [
      ...new Set(
        moods
          .filter((m) => m.createdAt)
          .map((m) => new Date(m.createdAt).toISOString().split("T")[0])
      ),
    ].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < uniqueDays.length; i++) {
      const compareDate = currentDate.toISOString().split("T")[0];

      if (uniqueDays[i] === compareDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (i === 0) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (uniqueDays[i] === yesterday.toISOString().split("T")[0]) {
          streak++;
          currentDate = yesterday;
          currentDate.setDate(currentDate.getDate() - 1);
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
    <div className="relative flex min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-500">
      <div className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.20),transparent_25%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_25%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.12),transparent_30%)]" />

      <Sidebar forceAdmin={false} />

      <div className="relative flex flex-1 flex-col">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 dark:text-sky-400">
                  MindTuneX Overview
                </p>
                <h1 className="mt-2 font-serif text-4xl lg:text-5xl font-semibold tracking-tight text-slate-800 dark:text-white">
                  Analytics{" "}
                  <span className="bg-gradient-to-r from-teal-500 via-sky-500 to-cyan-600 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>
                <p className="mt-3 text-slate-500 dark:text-slate-300 text-base">
                  Welcome back,{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-100">
                    {user?.fullName || "User"}
                  </span>{" "}
                  ✨ Here is your emotional wellness summary.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/journal"
                  className="rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/60 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:from-sky-700 hover:to-cyan-700"
                >
                  New Journal Entry
                </Link>
                <Link
                  to="/support"
                  className="rounded-2xl border border-sky-200/70 bg-white/80 backdrop-blur px-5 py-3 text-sm font-semibold text-sky-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-800/80 dark:text-sky-300"
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

            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 text-left">
              <StatCard
                title="TOTAL ENTRIES"
                val={totalEntries}
                desc="Saved records"
                color="from-sky-500 to-cyan-500"
              />
              <StatCard
                title="LATEST MOOD"
                val={latestEmotion}
                desc="Analyzed state"
                emoji={latestEmotionEmoji}
                color="from-amber-400 to-orange-500"
              />
              <StatCard
                title="SENTIMENT"
                val={averageSentiment}
                desc="Weekly balance"
                color="from-emerald-400 to-teal-500"
              />
              <StatCard
                title="TOP MOOD"
                val={topEmotion}
                desc="Most frequent"
                color="from-violet-500 to-fuchsia-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 text-left">
              <ChartWrapper
                title="Sentiment Trend"
                subtitle="Track how your emotional polarity changes over time"
              >
                <SentimentTrendChart moods={moods} />
              </ChartWrapper>

              <ChartWrapper
                title="Emotion Distribution"
                subtitle="See the share of each detected emotional state"
              >
                <EmotionPieChart insight={insight} />
              </ChartWrapper>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-2xl shadow-sky-100/50 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 text-left transition-all">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                  Deep Insights
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-800 dark:text-white transition-colors">
                  Frequent Emotional Triggers
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 italic">
                  Keywords extracted from your saved journal entries and mood logs.
                </p>
              </div>

              <div className="h-[350px] w-full overflow-hidden rounded-3xl border border-slate-100 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                {loading ? (
                  <div className="h-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                ) : (
                  <MoodWordCloud moods={moods} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 text-left">
              <div className="xl:col-span-2 flex flex-col gap-6">
                <div className="rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-2xl shadow-sky-100/50 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Weekly Wellness Summary
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                    Emotional health overview
                  </h3>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <SummaryItem
                      label="Wellness Status"
                      val={wellnessLabel}
                      bg="bg-sky-50 dark:bg-sky-900/20"
                    />
                    <SummaryItem
                      label="Positive Entries"
                      val={positiveCount}
                      bg="bg-emerald-50 dark:bg-emerald-900/20"
                    />
                    <SummaryItem
                      label="Stress Signals"
                      val={stressCount}
                      bg="bg-rose-50 dark:bg-rose-900/20"
                    />
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InsightBox
                      title="Insight Summary"
                      text={`A total of ${totalEntries} entries were recorded. The dominant mood was ${topEmotion}. Overall emotional balance appears ${wellnessLabel.toLowerCase()}.`}
                    />
                    <InsightBox
                      title="Suggested Next Step"
                      text={recommendationText}
                      showLinks
                    />
                  </div>
                </div>

                <BadgesCard moods={moods} streak={journalingStreak} />
              </div>

              <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-2xl shadow-sky-100/50 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-white">
                      Recent Logs
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Your latest emotional entries
                    </p>
                  </div>
                  <Link
                    to="/mood-history"
                    className="text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
                  >
                    View All
                  </Link>
                </div>

                <div className="max-h-[650px] space-y-4 overflow-y-auto pr-1">
                  {moods.length > 0 ? (
                    moods.slice(0, 5).map((item) => (
                      <HistoryItem key={item._id} item={item} />
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
                      No recent entries found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ title, val, desc, emoji, color }) => (
  <div className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-sky-200/60 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
    <div className={`absolute inset-x-0 top-0 h-1.5 rounded-t-[2rem] bg-gradient-to-r ${color}`} />
    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-slate-100/50 blur-2xl dark:bg-slate-700/20" />

    <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
      {title}
    </p>

    <div className="mt-3 flex items-center gap-3">
      {emoji && <span className="text-4xl drop-shadow-sm">{emoji}</span>}
      <p className="text-3xl lg:text-4xl font-light capitalize text-slate-800 dark:text-white">
        {val}
      </p>
    </div>

    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
  </div>
);

const ChartWrapper = ({ title, subtitle, children }) => (
  <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
      {title}
    </p>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    <div className="mt-5 h-96">{children}</div>
  </div>
);

const SummaryItem = ({ label, val, bg }) => (
  <div
    className={`rounded-2xl border border-slate-100 ${bg} p-4 transition-colors dark:border-slate-700 dark:bg-slate-800`}
  >
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-2 text-xl font-semibold text-slate-800 dark:text-white">
      {val}
    </p>
  </div>
);

const InsightBox = ({ title, text, showLinks }) => (
  <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 transition-colors dark:border-slate-700 dark:bg-slate-800/80">
    <p className="text-sm font-semibold text-slate-700 dark:text-white">{title}</p>
    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
      {text}
    </p>

    {showLinks && (
      <div className="mt-4 flex gap-3">
        <Link
          to="/journal"
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700 transition"
        >
          Journal
        </Link>
        <Link
          to="/mood-analysis"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          Analyze
        </Link>
      </div>
    )}
  </div>
);

const HistoryItem = ({ item }) => {
  const emoji = EMOTION_EMOJI[item.predictedEmotion] || "😐";
  const date = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : "N/A";

  return (
    <div className="rounded-2xl border border-white/70 bg-white/60 p-4 backdrop-blur-sm transition-all hover:bg-white/85 hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-slate-800">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-200 font-medium">
          {item.inputText || "Check-in entry"}
        </p>
        <span className="shrink-0 font-mono text-[10px] text-slate-400">
          {date}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-3xl bg-teal-50 dark:bg-teal-900/30 px-3 py-1 text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-tighter shadow-sm border border-teal-100 dark:border-teal-800">
          {emoji} {item.predictedEmotion}
        </span>
        <span className="rounded-3xl bg-slate-50 dark:bg-slate-700 px-3 py-1 text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-tighter shadow-sm border border-slate-100 dark:border-slate-600">
          {item.sentimentLabel}
        </span>
      </div>
    </div>
  );
};

export default DashboardPage;