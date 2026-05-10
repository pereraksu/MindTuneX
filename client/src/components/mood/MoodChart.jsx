import React from "react";
import { useTheme } from "../../context/useTheme";

const EMOTION_STYLES = {
  joy: { from: "#f59e0b", to: "#f97316" },
  calm: { from: "#14b8a6", to: "#0ea5e9" },
  stress: { from: "#f43f5e", to: "#e11d48" },
  anxiety: { from: "#f97316", to: "#f59e0b" },
  sadness: { from: "#8b5cf6", to: "#6366f1" },
  anger: { from: "#ef4444", to: "#f43f5e" },
  fatigue: { from: "#64748b", to: "#475569" },
  love: { from: "#ec4899", to: "#f43f5e" },
  fear: { from: "#818cf8", to: "#8b5cf6" },
  disgust: { from: "#4ade80", to: "#22c55e" },
  surprise: { from: "#14b8a6", to: "#06b6d4" },
  neutral: { from: "#64748b", to: "#475569" },
};

const EMOTION_EMOJI = {
  joy: "😄", calm: "😌", stress: "😤", anxiety: "😰",
  sadness: "😢", anger: "😡", fatigue: "😴", love: "🥰",
  fear: "😨", disgust: "🤢", surprise: "😲", neutral: "😐",
};

const MoodChart = ({ insight }) => {
  const { darkMode } = useTheme();

  const emotionCounts =
    insight?.emotionCounts || insight?.emotionDistribution || {};

  const entries = Object.entries(emotionCounts).filter(([, value]) => value > 0);

  const maxValue = entries.length
    ? Math.max(...entries.map(([, value]) => Number(value)))
    : 1;

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="mchart-card">
        <div className="mchart-glow" />

        <div className="mchart-header">
          <p className="mchart-eyebrow">Emotion Analytics</p>
          <h2 className="mchart-title">Emotion Summary</h2>
          <p className="mchart-subtitle">
            Overview of how often each emotional state appears in your records.
          </p>
        </div>

        {!entries.length ? (
          <div className="mchart-empty">
            <div className="mchart-empty-icon">📊</div>
            <p className="mchart-empty-title">No chart data available</p>
            <p className="mchart-empty-sub">
              Log more moods to generate your emotion summary.
            </p>
          </div>
        ) : (
          <div className="mchart-list">
            {entries.map(([emotion, value]) => {
              const key = emotion.toLowerCase();
              const accent = EMOTION_STYLES[key] || EMOTION_STYLES.neutral;
              const emoji = EMOTION_EMOJI[key] || "😐";
              const width = `${(Number(value) / maxValue) * 100}%`;

              return (
                <div key={emotion} className="mchart-row">
                  <div className="mchart-row-top">
                    <div className="mchart-emotion">
                      <div
                        className="mchart-emoji"
                        style={{
                          background: `linear-gradient(135deg, ${accent.from}22, ${accent.to}33)`,
                          borderColor: `${accent.from}35`,
                        }}
                      >
                        {emoji}
                      </div>

                      <div>
                        <p className="mchart-emotion-name">{emotion}</p>
                        <p className="mchart-emotion-sub">Detected entries</p>
                      </div>
                    </div>

                    <span
                      className="mchart-value"
                      style={{
                        color: accent.from,
                        background: `${accent.from}14`,
                        borderColor: `${accent.from}33`,
                      }}
                    >
                      {value}
                    </span>
                  </div>

                  <div className="mchart-track">
                    <div
                      className="mchart-fill"
                      style={{
                        width,
                        background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
                        boxShadow: `0 0 14px ${accent.from}55`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  .mchart-card {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"};
    padding: 24px;
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    backdrop-filter: blur(22px);
    box-shadow: ${darkMode ? "0 22px 55px rgba(0,0,0,0.28)" : "0 22px 55px rgba(15,23,42,0.08)"};
  }

  .mchart-glow {
    position: absolute;
    right: -90px;
    top: -90px;
    width: 240px;
    height: 240px;
    background: radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .mchart-header,
  .mchart-list,
  .mchart-empty {
    position: relative;
    z-index: 1;
  }

  .mchart-header {
    margin-bottom: 22px;
  }

  .mchart-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 6px;
  }

  .mchart-title {
    font-size: 20px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.94)" : "#0f172a"};
    margin-bottom: 4px;
  }

  .mchart-subtitle {
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
    line-height: 1.6;
  }

  .mchart-empty {
    border-radius: 18px;
    border: 1px dashed ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.12)"};
    background: ${darkMode ? "rgba(255,255,255,0.025)" : "rgba(15,23,42,0.025)"};
    padding: 44px 24px;
    text-align: center;
  }

  .mchart-empty-icon {
    width: 58px;
    height: 58px;
    border-radius: 18px;
    margin: 0 auto 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.055)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
  }

  .mchart-empty-title {
    font-size: 15px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.72)" : "#0f172a"};
    margin-bottom: 6px;
  }

  .mchart-empty-sub {
    font-size: 12.5px;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.48)"};
  }

  .mchart-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .mchart-row {
    border-radius: 18px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.075)" : "rgba(15,23,42,0.075)"};
    background: ${darkMode ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.68)"};
    padding: 16px;
    transition: all 0.2s ease;
  }

  .mchart-row:hover {
    transform: translateY(-2px);
    border-color: ${darkMode ? "rgba(255,255,255,0.14)" : "rgba(14,165,233,0.18)"};
    box-shadow: ${darkMode ? "0 14px 28px rgba(0,0,0,0.18)" : "0 14px 28px rgba(15,23,42,0.08)"};
  }

  .mchart-row-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 12px;
  }

  .mchart-emotion {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .mchart-emoji {
    width: 42px;
    height: 42px;
    border-radius: 15px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }

  .mchart-emotion-name {
    font-size: 14px;
    font-weight: 900;
    text-transform: capitalize;
    color: ${darkMode ? "rgba(255,255,255,0.86)" : "#0f172a"};
    margin-bottom: 2px;
  }

  .mchart-emotion-sub {
    font-size: 11.5px;
    font-weight: 600;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.46)"};
  }

  .mchart-value {
    min-width: 42px;
    text-align: center;
    padding: 5px 12px;
    border-radius: 999px;
    border: 1px solid;
    font-size: 12px;
    font-weight: 900;
  }

  .mchart-track {
    height: 9px;
    width: 100%;
    overflow: hidden;
    border-radius: 999px;
    background: ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"};
  }

  .mchart-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.6s ease;
  }
`;

export default MoodChart;