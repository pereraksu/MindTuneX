import React, { useState, useEffect } from "react";
import { getMyMoodsApi } from "../../api/moodApi";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/useTheme";

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

const SENTIMENT_ACCENT = {
  positive: "#34d399",
  negative: "#fb7185",
  neutral: "#94a3b8",
};

const formatDate = (dateString) => {
  if (!dateString) return "Recently";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

const MoodHistory = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode } = useTheme();

  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMoods = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyMoodsApi();

      const fetched = Array.isArray(response)
        ? response
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setMoods(
        [...fetched].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch {
      setError("Could not load your history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="mh-root">
        <div className="mh-glow mh-glow-1" />
        <div className="mh-glow mh-glow-2" />

        <Sidebar />

        <div className="mh-body">
          <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

          <main className="mh-main">
            <div className="mh-container">
              <div className="mh-hero">
                <div className="mh-hero-bar" />

                <div className="mh-hero-inner">
                  <div>
                    <p className="mh-eyebrow">Emotional Timeline</p>
                    <h1 className="mh-title">
                      Mood <span>History</span>
                    </h1>
                    <p className="mh-hero-sub">
                      Your complete emotional journey, entries, and AI insights in one place.
                    </p>
                  </div>

                  <div className="mh-count-pill">
                    <span className="mh-count-label">Total Entries</span>
                    <span className="mh-count-val">{moods.length}</span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="mh-center-state">
                  <div className="mh-spinner" />
                  <p className="mh-state-text">Loading your mood journey…</p>
                </div>
              ) : error ? (
                <div className="mh-center-state">
                  <div className="mh-error-box">
                    <div className="mh-error-icon">⚠️</div>
                    <p className="mh-error-text">{error}</p>
                    <button onClick={fetchMoods} className="mh-retry-btn">
                      Try Again
                    </button>
                  </div>
                </div>
              ) : !moods.length ? (
                <div className="mh-empty">
                  <div className="mh-empty-icon">📖</div>
                  <h3 className="mh-empty-title">No entries yet</h3>
                  <p className="mh-empty-sub">
                    Start writing in your journal to build your emotional history.
                  </p>
                </div>
              ) : (
                <div className="mh-list">
                  {moods.map((item, index) => {
                    const emoKey =
                      item.predictedEmotion?.toLowerCase() || "neutral";
                    const emoji = EMOTION_EMOJI[emoKey] || "😐";
                    const accent =
                      EMOTION_ACCENT[emoKey] || EMOTION_ACCENT.neutral;

                    const sentiment =
                      item.sentimentLabel?.toLowerCase() || "neutral";
                    const sentimentColor =
                      SENTIMENT_ACCENT[sentiment] || SENTIMENT_ACCENT.neutral;

                    const confPct = Math.max(
                      0,
                      Math.min(100, Math.round((item.confidence || 0) * 100))
                    );

                    return (
                      <div key={item._id || index} className="mh-card">
                        <div
                          className="mh-card-glow"
                          style={{
                            background: `radial-gradient(circle, ${accent.from}22 0%, transparent 70%)`,
                          }}
                        />

                        <div
                          className="mh-card-bar"
                          style={{
                            background: `linear-gradient(180deg, ${accent.from}, ${accent.to})`,
                          }}
                        />

                        <div className="mh-card-body">
                          <div className="mh-card-top">
                            <div className="mh-card-left">
                              <div
                                className="mh-emoji-wrap"
                                style={{
                                  background: `${accent.from}18`,
                                  borderColor: `${accent.from}33`,
                                }}
                              >
                                {emoji}
                              </div>

                              <div>
                                <div className="mh-emotion-row">
                                  <span
                                    className="mh-emotion-name"
                                    style={{ color: accent.text }}
                                  >
                                    {emoKey}
                                  </span>

                                  <span
                                    className="mh-badge"
                                    style={{
                                      color: sentimentColor,
                                      background: `${sentimentColor}14`,
                                      borderColor: `${sentimentColor}33`,
                                    }}
                                  >
                                    {sentiment}
                                  </span>
                                </div>

                                <p
                                  className="mh-emotion-sub"
                                  style={{ color: sentimentColor }}
                                >
                                  {sentiment} sentiment
                                </p>
                              </div>
                            </div>

                            <div className="mh-card-right">
                              <p className="mh-date">
                                {formatDate(item.createdAt)}
                              </p>

                              <div className="mh-conf-row">
                                <span
                                  className="mh-conf-pct"
                                  style={{ color: accent.text }}
                                >
                                  {confPct}%
                                </span>

                                <div className="mh-conf-track">
                                  <div
                                    className="mh-conf-fill"
                                    style={{
                                      width: `${confPct}%`,
                                      background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mh-text-box">
                            {item.title && (
                              <h4 className="mh-entry-title">{item.title}</h4>
                            )}

                            <p className="mh-entry-text">
                              “{item.text || item.inputText || item.content || "No details provided"}”
                            </p>

                            {item.tags?.length > 0 && (
                              <div className="mh-tags">
                                {item.tags.map((tag, i) => (
                                  <span key={i} className="mh-tag">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="mh-meta-grid">
                            <InfoBox
                              label="Source"
                              value={item.source || "Manual"}
                              accentColor={accent.text}
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
    </>
  );
};

const InfoBox = ({ label, value, accentColor }) => (
  <div className="mh-info-box">
    <p>{label}</p>
    <span style={accentColor ? { color: accentColor } : {}}>{value}</span>
  </div>
);

const STYLES = (darkMode) => `
  .mh-root {
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

  .mh-glow {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .mh-glow-1 {
    top: -100px;
    left: -80px;
    width: 420px;
    height: 420px;
    background: radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 65%);
  }

  .mh-glow-2 {
    bottom: -80px;
    right: -80px;
    width: 380px;
    height: 380px;
    background: radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 65%);
  }

  .mh-body {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    z-index: 1;
    min-width: 0;
  }

  .mh-main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
  }

  @media(min-width: 1024px) {
    .mh-main {
      padding: 36px 40px;
    }
  }

  .mh-container {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .mh-hero,
  .mh-card,
  .mh-empty {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"};
    backdrop-filter: blur(22px);
    box-shadow: ${darkMode ? "0 22px 55px rgba(0,0,0,0.28)" : "0 22px 55px rgba(15,23,42,0.08)"};
  }

  .mh-hero {
    padding: 28px;
  }

  .mh-hero-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #14b8a6, #0ea5e9, #8b5cf6);
  }

  .mh-hero-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  @media(min-width: 640px) {
    .mh-hero-inner {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  .mh-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 8px;
  }

  .mh-title {
    font-size: clamp(32px, 4vw, 46px);
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.95)" : "#0f172a"};
    line-height: 1.05;
    margin-bottom: 10px;
  }

  .mh-title span {
    background: linear-gradient(135deg, #14b8a6, #38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .mh-hero-sub {
    font-size: 13.5px;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
    line-height: 1.6;
  }

  .mh-count-pill {
    padding: 15px 24px;
    border-radius: 18px;
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    text-align: center;
    min-width: 120px;
  }

  .mh-count-label {
    display: block;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 6px;
  }

  .mh-count-val {
    font-size: 30px;
    font-weight: 900;
    color: #14b8a6;
    line-height: 1;
  }

  .mh-center-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 42vh;
    gap: 14px;
  }

  .mh-spinner {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 3px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    border-top-color: #14b8a6;
    animation: mh-spin 0.75s linear infinite;
  }

  @keyframes mh-spin {
    to { transform: rotate(360deg); }
  }

  .mh-state-text {
    font-size: 13px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.48)"};
  }

  .mh-error-box {
    border-radius: 20px;
    border: 1px solid rgba(244,63,94,0.25);
    background: rgba(244,63,94,0.08);
    padding: 30px 34px;
    text-align: center;
    max-width: 380px;
  }

  .mh-error-icon {
    width: 48px;
    height: 48px;
    border-radius: 18px;
    background: rgba(244,63,94,0.12);
    border: 1px solid rgba(244,63,94,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fb7185;
    margin: 0 auto 14px;
    font-size: 22px;
  }

  .mh-error-text {
    font-size: 14px;
    color: #fb7185;
    font-weight: 800;
    margin-bottom: 16px;
  }

  .mh-retry-btn {
    padding: 10px 22px;
    border-radius: 999px;
    background: rgba(244,63,94,0.1);
    border: 1px solid rgba(244,63,94,0.28);
    color: #fb7185;
    font-size: 13px;
    font-weight: 900;
    font-family: inherit;
    cursor: pointer;
  }

  .mh-empty {
    padding: 64px 24px;
    text-align: center;
  }

  .mh-empty-icon {
    width: 66px;
    height: 66px;
    border-radius: 20px;
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.055)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${darkMode ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.55)"};
    margin: 0 auto 16px;
    font-size: 30px;
  }

  .mh-empty-title {
    font-size: 18px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.74)" : "#0f172a"};
    margin-bottom: 7px;
  }

  .mh-empty-sub {
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.48)"};
    line-height: 1.6;
  }

  .mh-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .mh-card {
    display: flex;
    transition: all 0.22s ease;
  }

  .mh-card:hover {
    transform: translateY(-3px);
    border-color: ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(14,165,233,0.18)"};
  }

  .mh-card-glow {
    position: absolute;
    right: -90px;
    top: -90px;
    width: 230px;
    height: 230px;
    pointer-events: none;
  }

  .mh-card-bar {
    width: 4px;
    flex-shrink: 0;
    opacity: 0.95;
  }

  .mh-card-body {
    position: relative;
    z-index: 1;
    flex: 1;
    padding: 20px 22px;
    min-width: 0;
  }

  .mh-card-top {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 16px;
  }

  @media(min-width: 560px) {
    .mh-card-top {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
    }
  }

  .mh-card-left {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .mh-card-right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  @media(min-width: 560px) {
    .mh-card-right {
      align-items: flex-end;
    }
  }

  .mh-emoji-wrap {
    width: 52px;
    height: 52px;
    border-radius: 18px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    flex-shrink: 0;
  }

  .mh-emotion-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }

  .mh-emotion-name {
    font-size: 21px;
    font-weight: 900;
    text-transform: capitalize;
  }

  .mh-emotion-sub {
    font-size: 11.5px;
    font-weight: 800;
    text-transform: capitalize;
  }

  .mh-badge {
    padding: 4px 11px;
    border-radius: 999px;
    font-size: 10.5px;
    font-weight: 900;
    border: 1px solid;
    text-transform: capitalize;
  }

  .mh-date {
    font-size: 11.5px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.46)"};
    margin-bottom: 8px;
  }

  .mh-conf-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mh-conf-pct {
    font-size: 11px;
    font-weight: 900;
    font-family: monospace;
    min-width: 34px;
  }

  .mh-conf-track {
    height: 5px;
    width: 82px;
    border-radius: 999px;
    background: ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    overflow: hidden;
  }

  .mh-conf-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.6s ease;
  }

  .mh-text-box {
    border-radius: 16px;
    padding: 16px 18px;
    margin-bottom: 14px;
    background: ${darkMode ? "rgba(0,0,0,0.16)" : "rgba(255,255,255,0.7)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"};
  }

  .mh-entry-title {
    font-size: 15px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.82)" : "#0f172a"};
    margin-bottom: 8px;
  }

  .mh-entry-text {
    font-size: 13.5px;
    color: ${darkMode ? "rgba(255,255,255,0.56)" : "rgba(15,23,42,0.62)"};
    line-height: 1.7;
  }

  .mh-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 12px;
  }

  .mh-tag {
    padding: 4px 11px;
    border-radius: 999px;
    background: rgba(20,184,166,0.1);
    border: 1px solid rgba(20,184,166,0.24);
    color: #14b8a6;
    font-size: 10.5px;
    font-weight: 900;
  }

  .mh-meta-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  @media(max-width: 520px) {
    .mh-meta-grid {
      grid-template-columns: 1fr;
    }
  }

  .mh-info-box {
    border-radius: 14px;
    padding: 12px 14px;
    background: ${darkMode ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.035)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"};
  }

  .mh-info-box p {
    font-size: 9.5px;
    font-weight: 900;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.32)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 6px;
  }

  .mh-info-box span {
    font-size: 12.5px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.62)" : "rgba(15,23,42,0.62)"};
    text-transform: capitalize;
  }
`;

export default MoodHistory;