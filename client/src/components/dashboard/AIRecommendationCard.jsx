import React from "react";
import { Link } from "react-router-dom";
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

const getRecommendation = (emotion) => {
  switch (emotion) {
    case "stress":
    case "anxiety":
      return "Try a five-minute breathing exercise or write a short reflection to reduce mental pressure.";
    case "sadness":
      return "A gentle journal prompt or supportive content may help improve your emotional state today.";
    case "joy":
    case "calm":
      return "You are doing well. Keep your positive momentum going with gratitude journaling or a mindful break.";
    case "anger":
      return "Take a short pause, breathe deeply, and reflect before reacting. A calm reset may help.";
    case "fatigue":
      return "Your recent mood suggests low energy. Prioritize rest, hydration, and lighter daily goals.";
    case "fear":
      return "Grounding techniques and reassurance-focused reflection may help reduce emotional discomfort.";
    case "love":
      return "You are experiencing warm positive emotion. Capture this moment through gratitude or connection-focused journaling.";
    case "surprise":
      return "Take a moment to process the unexpected event and reflect on how it is affecting your thoughts.";
    case "disgust":
      return "A short reset, distraction, or calming activity may help shift your emotional state.";
    default:
      return "Record a journal entry or mood check-in to receive more personalized recommendations.";
  }
};

const AIRecommendationCard = ({
  topEmotion = "neutral",
  wellnessLabel = "Not Enough Data",
  positiveCount = 0,
  stressCount = 0,
}) => {
  const { darkMode } = useTheme();

  const emotion = topEmotion?.toLowerCase() || "neutral";
  const accent = EMOTION_ACCENT[emotion] || EMOTION_ACCENT.neutral;
  const emoji = EMOTION_EMOJI[emotion] || "😐";
  const recommendationText = getRecommendation(emotion);

  const tags = [
    { label: `Mood: ${emotion}`, color: accent.text },
    { label: `Wellness: ${wellnessLabel}`, color: "#38bdf8" },
    { label: `Positive: ${positiveCount}`, color: "#34d399" },
    { label: `Stress: ${stressCount}`, color: "#fb7185" },
  ];

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="ai-card">
        <div
          className="ai-card-glow"
          style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}
        />

        <div
          className="ai-ambient"
          style={{
            background: `radial-gradient(circle, ${accent.from}33 0%, transparent 70%)`,
          }}
        />

        <div className="ai-header">
          <p className="ai-eyebrow">AI Recommendation</p>
          <h2 className="ai-title">Personalized Wellness Guidance</h2>
          <p className="ai-subtitle">Based on your recent emotional pattern</p>
        </div>

        <div className="ai-panel">
          <div className="ai-emotion-row">
            <div
              className="ai-emoji-wrap"
              style={{
                background: `linear-gradient(135deg, ${accent.from}22, ${accent.to}33)`,
                borderColor: `${accent.from}35`,
              }}
            >
              {emoji}
            </div>

            <div>
              <p className="ai-emotion-title" style={{ color: accent.text }}>
                Top emotion: {emotion}
              </p>
              <p className="ai-emotion-sub">
                Smart recommendation generated from mood insights
              </p>
            </div>
          </div>

          <div className="ai-text-box">{recommendationText}</div>

          <div className="ai-tags">
            {tags.map((tag) => (
              <span
                key={tag.label}
                className="ai-tag"
                style={{
                  color: tag.color,
                  background: `${tag.color}14`,
                  borderColor: `${tag.color}33`,
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>

          <div className="ai-actions">
            <Link
              to="/support"
              className="ai-btn-primary"
              style={{
                background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
              }}
            >
              View Support Options
            </Link>

            <Link to="/journal" className="ai-btn-secondary">
              Write Reflection
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  .ai-card {
    position: relative;
    overflow: hidden;
    height: 100%;
    border-radius: 24px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"};
    padding: 24px;
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    backdrop-filter: blur(22px);
    box-shadow: ${darkMode ? "0 22px 55px rgba(0,0,0,0.28)" : "0 22px 55px rgba(15,23,42,0.08)"};
    box-sizing: border-box;
  }

  .ai-card-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    opacity: 0.95;
  }

  .ai-ambient {
    position: absolute;
    top: -90px;
    right: -90px;
    width: 240px;
    height: 240px;
    pointer-events: none;
  }

  .ai-header {
    position: relative;
    z-index: 1;
    margin-bottom: 18px;
  }

  .ai-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 6px;
  }

  .ai-title {
    font-size: 20px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.94)" : "#0f172a"};
    margin-bottom: 4px;
  }

  .ai-subtitle {
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
  }

  .ai-panel {
    position: relative;
    z-index: 1;
    border-radius: 18px;
    padding: 18px;
    background: ${darkMode ? "rgba(0,0,0,0.16)" : "rgba(15,23,42,0.035)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"};
  }

  .ai-emotion-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }

  .ai-emoji-wrap {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    flex-shrink: 0;
    border: 1px solid;
  }

  .ai-emotion-title {
    font-size: 17px;
    font-weight: 800;
    text-transform: capitalize;
    margin-bottom: 4px;
  }

  .ai-emotion-sub {
    font-size: 12px;
    color: ${darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.5)"};
    line-height: 1.5;
  }

  .ai-text-box {
    border-radius: 15px;
    padding: 15px 16px;
    margin-bottom: 16px;
    background: ${darkMode ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.72)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"};
    font-size: 13px;
    line-height: 1.7;
    color: ${darkMode ? "rgba(255,255,255,0.58)" : "rgba(15,23,42,0.62)"};
  }

  .ai-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 18px;
  }

  .ai-tag {
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: capitalize;
    border: 1px solid;
  }

  .ai-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .ai-btn-primary,
  .ai-btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    padding: 9px 18px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 800;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .ai-btn-primary {
    color: #ffffff;
    box-shadow: 0 14px 28px rgba(14,165,233,0.18);
  }

  .ai-btn-primary:hover,
  .ai-btn-secondary:hover {
    transform: translateY(-1px);
  }

  .ai-btn-secondary {
    color: ${darkMode ? "rgba(255,255,255,0.68)" : "rgba(15,23,42,0.68)"};
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.78)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)"};
  }

  .ai-btn-secondary:hover {
    color: ${darkMode ? "#ffffff" : "#0f172a"};
    background: ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.055)"};
  }
`;

export default AIRecommendationCard;