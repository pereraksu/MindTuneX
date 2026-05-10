import React, { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/useTheme";
import { getMyMoodsApi } from "../../api/moodApi";

const EMOTION_EMOJI = {
  joy: "😄", calm: "😌", stress: "😤", anxiety: "😰",
  sadness: "😢", anger: "😡", fatigue: "😴", love: "🥰",
  fear: "😨", disgust: "🤢", surprise: "😲", neutral: "😐",
};

const EMOTION_ACCENT = {
  joy: { from: "#f59e0b", to: "#f97316", text: "#fbbf24" },
  calm: { from: "#14b8a6", to: "#0ea5e9", text: "#2dd4bf" },
  stress: { from: "#f43f5e", to: "#e11d48", text: "#fb7185" },
  anxiety: { from: "#f97316", to: "#f59e0b", text: "#fb923c" },
  sadness: { from: "#8b5cf6", to: "#6366f1", text: "#a78bfa" },
  anger: { from: "#ef4444", to: "#f43f5e", text: "#f87171" },
  fatigue: { from: "#64748b", to: "#475569", text: "#94a3b8" },
  love: { from: "#ec4899", to: "#f43f5e", text: "#f472b6" },
  fear: { from: "#818cf8", to: "#8b5cf6", text: "#a5b4fc" },
  disgust: { from: "#4ade80", to: "#22c55e", text: "#86efac" },
  surprise: { from: "#14b8a6", to: "#06b6d4", text: "#5eead4" },
  neutral: { from: "#64748b", to: "#475569", text: "#94a3b8" },
};

const SENTIMENT_COLOR = {
  positive: "#34d399",
  negative: "#fb7185",
  neutral: "#94a3b8",
};

const WeeklyInsights = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode } = useTheme();

  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
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

      if (!allMoods.length) {
        setInsight(null);
        return;
      }

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentMoods = allMoods.filter(
        (m) => m.createdAt && new Date(m.createdAt) >= sevenDaysAgo
      );

      if (!recentMoods.length) {
        setInsight(null);
        return;
      }

      const emotionCounts = {};
      let posCount = 0;
      let negCount = 0;

      recentMoods.forEach((m) => {
        const emotion = m.predictedEmotion?.toLowerCase() || "neutral";
        const sentiment = m.sentimentLabel?.toLowerCase() || "neutral";

        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;

        if (sentiment === "positive") posCount += 1;
        if (sentiment === "negative") negCount += 1;
      });

      let topEmotion = "neutral";
      let maxCount = 0;

      Object.entries(emotionCounts).forEach(([emotion, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topEmotion = emotion;
        }
      });

      const avgSentiment =
        posCount > negCount ? "Positive" : negCount > posCount ? "Negative" : "Neutral";

      setInsight({
        totalEntries: recentMoods.length,
        avgSentiment,
        topEmotion,
        emotionCounts,
        summaryText: `Over the past week, you checked in ${recentMoods.length} time${
          recentMoods.length !== 1 ? "s" : ""
        }. Your most common emotional state was ${topEmotion}, contributing to a generally ${avgSentiment.toLowerCase()} emotional trend. Keep tracking your moods consistently to strengthen self-awareness and emotional balance.`,
      });
    } catch {
      setInsight(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const sorted = Object.entries(insight?.emotionCounts || {}).sort(
    (a, b) => b[1] - a[1]
  );

  const maxVal = sorted[0]?.[1] || 1;

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="wi-root">
        <div className="wi-glow wi-glow-1" />
        <div className="wi-glow wi-glow-2" />

        <Sidebar />

        <div className="wi-body">
          <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

          <main className="wi-main">
            <div className="wi-container">
              <div className="wi-hero">
                <div className="wi-hero-bar" />

                <p className="wi-eyebrow">7 Day Emotional Analytics</p>

                <h1 className="wi-title">
                  Weekly <span>Insights</span>
                </h1>

                <p className="wi-hero-sub">
                  Your emotional landscape, dominant mood patterns, and weekly wellbeing summary.
                </p>
              </div>

              {loading ? (
                <div className="wi-center">
                  <div className="wi-spinner" />
                  <p className="wi-state-text">Analysing your week…</p>
                </div>
              ) : !insight ? (
                <div className="wi-empty">
                  <div className="wi-empty-icon">📊</div>
                  <h3 className="wi-empty-title">Not enough data for this week</h3>
                  <p className="wi-empty-sub">
                    Keep logging your moods daily to unlock weekly trends and emotional insights.
                  </p>
                </div>
              ) : (
                <div className="wi-content">
                  <div className="wi-stats-grid">
                    <StatCard
                      label="Total Entries"
                      value={insight.totalEntries}
                      sub="this week"
                      from="#14b8a6"
                      to="#0ea5e9"
                      color="#2dd4bf"
                    />

                    <StatCard
                      label="Average Sentiment"
                      value={insight.avgSentiment}
                      sub="overall weekly tone"
                      from={
                        insight.avgSentiment === "Positive"
                          ? "#10b981"
                          : insight.avgSentiment === "Negative"
                          ? "#f43f5e"
                          : "#64748b"
                      }
                      to={
                        insight.avgSentiment === "Positive"
                          ? "#14b8a6"
                          : insight.avgSentiment === "Negative"
                          ? "#f97316"
                          : "#475569"
                      }
                      color={
                        SENTIMENT_COLOR[insight.avgSentiment?.toLowerCase()] ||
                        "#94a3b8"
                      }
                    />

                    <TopEmotionCard emotion={insight.topEmotion} />
                  </div>

                  <div className="wi-summary-card">
                    <div className="wi-summary-bar" />

                    <div className="wi-summary-header">
                      <span className="wi-summary-icon">ⓘ</span>
                      <span className="wi-summary-eyebrow">Weekly Summary</span>
                    </div>

                    <p className="wi-summary-text">{insight.summaryText}</p>
                  </div>

                  <div className="wi-breakdown-card">
                    <p className="wi-breakdown-eyebrow">
                      Emotion Breakdown — Last 7 Days
                    </p>

                    <div className="wi-breakdown-list">
                      {sorted.map(([key, count]) => {
                        const emotion = key.toLowerCase();
                        const accent =
                          EMOTION_ACCENT[emotion] || EMOTION_ACCENT.neutral;
                        const pct = Math.round((count / maxVal) * 100);

                        return (
                          <div key={key} className="wi-emo-row">
                            <div className="wi-emo-left">
                              <div
                                className="wi-emo-icon"
                                style={{
                                  background: `${accent.from}18`,
                                  borderColor: `${accent.from}33`,
                                }}
                              >
                                {EMOTION_EMOJI[emotion] || "😐"}
                              </div>

                              <span
                                className="wi-emo-name"
                                style={{ color: accent.text }}
                              >
                                {key}
                              </span>
                            </div>

                            <div className="wi-emo-bar-wrap">
                              <div className="wi-emo-bar-track">
                                <div
                                  className="wi-emo-bar-fill"
                                  style={{
                                    width: `${pct}%`,
                                    background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
                                  }}
                                />
                              </div>
                            </div>

                            <span
                              className="wi-emo-count"
                              style={{ color: accent.text }}
                            >
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
    </>
  );
};

const StatCard = ({ label, value, sub, from, to, color }) => (
  <div className="wi-stat-card">
    <div
      className="wi-stat-bar"
      style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}
    />
    <p className="wi-stat-label">{label}</p>
    <p className="wi-stat-val" style={{ color }}>
      {value}
    </p>
    <p className="wi-stat-sub">{sub}</p>
  </div>
);

const TopEmotionCard = ({ emotion }) => {
  const key = emotion?.toLowerCase() || "neutral";
  const accent = EMOTION_ACCENT[key] || EMOTION_ACCENT.neutral;

  return (
    <div className="wi-stat-card">
      <div
        className="wi-stat-bar"
        style={{
          background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
        }}
      />

      <p className="wi-stat-label">Top Emotion</p>

      <div className="wi-top-emotion-row">
        <div
          className="wi-top-emoji-wrap"
          style={{
            background: `${accent.from}18`,
            borderColor: `${accent.from}33`,
          }}
        >
          {EMOTION_EMOJI[key] || "😐"}
        </div>

        <span className="wi-top-emotion-name" style={{ color: accent.text }}>
          {emotion}
        </span>
      </div>

      <p className="wi-stat-sub">most frequent emotion</p>
    </div>
  );
};

const STYLES = (darkMode) => `
  .wi-root {
    display: flex;
    min-height: 100svh;
    background: ${
      darkMode
        ? "radial-gradient(circle at top left, rgba(20,184,166,0.08), transparent 35%), #080c14"
        : "linear-gradient(135deg, #f8fafc 0%, #eef9ff 100%)"
    };
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .wi-glow {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .wi-glow-1 {
    top: -100px;
    left: -80px;
    width: 420px;
    height: 420px;
    background: radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 65%);
  }

  .wi-glow-2 {
    bottom: -80px;
    right: -80px;
    width: 380px;
    height: 380px;
    background: radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 65%);
  }

  .wi-body {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    z-index: 1;
    min-width: 0;
  }

  .wi-main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
  }

  @media(min-width: 1024px) {
    .wi-main {
      padding: 36px 40px;
    }
  }

  .wi-container {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .wi-hero,
  .wi-stat-card,
  .wi-summary-card,
  .wi-breakdown-card,
  .wi-empty {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"};
    backdrop-filter: blur(22px);
    box-shadow: ${darkMode ? "0 22px 55px rgba(0,0,0,0.28)" : "0 22px 55px rgba(15,23,42,0.08)"};
  }

  .wi-hero {
    padding: 28px;
  }

  .wi-hero-bar,
  .wi-stat-bar,
  .wi-summary-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    opacity: 0.95;
  }

  .wi-hero-bar {
    background: linear-gradient(90deg, #14b8a6, #0ea5e9, #8b5cf6);
  }

  .wi-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 8px;
  }

  .wi-title {
    font-size: clamp(32px, 4vw, 46px);
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.95)" : "#0f172a"};
    line-height: 1.05;
    margin-bottom: 10px;
  }

  .wi-title span {
    background: linear-gradient(135deg, #14b8a6, #38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .wi-hero-sub {
    font-size: 13.5px;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
    line-height: 1.6;
  }

  .wi-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 40vh;
    gap: 14px;
  }

  .wi-spinner {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 3px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    border-top-color: #14b8a6;
    animation: wi-spin 0.75s linear infinite;
  }

  @keyframes wi-spin {
    to { transform: rotate(360deg); }
  }

  .wi-state-text {
    font-size: 13px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.48)"};
  }

  .wi-empty {
    padding: 64px 24px;
    text-align: center;
  }

  .wi-empty-icon {
    width: 66px;
    height: 66px;
    border-radius: 20px;
    margin: 0 auto 16px;
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.055)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
  }

  .wi-empty-title {
    font-size: 18px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.74)" : "#0f172a"};
    margin-bottom: 7px;
  }

  .wi-empty-sub {
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.48)"};
    line-height: 1.6;
    max-width: 300px;
    margin: 0 auto;
  }

  .wi-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .wi-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  @media(max-width: 720px) {
    .wi-stats-grid {
      grid-template-columns: 1fr;
    }
  }

  .wi-stat-card {
    padding: 22px 24px;
    transition: all 0.22s ease;
  }

  .wi-stat-card:hover,
  .wi-summary-card:hover,
  .wi-breakdown-card:hover {
    transform: translateY(-3px);
    border-color: ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(14,165,233,0.18)"};
  }

  .wi-stat-label {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 13px;
    margin-top: 4px;
  }

  .wi-stat-val {
    font-size: 36px;
    font-weight: 900;
    letter-spacing: -0.04em;
    text-transform: capitalize;
    line-height: 1;
    margin-bottom: 8px;
  }

  .wi-stat-sub {
    font-size: 12px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.48)"};
  }

  .wi-top-emotion-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .wi-top-emoji-wrap {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    flex-shrink: 0;
  }

  .wi-top-emotion-name {
    font-size: 25px;
    font-weight: 900;
    text-transform: capitalize;
  }

  .wi-summary-card,
  .wi-breakdown-card {
    padding: 24px;
    transition: all 0.22s ease;
  }

  .wi-summary-bar {
    background: linear-gradient(90deg, #14b8a6, #0ea5e9);
  }

  .wi-summary-header {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 13px;
  }

  .wi-summary-icon {
    color: #14b8a6;
    font-weight: 900;
  }

  .wi-summary-eyebrow,
  .wi-breakdown-eyebrow {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #14b8a6;
  }

  .wi-summary-text {
    font-size: 14px;
    line-height: 1.75;
    color: ${darkMode ? "rgba(255,255,255,0.56)" : "rgba(15,23,42,0.62)"};
  }

  .wi-breakdown-eyebrow {
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 18px;
  }

  .wi-breakdown-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .wi-emo-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .wi-emo-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 140px;
    flex-shrink: 0;
  }

  .wi-emo-icon {
    width: 38px;
    height: 38px;
    border-radius: 13px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .wi-emo-name {
    font-size: 13px;
    font-weight: 900;
    text-transform: capitalize;
  }

  .wi-emo-bar-wrap {
    flex: 1;
  }

  .wi-emo-bar-track {
    height: 7px;
    width: 100%;
    border-radius: 999px;
    background: ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    overflow: hidden;
  }

  .wi-emo-bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.7s ease;
  }

  .wi-emo-count {
    font-size: 12px;
    font-weight: 900;
    font-family: monospace;
    min-width: 24px;
    text-align: right;
  }
`;

export default WeeklyInsights;