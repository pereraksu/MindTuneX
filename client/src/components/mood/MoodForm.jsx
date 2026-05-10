import { useState } from "react";
import { predictMoodApi, saveMoodApi } from "../../api/moodApi";
import { getSupportApi } from "../../api/supportApi";
import { useTheme } from "../../context/useTheme";

const EMOTION_EMOJI = {
  joy: "😄", calm: "😌", stress: "😤", anxiety: "😰",
  sadness: "😢", anger: "😡", fatigue: "😴", love: "🥰",
  fear: "😨", disgust: "🤢", surprise: "😲", neutral: "😐",
};

const EMOTION_ACCENT = {
  joy: "#f59e0b", calm: "#14b8a6", stress: "#f43f5e", anxiety: "#f97316",
  sadness: "#8b5cf6", anger: "#ef4444", fatigue: "#64748b", love: "#ec4899",
  fear: "#818cf8", disgust: "#4ade80", surprise: "#06b6d4", neutral: "#64748b",
};

const MoodForm = ({ onSaved }) => {
  const { darkMode } = useTheme();

  const [text, setText] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [support, setSupport] = useState(null);
  const [loadingPredict, setLoadingPredict] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    if (!text.trim()) return;

    try {
      setError("");
      setLoadingPredict(true);

      const res = await predictMoodApi({ text });
      const result = res?.data || res;
      setPrediction(result);

      const supportRes = await getSupportApi({
        emotion: result.predictedEmotion,
      });

      setSupport(supportRes?.data || supportRes);
    } catch (err) {
      setError(err?.response?.data?.message || "Prediction failed");
    } finally {
      setLoadingPredict(false);
    }
  };

  const handleSave = async () => {
    if (!text.trim()) return;

    try {
      setError("");
      setLoadingSave(true);

      await saveMoodApi({
        text,
        source: "journal",
      });

      setText("");
      setPrediction(null);
      setSupport(null);

      if (onSaved) onSaved();
    } catch (err) {
      setError(err?.response?.data?.message || "Save failed");
    } finally {
      setLoadingSave(false);
    }
  };

  const emoKey = prediction?.predictedEmotion?.toLowerCase() || "neutral";
  const emoji = EMOTION_EMOJI[emoKey] || "😐";
  const accent = EMOTION_ACCENT[emoKey] || EMOTION_ACCENT.neutral;

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="mf-card">
        <div className="mf-glow" />

        <div className="mf-header">
          <p className="mf-eyebrow">Mood Analysis</p>
          <h2 className="mf-title">Analyze your emotional state</h2>
          <p className="mf-subtitle">
            Write how you feel today and let the AI predict your emotional state.
          </p>
        </div>

        {error && <div className="mf-alert error">⚠️ {error}</div>}

        <textarea
          rows="6"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write how you feel today..."
          className="mf-textarea"
        />

        <div className="mf-actions">
          <button
            onClick={handlePredict}
            disabled={loadingPredict || !text.trim()}
            className="mf-primary"
          >
            {loadingPredict ? "Predicting..." : "Predict Mood"}
          </button>

          <button
            onClick={handleSave}
            disabled={loadingSave || !text.trim()}
            className="mf-secondary"
          >
            {loadingSave ? "Saving..." : "Save Entry"}
          </button>
        </div>

        {prediction && (
          <div className="mf-result">
            <div className="mf-result-head">
              <div
                className="mf-emoji"
                style={{
                  background: `${accent}18`,
                  borderColor: `${accent}33`,
                }}
              >
                {emoji}
              </div>

              <div>
                <h3 style={{ color: accent }}>
                  {prediction.predictedEmotion}
                </h3>

                <div className="mf-tags">
                  <span>Confidence: {Math.round((prediction.confidence || 0) * 100)}%</span>
                  <span>{prediction.sentimentLabel || "neutral"}</span>
                </div>
              </div>
            </div>

            <div className="mf-info-grid">
              <InfoPill label="Confidence Level" value={prediction.confidenceLevel || "N/A"} />
              <InfoPill label="Sentiment Score" value={prediction.sentimentScore ?? "N/A"} />
              <InfoPill label="Recommendation" value={prediction.recommendationType || "N/A"} />
              <InfoPill label="Support Level" value={prediction.supportLevel || "N/A"} />
            </div>
          </div>
        )}

        {support && (
          <div className="mf-support">
            <p>Support Response</p>
            <span>{support.supportResponse}</span>
          </div>
        )}
      </div>
    </>
  );
};

const InfoPill = ({ label, value }) => (
  <div className="mf-pill">
    <p>{label}</p>
    <span>{value}</span>
  </div>
);

const STYLES = (darkMode) => `
  .mf-card {
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

  .mf-glow {
    position: absolute;
    right: -90px;
    top: -90px;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .mf-header,
  .mf-textarea,
  .mf-actions,
  .mf-result,
  .mf-support,
  .mf-alert {
    position: relative;
    z-index: 1;
  }

  .mf-header {
    margin-bottom: 22px;
  }

  .mf-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 6px;
  }

  .mf-title {
    font-size: 22px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.95)" : "#0f172a"};
    margin-bottom: 6px;
  }

  .mf-subtitle {
    font-size: 13px;
    line-height: 1.6;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
  }

  .mf-alert {
    margin-bottom: 16px;
    border-radius: 16px;
    padding: 13px 16px;
    font-size: 13px;
    font-weight: 800;
  }

  .mf-alert.error {
    background: rgba(244,63,94,0.1);
    border: 1px solid rgba(244,63,94,0.25);
    color: #fb7185;
  }

  .mf-textarea {
    width: 100%;
    resize: none;
    box-sizing: border-box;
    border-radius: 22px;
    padding: 18px;
    line-height: 1.7;
    outline: none;
    font-family: inherit;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.09)"};
    background: ${darkMode ? "rgba(15,23,42,0.58)" : "rgba(255,255,255,0.82)"};
    color: ${darkMode ? "rgba(255,255,255,0.86)" : "#0f172a"};
  }

  .mf-textarea::placeholder {
    color: ${darkMode ? "rgba(255,255,255,0.28)" : "rgba(15,23,42,0.35)"};
  }

  .mf-textarea:focus {
    border-color: rgba(20,184,166,0.55);
    box-shadow: 0 0 0 4px rgba(20,184,166,0.12);
  }

  .mf-actions {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .mf-primary,
  .mf-secondary {
    border: none;
    border-radius: 999px;
    padding: 12px 20px;
    font-size: 13px;
    font-weight: 900;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .mf-primary {
    color: white;
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    box-shadow: 0 14px 28px rgba(20,184,166,0.22);
  }

  .mf-secondary {
    color: ${darkMode ? "rgba(255,255,255,0.72)" : "#0f172a"};
    background: ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.06)"};
  }

  .mf-primary:hover:not(:disabled),
  .mf-secondary:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .mf-primary:disabled,
  .mf-secondary:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .mf-result {
    margin-top: 22px;
    border-radius: 20px;
    padding: 18px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)"};
  }

  .mf-result-head {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }

  .mf-emoji {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
  }

  .mf-result h3 {
    font-size: 21px;
    font-weight: 900;
    text-transform: capitalize;
    margin-bottom: 8px;
  }

  .mf-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .mf-tags span {
    border-radius: 999px;
    padding: 5px 12px;
    font-size: 11px;
    font-weight: 800;
    color: #38bdf8;
    background: rgba(14,165,233,0.1);
    border: 1px solid rgba(14,165,233,0.24);
  }

  .mf-info-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 12px;
  }

  @media(min-width: 640px) {
    .mf-info-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .mf-pill {
    border-radius: 16px;
    padding: 14px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.075)" : "rgba(15,23,42,0.075)"};
    background: ${darkMode ? "rgba(15,23,42,0.45)" : "rgba(255,255,255,0.76)"};
  }

  .mf-pill p {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 7px;
  }

  .mf-pill span {
    font-size: 13px;
    font-weight: 800;
    text-transform: capitalize;
    color: ${darkMode ? "rgba(255,255,255,0.8)" : "#0f172a"};
  }

  .mf-support {
    margin-top: 18px;
    border-radius: 20px;
    padding: 18px;
    background: rgba(20,184,166,0.1);
    border: 1px solid rgba(20,184,166,0.24);
  }

  .mf-support p {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #14b8a6;
    margin-bottom: 10px;
  }

  .mf-support span {
    display: block;
    font-size: 13px;
    line-height: 1.7;
    color: ${darkMode ? "rgba(255,255,255,0.68)" : "rgba(15,23,42,0.68)"};
  }
`;

export default MoodForm;