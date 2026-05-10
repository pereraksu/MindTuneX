import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";
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

const EMOTION_COLOR = {
  joy: "#f59e0b",
  calm: "#14b8a6",
  stress: "#f43f5e",
  anxiety: "#fb923c",
  sadness: "#8b5cf6",
  anger: "#ef4444",
  fatigue: "#94a3b8",
  love: "#f472b6",
  fear: "#818cf8",
  disgust: "#4ade80",
  surprise: "#06b6d4",
  neutral: "#64748b",
};

const DashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode } = useTheme();

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
        : Array.isArray(moodsRes?.data?.data)
        ? moodsRes.data.data
        : Array.isArray(moodsRes?.data)
        ? moodsRes.data
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
    ["stress", "anxiety", "sadness", "anger", "fear"].includes(
      m.predictedEmotion
    )
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
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="dash-root">
        <Sidebar forceAdmin={false} />

        <div className="dash-body">
          <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

          <main className="dash-main">
            <div className="dash-container">
              <div className="page-header">
                <div>
                  <p className="page-eyebrow">MindTuneX Overview</p>

                  <h1 className="page-title">
                    Analytics <span className="page-title-accent">Dashboard</span>
                  </h1>

                  <p className="page-sub">
                    Welcome back,{" "}
                    <strong>{user?.fullName || "User"}</strong> — here&apos;s
                    your emotional wellness summary.
                  </p>
                </div>

                <div className="header-actions">
                  <Link to="/journal" className="btn-primary">
                    + New Journal Entry
                  </Link>

                  <Link to="/support" className="btn-secondary">
                    Get Support
                  </Link>
                </div>
              </div>

              <div className="top-grid">
                <div className="card">
                  <MoodCheckIn onSuccess={loadDashboardData} />
                </div>

                <div className="card">
                  <AIRecommendationCard
                    topEmotion={topEmotion}
                    wellnessLabel={wellnessLabel}
                    positiveCount={positiveCount}
                    stressCount={stressCount}
                  />
                </div>
              </div>

              <div className="stat-grid">
                <StatCard
                  title="Total Entries"
                  val={loading ? "—" : totalEntries}
                  desc="Saved records"
                  gradientFrom="#14b8a6"
                  gradientTo="#0ea5e9"
                />

                <StatCard
                  title="Latest Mood"
                  val={loading ? "—" : latestEmotion}
                  desc="Analyzed state"
                  emoji={loading ? null : latestEmotionEmoji}
                  gradientFrom="#f59e0b"
                  gradientTo="#f97316"
                  accentColor={EMOTION_COLOR[latestEmotion]}
                />

                <StatCard
                  title="Sentiment"
                  val={loading ? "—" : averageSentiment}
                  desc="Weekly balance"
                  gradientFrom="#10b981"
                  gradientTo="#14b8a6"
                />

                <StatCard
                  title="Top Mood"
                  val={loading ? "—" : topEmotion}
                  desc="Most frequent"
                  gradientFrom="#8b5cf6"
                  gradientTo="#ec4899"
                  accentColor={EMOTION_COLOR[topEmotion]}
                />
              </div>

              <div className="chart-grid">
                <div className="card chart-card">
                  <p className="chart-eyebrow">Sentiment Trend</p>
                  <p className="chart-subtitle">
                    Track how your emotional polarity changes over time.
                  </p>

                  <div className="chart-area">
                    {loading ? (
                      <div className="skeleton" style={{ height: "100%" }} />
                    ) : (
                      <SentimentTrendChart moods={moods} />
                    )}
                  </div>
                </div>

                <div className="card chart-card">
                  <p className="chart-eyebrow">Emotion Distribution</p>
                  <p className="chart-subtitle">
                    See the share of each detected emotional state.
                  </p>

                  <div className="chart-area">
                    {loading ? (
                      <div className="skeleton" style={{ height: "100%" }} />
                    ) : (
                      <EmotionPieChart insight={insight} />
                    )}
                  </div>
                </div>
              </div>

              <div className="card wordcloud-card">
                <p className="section-eyebrow">Deep Insights</p>
                <p className="section-title">Frequent Emotional Triggers</p>
                <p className="section-note">
                  Keywords extracted from your saved journal entries and mood
                  logs.
                </p>

                <div className="wordcloud-inner">
                  {loading ? (
                    <div
                      className="skeleton"
                      style={{ height: "100%", borderRadius: 16 }}
                    />
                  ) : (
                    <MoodWordCloud moods={moods} />
                  )}
                </div>
              </div>

              <div className="bottom-grid">
                <div className="bottom-left">
                  <div className="card wellness-card">
                    <p className="section-eyebrow">Weekly Wellness Summary</p>
                    <p className="section-title">Emotional health overview</p>

                    <div className="summary-items-grid">
                      <SummaryItem
                        label="Wellness Status"
                        val={wellnessLabel}
                        color="#14b8a6"
                      />
                      <SummaryItem
                        label="Positive Entries"
                        val={positiveCount}
                        color="#10b981"
                      />
                      <SummaryItem
                        label="Stress Signals"
                        val={stressCount}
                        color="#f43f5e"
                      />
                    </div>

                    <div className="insight-pair">
                      <div className="insight-box">
                        <p className="insight-box-title">Insight Summary</p>
                        <p className="insight-box-text">
                          {`${totalEntries} entries recorded. Dominant mood was ${topEmotion}. Overall emotional balance appears ${wellnessLabel.toLowerCase()}.`}
                        </p>
                      </div>

                      <div className="insight-box">
                        <p className="insight-box-title">Suggested Next Step</p>
                        <p className="insight-box-text">{recommendationText}</p>

                        <div className="insight-actions">
                          <Link
                            to="/journal"
                            className="insight-btn insight-btn-filled"
                          >
                            Journal
                          </Link>

                          <Link
                            to="/mood-analysis"
                            className="insight-btn insight-btn-outline"
                          >
                            Analyze
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <BadgesCard moods={moods} streak={journalingStreak} />
                  </div>
                </div>

                <div className="card logs-card">
                  <div className="logs-header">
                    <div>
                      <p className="logs-title">Recent Logs</p>
                      <p className="logs-subtitle">
                        Your latest emotional entries
                      </p>
                    </div>

                    <Link to="/mood-history" className="logs-viewall">
                      View All →
                    </Link>
                  </div>

                  <div className="logs-scroll">
                    {loading ? (
                      Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="skeleton"
                          style={{ height: 82, borderRadius: 18 }}
                        />
                      ))
                    ) : moods.length > 0 ? (
                      moods
                        .slice(0, 5)
                        .map((item) => (
                          <HistoryItem key={item._id || item.createdAt} item={item} />
                        ))
                    ) : (
                      <div className="empty-state">No recent entries found.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const StatCard = ({
  title,
  val,
  desc,
  emoji,
  gradientFrom,
  gradientTo,
  accentColor,
}) => (
  <div className="stat-card">
    <div
      className="stat-card-glow"
      style={{
        background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
      }}
    />

    <p className="stat-card-title">{title}</p>

    <div className="stat-card-val">
      {emoji && <span className="stat-card-emoji">{emoji}</span>}
      <span style={accentColor ? { color: accentColor } : {}}>{val}</span>
    </div>

    <p className="stat-card-desc">{desc}</p>
  </div>
);

const SummaryItem = ({ label, val, color }) => (
  <div className="summary-item">
    <p className="summary-item-label">{label}</p>
    <p className="summary-item-val" style={{ color }}>
      {val}
    </p>
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
    <div className="history-item">
      <div className="history-item-top">
        <p className="history-item-text">
          {item.inputText || item.text || item.content || "Check-in entry"}
        </p>

        <span className="history-item-date">{date}</span>
      </div>

      <div className="history-tags">
        <span className="tag tag-emotion">
          {emoji} {item.predictedEmotion || "neutral"}
        </span>

        <span className="tag tag-sentiment">
          {item.sentimentLabel || "neutral"}
        </span>
      </div>
    </div>
  );
};

const STYLES = (darkMode) => `
  .dash-root {
    display: flex;
    min-height: 100svh;
    background: ${
      darkMode
        ? "radial-gradient(circle at top left, rgba(20,184,166,0.1), transparent 34%), #080c14"
        : "linear-gradient(135deg, #f8fafc 0%, #eef9ff 55%, #ecfeff 100%)"
    };
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .dash-root::before {
    content: '';
    position: fixed;
    top: -120px;
    left: -120px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(20,184,166,0.14) 0%, transparent 65%);
    pointer-events: none;
    z-index: 0;
  }

  .dash-root::after {
    content: '';
    position: fixed;
    bottom: -100px;
    right: -100px;
    width: 450px;
    height: 450px;
    background: radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 65%);
    pointer-events: none;
    z-index: 0;
  }

  .dash-body {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    z-index: 1;
    min-width: 0;
  }

  .dash-main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
  }

  @media (min-width: 1024px) {
    .dash-main {
      padding: 36px 40px;
    }
  }

  .dash-container {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .page-header,
  .card,
  .stat-card {
    animation: dash-fade-up 0.45s ease both;
  }

  @keyframes dash-fade-up {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .page-header {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-radius: 28px;
    padding: 30px;
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"
    };
    background: ${
      darkMode ? "rgba(15,23,42,0.74)" : "rgba(255,255,255,0.78)"
    };
    backdrop-filter: blur(22px);
    box-shadow: ${
      darkMode
        ? "0 24px 60px rgba(0,0,0,0.3)"
        : "0 24px 60px rgba(15,23,42,0.08)"
    };
    position: relative;
    overflow: hidden;
  }

  .page-header::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, #14b8a6, #0ea5e9, #8b5cf6);
  }

  @media (min-width: 768px) {
    .page-header {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  .page-eyebrow {
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #14b8a6;
    margin-bottom: 9px;
  }

  .page-title {
    font-size: clamp(34px, 5vw, 52px);
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.96)" : "#0f172a"};
    line-height: 1.02;
    letter-spacing: -0.045em;
    margin: 0;
  }

  .page-title-accent {
    background: linear-gradient(135deg, #14b8a6, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .page-sub {
    margin-top: 12px;
    font-size: 13.5px;
    color: ${darkMode ? "rgba(255,255,255,0.44)" : "rgba(15,23,42,0.56)"};
    line-height: 1.75;
  }

  .page-sub strong {
    color: ${darkMode ? "rgba(255,255,255,0.8)" : "#0f172a"};
    font-weight: 950;
  }

  .header-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    flex-shrink: 0;
  }

  .btn-primary,
  .btn-secondary {
    padding: 11px 20px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 950;
    font-family: inherit;
    text-decoration: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition: all 0.2s ease;
  }

  .btn-primary {
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    color: #fff;
    border: none;
    box-shadow: 0 14px 28px rgba(20,184,166,0.24);
  }

  .btn-secondary {
    background: ${
      darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"
    };
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)"
    };
    color: ${darkMode ? "rgba(255,255,255,0.58)" : "rgba(15,23,42,0.58)"};
  }

  .btn-primary:hover,
  .btn-secondary:hover {
    transform: translateY(-2px);
  }

  .card,
  .stat-card {
    border-radius: 26px;
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"
    };
    background: ${
      darkMode ? "rgba(15,23,42,0.74)" : "rgba(255,255,255,0.78)"
    };
    backdrop-filter: blur(22px);
    box-shadow: ${
      darkMode
        ? "0 24px 60px rgba(0,0,0,0.24)"
        : "0 24px 60px rgba(15,23,42,0.07)"
    };
    overflow: hidden;
  }

  .top-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (min-width: 1280px) {
    .top-grid {
      grid-template-columns: 2fr 1fr;
    }
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media (min-width: 1024px) {
    .stat-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .stat-card {
    padding: 22px;
    position: relative;
    transition: all 0.22s ease;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    border-color: ${
      darkMode ? "rgba(255,255,255,0.15)" : "rgba(20,184,166,0.22)"
    };
  }

  .stat-card-glow {
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
  }

  .stat-card-title {
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 15px;
  }

  .stat-card-val {
    font-size: 32px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.92)" : "#0f172a"};
    text-transform: capitalize;
    display: flex;
    align-items: center;
    gap: 10px;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .stat-card-emoji {
    font-size: 28px;
  }

  .stat-card-desc {
    margin-top: 9px;
    font-size: 12px;
    font-weight: 750;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.48)"};
  }

  .chart-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    .chart-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .chart-card {
    padding: 24px;
  }

  .chart-eyebrow,
  .section-eyebrow {
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.32)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 7px;
  }

  .chart-subtitle,
  .section-note {
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.5)"};
    margin-bottom: 20px;
    line-height: 1.6;
  }

  .chart-area {
    height: 320px;
  }

  .wordcloud-card,
  .wellness-card {
    padding: 28px;
  }

  .section-title {
    font-size: 21px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.88)" : "#0f172a"};
    margin-bottom: 5px;
  }

  .wordcloud-inner {
    height: 320px;
    border-radius: 20px;
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)"
    };
    background: ${darkMode ? "rgba(0,0,0,0.18)" : "rgba(248,250,252,0.82)"};
    padding: 12px;
    overflow: hidden;
  }

  .bottom-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (min-width: 1280px) {
    .bottom-grid {
      grid-template-columns: 2fr 1fr;
    }
  }

  .bottom-left {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .summary-items-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin: 22px 0;
  }

  @media(max-width: 640px) {
    .summary-items-grid {
      grid-template-columns: 1fr;
    }
  }

  .summary-item,
  .insight-box,
  .history-item {
    background: ${darkMode ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.035)"};
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.065)" : "rgba(15,23,42,0.06)"
    };
    border-radius: 18px;
  }

  .summary-item {
    padding: 16px;
  }

  .summary-item-label {
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 9px;
  }

  .summary-item-val {
    font-size: 22px;
    font-weight: 950;
    text-transform: capitalize;
    letter-spacing: -0.03em;
  }

  .insight-pair {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  @media (min-width: 768px) {
    .insight-pair {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .insight-box {
    padding: 18px;
  }

  .insight-box-title {
    font-size: 12px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.62)" : "#0f172a"};
    margin-bottom: 8px;
  }

  .insight-box-text {
    font-size: 13px;
    line-height: 1.7;
    font-weight: 600;
    color: ${darkMode ? "rgba(255,255,255,0.44)" : "rgba(15,23,42,0.56)"};
  }

  .insight-actions {
    display: flex;
    gap: 8px;
    margin-top: 15px;
  }

  .insight-btn {
    padding: 8px 15px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 950;
    font-family: inherit;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .insight-btn-filled {
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    color: #fff;
    border: none;
  }

  .insight-btn-outline {
    background: ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.045)"};
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)"
    };
    color: ${darkMode ? "rgba(255,255,255,0.58)" : "rgba(15,23,42,0.58)"};
  }

  .insight-btn:hover {
    transform: translateY(-1px);
  }

  .logs-card {
    padding: 22px;
  }

  .logs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .logs-title {
    font-size: 15px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.86)" : "#0f172a"};
  }

  .logs-subtitle {
    font-size: 11.5px;
    color: ${darkMode ? "rgba(255,255,255,0.32)" : "rgba(15,23,42,0.46)"};
    margin-top: 3px;
  }

  .logs-viewall {
    font-size: 12px;
    font-weight: 950;
    color: #14b8a6;
    text-decoration: none;
  }

  .logs-scroll {
    max-height: 600px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    scrollbar-width: thin;
    scrollbar-color: rgba(20,184,166,0.35) transparent;
  }

  .logs-scroll::-webkit-scrollbar {
    width: 5px;
  }

  .logs-scroll::-webkit-scrollbar-thumb {
    background: rgba(20,184,166,0.35);
    border-radius: 999px;
  }

  .history-item {
    padding: 15px 16px;
    transition: all 0.18s ease;
  }

  .history-item:hover {
    transform: translateX(3px);
    border-color: rgba(20,184,166,0.22);
    background: rgba(20,184,166,0.07);
  }

  .history-item-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 11px;
  }

  .history-item-text {
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.62)" : "rgba(15,23,42,0.62)"};
    font-weight: 650;
    line-height: 1.55;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .history-item-date {
    font-size: 10px;
    font-family: monospace;
    color: ${darkMode ? "rgba(255,255,255,0.28)" : "rgba(15,23,42,0.38)"};
    flex-shrink: 0;
  }

  .history-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tag {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .tag-emotion {
    background: rgba(20,184,166,0.12);
    border: 1px solid rgba(20,184,166,0.22);
    color: #2dd4bf;
  }

  .tag-sentiment {
    background: ${
      darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"
    };
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"
    };
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.5)"};
  }

  .empty-state {
    padding: 34px 18px;
    text-align: center;
    border: 1px dashed ${
      darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.12)"
    };
    border-radius: 18px;
    font-size: 13px;
    font-weight: 750;
    color: ${darkMode ? "rgba(255,255,255,0.32)" : "rgba(15,23,42,0.42)"};
  }

  .skeleton {
    background: ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.08)"};
    border-radius: 16px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.42;
    }
  }
`;

export default DashboardPage;