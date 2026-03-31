import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyMoodsApi } from "../api/moodApi";
import { getWeeklyInsightsApi } from "../api/insightApi";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import EmotionPieChart from "../components/charts/EmotionPieChart";
import SentimentTrendChart from "../components/charts/SentimentTrendChart";
// 🚨 අලුත් Word Cloud එක
import MoodWordCloud from "../components/charts/MoodWordCloud";

import MoodCheckIn from "../components/dashboard/MoodCheckIn";
import AIRecommendationCard from "../components/dashboard/AIRecommendationCard";
import BadgesCard from "../components/dashboard/BadgesCard";

const EMOTION_EMOJI = {
  joy: "😄", calm: "😌", stress: "😤", anxiety: "😰",
  sadness: "😢", anger: "😡", fatigue: "😴", love: "🥰",
  fear: "😨", disgust: "🤢", surprise: "😲", neutral: "😐",
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

  // --- Calculations ---
  const totalEntries = moods.length;
  const latestEmotion = moods[0]?.predictedEmotion || "N/A";
  const averageSentiment = insight?.avgSentiment !== undefined && insight?.avgSentiment !== null
      ? Number(insight.avgSentiment).toFixed(3)
      : "N/A";
  const topEmotion = insight?.topEmotion || "N/A";

  const stressCount = moods.filter((m) =>
    ["stress", "anxiety", "sadness", "anger", "fear"].includes(m.predictedEmotion)
  ).length;

  const positiveCount = moods.filter((m) =>
    ["joy", "calm", "love"].includes(m.predictedEmotion)
  ).length;

  const wellnessLabel = averageSentiment !== "N/A"
      ? Number(averageSentiment) >= 0.5 ? "Good" : Number(averageSentiment) >= 0 ? "Balanced" : "Needs Attention"
      : "Not Enough Data";

  const recommendationText = topEmotion === "stress" || topEmotion === "anxiety"
      ? "Try a 5-minute breathing exercise or write a short reflection to reduce mental pressure."
      : topEmotion === "sadness" ? "A gentle journal prompt or supportive content may help improve your emotional state today."
      : topEmotion === "joy" || topEmotion === "calm" ? "You are doing well. Keep your positive momentum going!"
      : "Record a journal entry to receive personalized recommendations.";

  const latestEmotionEmoji = EMOTION_EMOJI[latestEmotion] || "😐";

  const journalingStreak = useMemo(() => {
    if (!moods.length) return 0;
    const uniqueDays = [...new Set(moods.filter((m) => m.createdAt).map((m) => new Date(m.createdAt).toISOString().split("T")[0]))].sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);
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
        } else break;
      } else break;
    }
    return streak;
  }, [moods]);

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 via-sky-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-500">
      <Sidebar forceAdmin={false} />

      <div className="flex flex-1 flex-col">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            
            {/* Header Area */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between text-left">
              <div>
                <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white transition-colors">
                  Analytics <span className="bg-linear-to-r from-teal-500 to-sky-600 bg-clip-text text-transparent">Dashboard</span>
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-300">Welcome back, <span className="font-medium text-slate-700 dark:text-slate-100">{user?.fullName || "User"}</span> ✨</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/journal" className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700">New Journal Entry</Link>
                <Link to="/support" className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50 dark:bg-slate-800 dark:text-sky-300">Get Support</Link>
              </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <MoodCheckIn onSuccess={loadDashboardData} />
              </div>
              <AIRecommendationCard topEmotion={topEmotion} wellnessLabel={wellnessLabel} positiveCount={positiveCount} stressCount={stressCount} />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 text-left">
              <StatCard title="TOTAL ENTRIES" val={totalEntries} desc="Saved records" color="from-sky-400 to-teal-400" />
              <StatCard title="LATEST MOOD" val={latestEmotion} desc="Analyzed state" emoji={latestEmotionEmoji} color="from-amber-400 to-orange-400" />
              <StatCard title="SENTIMENT" val={averageSentiment} desc="Weekly balance" color="from-emerald-400 to-teal-400" />
              <StatCard title="TOP MOOD" val={topEmotion} desc="Most frequent" color="from-violet-400 to-fuchsia-400" />
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 text-left">
              <ChartWrapper title="Sentiment Trend"><SentimentTrendChart moods={moods} /></ChartWrapper>
              <ChartWrapper title="Emotion Distribution"><EmotionPieChart insight={insight} /></ChartWrapper>
            </div>

            {/* 🚨 Word Cloud Section (Fixed) */}
            <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-sky-100/50 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 text-left transition-all">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Deep Insights</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-800 dark:text-white transition-colors">Frequent Emotional Triggers</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 italic">Keywords extracted from your journal entries.</p>
              </div>
              <div className="h-87.5 w-full">
                {loading ? <div className="h-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" /> : <MoodWordCloud moods={moods} />}
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 text-left">
              <div className="xl:col-span-2 flex flex-col gap-6">
                <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Weekly Wellness Summary</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">Emotional health overview</h3>
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <SummaryItem label="Wellness Status" val={wellnessLabel} bg="bg-sky-50 dark:bg-sky-900/20" />
                    <SummaryItem label="Positive Entries" val={positiveCount} bg="bg-emerald-50 dark:bg-emerald-900/20" />
                    <SummaryItem label="Stress Signals" val={stressCount} bg="bg-rose-50 dark:bg-rose-900/20" />
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InsightBox title="Insight Summary" text={`Total of ${totalEntries} entries recorded. Dominant mood: ${topEmotion}. Overall status is ${wellnessLabel.toLowerCase()}.`} />
                    <InsightBox title="Suggested Next Step" text={recommendationText} showLinks />
                  </div>
                </div>
                <BadgesCard moods={moods} streak={journalingStreak} />
              </div>

              {/* Recent Entries Column */}
              <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700 dark:text-white">Recent Logs</p>
                  <Link to="/mood-history" className="text-sm font-semibold text-sky-600">View All</Link>
                </div>
                <div className="max-h-162.5 space-y-4 overflow-y-auto pr-1">
                  {moods.slice(0, 5).map((item) => <HistoryItem key={item._id} item={item} />)}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

// --- Reusable UI Sub-Components ---
const StatCard = ({ title, val, desc, emoji, color }) => (
  <div className="group relative rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900/70">
    <div className={`absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-linear-to-r ${color}`} />
    <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">{title}</p>
    <div className="mt-2 flex items-center gap-3">
      {emoji && <span className="text-4xl">{emoji}</span>}
      <p className="text-4xl font-light capitalize text-slate-800 dark:text-white">{val}</p>
    </div>
    <p className="text-sm text-slate-500 mt-1">{desc}</p>
  </div>
);

const ChartWrapper = ({ title, children }) => (
  <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70">
    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</p>
    <div className="h-96">{children}</div>
  </div>
);

const SummaryItem = ({ label, val, bg }) => (
  <div className={`rounded-2xl border border-slate-100 ${bg} p-4 dark:border-slate-700 dark:bg-slate-800`}>
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-2 text-xl font-semibold text-slate-800 dark:text-white">{val}</p>
  </div>
);

const InsightBox = ({ title, text, showLinks }) => (
  <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 dark:border-slate-700 dark:bg-slate-800/80">
    <p className="text-sm font-semibold text-slate-700 dark:text-white">{title}</p>
    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
    {showLinks && (
      <div className="mt-4 flex gap-3">
        <Link to="/journal" className="rounded-xl bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700 transition">Journal</Link>
        <Link to="/mood-analysis" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">Analyze</Link>
      </div>
    )}
  </div>
);

const HistoryItem = ({ item }) => {
  const emoji = EMOTION_EMOJI[item.predictedEmotion] || "😐";
  const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "N/A";
  return (
    <div className="rounded-2xl border border-white/70 bg-white/60 p-4 backdrop-blur-sm transition hover:bg-white/80 dark:border-slate-700 dark:bg-slate-800/70">
      <div className="mb-3 flex items-start justify-between">
        <p className="line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-200 font-medium">{item.inputText || "Check-in entry"}</p>
        <span className="ml-3 font-mono text-[10px] text-slate-400">{date}</span>
      </div>
      <div className="flex gap-2">
        <span className="rounded-3xl bg-teal-50 dark:bg-teal-900/30 px-3 py-1 text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-tighter shadow-sm border border-teal-100 dark:border-teal-800">{emoji} {item.predictedEmotion}</span>
        <span className="rounded-3xl bg-slate-50 dark:bg-slate-700 px-3 py-1 text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-tighter shadow-sm border border-slate-100 dark:border-slate-600">{item.sentimentLabel}</span>
      </div>
    </div>
  );
};

export default DashboardPage;