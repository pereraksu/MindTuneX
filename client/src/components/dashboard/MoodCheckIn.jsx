import { useState } from "react";
import { saveMoodApi } from "../../api/moodApi";
import { useTheme } from "../../context/useTheme";

const EMOTION_EMOJI = {
  joy: "😄", calm: "😌", love: "🥰", surprise: "😲",
  neutral: "😐", fatigue: "😴", stress: "😤", anxiety: "😰",
  sadness: "😢", anger: "😡", fear: "😨", disgust: "🤢",
};

const EMOTION_ACCENT = {
  joy: { from: "#f59e0b", to: "#f97316", text: "#fbbf24" },
  calm: { from: "#14b8a6", to: "#0ea5e9", text: "#2dd4bf" },
  love: { from: "#ec4899", to: "#f43f5e", text: "#f472b6" },
  surprise: { from: "#14b8a6", to: "#06b6d4", text: "#5eead4" },
  neutral: { from: "#64748b", to: "#475569", text: "#94a3b8" },
  fatigue: { from: "#64748b", to: "#475569", text: "#94a3b8" },
  stress: { from: "#f43f5e", to: "#e11d48", text: "#fb7185" },
  anxiety: { from: "#f97316", to: "#f59e0b", text: "#fb923c" },
  sadness: { from: "#8b5cf6", to: "#6366f1", text: "#a78bfa" },
  anger: { from: "#ef4444", to: "#f43f5e", text: "#f87171" },
  fear: { from: "#818cf8", to: "#8b5cf6", text: "#a5b4fc" },
  disgust: { from: "#4ade80", to: "#22c55e", text: "#86efac" },
};

const QUICK_MOODS = [
  { key: "joy", label: "Joy" },
  { key: "calm", label: "Calm" },
  { key: "love", label: "Love" },
  { key: "surprise", label: "Surprise" },
  { key: "neutral", label: "Neutral" },
  { key: "fatigue", label: "Fatigue" },
  { key: "stress", label: "Stress" },
  { key: "anxiety", label: "Anxiety" },
  { key: "sadness", label: "Sadness" },
  { key: "anger", label: "Anger" },
  { key: "fear", label: "Fear" },
  { key: "disgust", label: "Disgust" },
];

const MoodCheckIn = ({ onSuccess }) => {
  const { darkMode } = useTheme();

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState({ text: "", type: "success" });

  const handleClick = async (emotion) => {
    try {
      setLoading(true);
      setSelected(emotion);
      setMessage({ text: "", type: "success" });

      const sentiment = ["joy", "calm", "love", "surprise"].includes(emotion)
        ? "positive"
        : ["stress", "anxiety", "sadness", "anger", "fear", "disgust"].includes(emotion)
        ? "negative"
        : "neutral";

      await saveMoodApi({
        inputText: `Quick mood check-in: ${emotion}`,
        predictedEmotion: emotion,
        sentimentLabel: sentiment,
        confidence: 1.0,
        source: "quick_checkin",
      });

      setMessage({
        text: `Saved as ${emotion} ${EMOTION_EMOJI[emotion]}`,
        type: "success",
      });

      if (onSuccess) onSuccess();

      setTimeout(() => {
        setMessage({ text: "", type: "success" });
      }, 2500);
    } catch (err) {
      console.error(err);
      setMessage({
        text: "Failed to save. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setSelected("");
    }
  };

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="checkin-card">
        <div className="checkin-glow" />

        <div className="checkin-header">
          <div>
            <p className="checkin-eyebrow">Quick Check-In</p>
            <h2 className="checkin-title">How are you feeling today?</h2>
            <p className="checkin-subtitle">
              Select a mood to quickly update your emotional journal.
            </p>
          </div>

          {loading && (
            <div className="checkin-saving">
              <span className="checkin-ping" />
              Saving
            </div>
          )}
        </div>

        <div className="checkin-grid">
          {QUICK_MOODS.map((mood) => {
            const isActive = selected === mood.key;
            const accent = EMOTION_ACCENT[mood.key];

            return (
              <button
                key={mood.key}
                type="button"
                onClick={() => handleClick(mood.key)}
                disabled={loading}
                className={`mood-btn${isActive ? " is-active" : ""}`}
                style={
                  isActive
                    ? {
                        borderColor: `${accent.from}55`,
                        background: `${accent.from}14`,
                      }
                    : {}
                }
              >
                <div
                  className="mood-btn-bar"
                  style={{
                    background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
                  }}
                />

                <span className="mood-emoji">
                  {EMOTION_EMOJI[mood.key]}
                </span>

                <span
                  className="mood-label"
                  style={isActive ? { color: accent.text } : {}}
                >
                  {loading && isActive ? "···" : mood.label}
                </span>
              </button>
            );
          })}
        </div>

        {message.text && (
          <div className={`checkin-toast ${message.type}`}>
            <span className="toast-dot" />
            {message.text}
          </div>
        )}
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  .checkin-card {
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

  .checkin-glow {
    position: absolute;
    right: -90px;
    top: -90px;
    width: 240px;
    height: 240px;
    background: radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .checkin-header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 22px;
  }

  .checkin-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 6px;
  }

  .checkin-title {
    font-size: 20px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.94)" : "#0f172a"};
    margin-bottom: 4px;
  }

  .checkin-subtitle {
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
  }

  .checkin-saving {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 13px;
    border-radius: 999px;
    background: rgba(20,184,166,0.12);
    border: 1px solid rgba(20,184,166,0.28);
    color: #14b8a6;
    font-size: 12px;
    font-weight: 800;
    white-space: nowrap;
  }

  .checkin-ping {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #14b8a6;
    animation: ci-ping 1s ease-in-out infinite;
  }

  @keyframes ci-ping {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(1.45); }
  }

  .checkin-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 11px;
    margin-bottom: 18px;
  }

  @media (max-width: 720px) {
    .checkin-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (max-width: 420px) {
    .checkin-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .mood-btn {
    position: relative;
    overflow: hidden;
    min-height: 82px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 18px;
    padding: 13px 8px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.075)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.68)"};
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s ease;
  }

  .mood-btn:hover:not(:disabled) {
    transform: translateY(-3px);
    border-color: ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(14,165,233,0.22)"};
    background: ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.92)"};
    box-shadow: ${darkMode ? "0 14px 28px rgba(0,0,0,0.2)" : "0 14px 28px rgba(15,23,42,0.08)"};
  }

  .mood-btn:active:not(:disabled) {
    transform: scale(0.96);
  }

  .mood-btn:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  .mood-btn.is-active {
    transform: translateY(-2px);
  }

  .mood-btn-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .mood-btn.is-active .mood-btn-bar,
  .mood-btn:hover .mood-btn-bar {
    opacity: 1;
  }

  .mood-emoji {
    font-size: 25px;
    line-height: 1;
    transition: transform 0.18s ease;
  }

  .mood-btn:hover:not(:disabled) .mood-emoji {
    transform: scale(1.16);
  }

  .mood-btn.is-active .mood-emoji {
    transform: scale(1.12);
  }

  .mood-label {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.5)"};
    transition: color 0.18s ease;
  }

  .mood-btn:hover:not(:disabled) .mood-label {
    color: ${darkMode ? "rgba(255,255,255,0.75)" : "#0f172a"};
  }

  .checkin-toast {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 15px;
    font-size: 13px;
    font-weight: 800;
    animation: toast-in 0.25s ease;
    border: 1px solid;
  }

  @keyframes toast-in {
    from { opacity: 0; transform: translateY(6px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .checkin-toast.success {
    background: rgba(16,185,129,0.1);
    border-color: rgba(16,185,129,0.25);
    color: #34d399;
  }

  .checkin-toast.error {
    background: rgba(244,63,94,0.1);
    border-color: rgba(244,63,94,0.25);
    color: #fb7185;
  }

  .toast-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .success .toast-dot {
    background: #10b981;
    box-shadow: 0 0 10px rgba(16,185,129,0.7);
  }

  .error .toast-dot {
    background: #f43f5e;
    box-shadow: 0 0 10px rgba(244,63,94,0.7);
  }
`;

export default MoodCheckIn;