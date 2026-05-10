import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "regenerator-runtime/runtime";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";
import { predictMoodApi, saveMoodApi } from "../api/moodApi";
import { getSupportApi } from "../api/supportApi";
import CrisisAlertModal from "../components/common/CrisisAlertModal";

const EMOTION_EMOJI = {
  joy: "😄", calm: "😌", stress: "😤", anxiety: "😰",
  sadness: "😢", anger: "😡", fatigue: "😴", love: "🥰",
  fear: "😨", disgust: "🤢", surprise: "😲", neutral: "😐",
};

const EMOTION_ACCENT = {
  joy: { from: "#f59e0b", to: "#f97316", text: "#fbbf24", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.22)" },
  calm: { from: "#14b8a6", to: "#0ea5e9", text: "#2dd4bf", bg: "rgba(20,184,166,0.1)", border: "rgba(20,184,166,0.22)" },
  stress: { from: "#f43f5e", to: "#e11d48", text: "#fb7185", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.22)" },
  anxiety: { from: "#f97316", to: "#f59e0b", text: "#fb923c", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.22)" },
  sadness: { from: "#8b5cf6", to: "#6366f1", text: "#a78bfa", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.22)" },
  anger: { from: "#ef4444", to: "#f43f5e", text: "#f87171", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.22)" },
  fatigue: { from: "#64748b", to: "#475569", text: "#94a3b8", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.22)" },
  love: { from: "#ec4899", to: "#f43f5e", text: "#f472b6", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.22)" },
  fear: { from: "#818cf8", to: "#8b5cf6", text: "#a5b4fc", bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.22)" },
  disgust: { from: "#4ade80", to: "#22c55e", text: "#86efac", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.22)" },
  surprise: { from: "#14b8a6", to: "#06b6d4", text: "#5eead4", bg: "rgba(20,184,166,0.1)", border: "rgba(20,184,166,0.22)" },
  neutral: { from: "#64748b", to: "#475569", text: "#94a3b8", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.22)" },
};

const SENTIMENT_ACCENT = {
  positive: { text: "#34d399", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.22)" },
  negative: { text: "#fb7185", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.22)" },
  neutral: { text: "#94a3b8", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.22)" },
};

const QUICK_INPUTS = [
  { label: "😄 Joy", text: "I feel so happy and excited today" },
  { label: "😌 Calm", text: "I feel peaceful and calm after my morning meditation" },
  { label: "😤 Stress", text: "I feel really stressed about my deadlines and assignments" },
  { label: "😰 Anxiety", text: "I am feeling anxious and nervous about tomorrow" },
  { label: "😢 Sadness", text: "I feel sad and lonely, nothing is going right" },
  { label: "😡 Anger", text: "I am angry and frustrated about what happened" },
  { label: "😴 Fatigue", text: "I am completely exhausted and drained after studying all night" },
  { label: "🥰 Love", text: "I feel full of love and warmth when I think about my family" },
  { label: "😨 Fear", text: "I feel scared and fearful about the future" },
  { label: "🤢 Disgust", text: "I feel disgusted and uncomfortable after seeing that" },
  { label: "😲 Surprise", text: "I am really surprised and shocked by this unexpected event" },
  { label: "😐 Neutral", text: "I feel normal, nothing special happened today" },
];

function MoodAnalysis() {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode } = useTheme();

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [support, setSupport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);

  const charLimit = 500;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setText(transcript);
  }, [transcript]);

  const handleToggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setError("");
    setLoading(true);
    setSaved(false);
    setResult(null);
    setSupport(null);

    try {
      const prediction = await predictMoodApi({ text });

      if (!prediction?.predictedEmotion) {
        throw new Error("Invalid prediction response");
      }

      setResult(prediction);

      try {
        const supportRes = await getSupportApi({
          emotion: prediction.predictedEmotion,
        });
        setSupport(supportRes?.data || supportRes || null);
      } catch {
        setSupport(null);
      }

      const emo = prediction.predictedEmotion?.toLowerCase();
      const isNegative = prediction.sentimentLabel?.toLowerCase() === "negative";

      if (["fear", "sadness", "stress", "anxiety"].includes(emo) && isNegative) {
        setTimeout(() => setShowCrisisAlert(true), 500);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Analysis failed. Please try again."
      );
      setResult(null);
      setSupport(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    try {
      await saveMoodApi({
        text,
        inputText: text,
        predictedEmotion: result.predictedEmotion,
        sentimentLabel: result.sentimentLabel,
        confidence: result.confidence,
        source: "analysis",
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save. Please try again.");
    }
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setSupport(null);
    setError("");
    setSaved(false);
    setShowCrisisAlert(false);
    resetTranscript();
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Your browser does not support voice input.
      </div>
    );
  }

  return (
    <>
      <style>{PAGE_STYLES(darkMode)}</style>

      <div className="ma-root">
        <Sidebar />

        <div className="ma-body">
          <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

          <main className="ma-main">
            <div className="ma-container">
              <div className="ma-header">
                <p className="ma-eyebrow">Emotional Intelligence</p>
                <h1 className="ma-title">
                  Mood <span className="ma-title-accent">Analysis</span>
                </h1>
                <p className="ma-subtitle">
                  Describe how you feel — use your <strong>voice</strong> or type below.
                </p>
              </div>

              <div className="ma-input-card">
                <div className="ma-quick-section">
                  <p className="ma-section-label">Quick select</p>
                  <div className="ma-quick-grid">
                    {QUICK_INPUTS.map(({ label, text: quickText }) => (
                      <button
                        key={label}
                        onClick={() => {
                          setText(quickText);
                          setResult(null);
                          setSupport(null);
                          setError("");
                        }}
                        className="ma-quick-btn"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ma-textarea-wrap">
                  <textarea
                    value={text}
                    onChange={(e) => {
                      if (e.target.value.length <= charLimit) {
                        setText(e.target.value);
                      }
                      if (result) setResult(null);
                      if (support) setSupport(null);
                    }}
                    rows={6}
                    placeholder={
                      listening
                        ? "Listening… speak now"
                        : "How are you feeling right now?"
                    }
                    className={`ma-textarea${listening ? " ma-textarea-listening" : ""}`}
                  />

                  <button
                    type="button"
                    onClick={handleToggleListening}
                    className={`ma-mic-btn${listening ? " ma-mic-active" : ""}`}
                    title={listening ? "Stop listening" : "Start voice input"}
                  >
                    {listening ? "⏸" : "🎤"}
                  </button>

                  <span
                    className={`ma-char-count${
                      text.length > charLimit * 0.85 ? " ma-char-warn" : ""
                    }`}
                  >
                    {text.length}/{charLimit}
                  </span>
                </div>

                {error && <div className="ma-error">⚠️ {error}</div>}

                <div className="ma-actions">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !text.trim()}
                    className="ma-btn-analyze"
                  >
                    {loading ? (
                      <>
                        <span className="ma-spinner" />
                        Analysing…
                      </>
                    ) : (
                      <>Analyse My Mood →</>
                    )}
                  </button>

                  {result && (
                    <button
                      onClick={handleSave}
                      className={`ma-btn-save${saved ? " ma-btn-saved" : ""}`}
                    >
                      {saved ? "✓ Saved" : "Save Entry"}
                    </button>
                  )}

                  {(text || result) && (
                    <button onClick={handleClear} className="ma-btn-clear">
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {result && <ResultPanel result={result} support={support} />}
            </div>
          </main>
        </div>
      </div>

      <CrisisAlertModal
        isOpen={showCrisisAlert}
        onClose={() => setShowCrisisAlert(false)}
      />
    </>
  );
}

const ResultPanel = ({ result, support }) => {
  const emoKey = result.predictedEmotion?.toLowerCase() || "neutral";
  const emoji = EMOTION_EMOJI[emoKey] || "😐";
  const accent = EMOTION_ACCENT[emoKey] || EMOTION_ACCENT.neutral;
  const sentKey = result.sentimentLabel?.toLowerCase() || "neutral";
  const sentAcc = SENTIMENT_ACCENT[sentKey] || SENTIMENT_ACCENT.neutral;
  const confPct =
    result.confidencePercentage || Math.round((result.confidence || 0) * 100);

  const topPredictions = Array.isArray(result.top3Predictions)
    ? result.top3Predictions
    : [];

  const explanationKeywords = Array.isArray(result.explanationKeywords)
    ? result.explanationKeywords
    : [];

  const playlists = support?.youtubePlaylists || [];
  const featuredPlaylist = playlists[0] || null;
  const featuredEmbedUrl = featuredPlaylist?.url
    ? featuredPlaylist.url.replace(
        "https://www.youtube.com/playlist?list=",
        "https://www.youtube.com/embed/videoseries?list="
      )
    : null;

  return (
    <div className="ma-result-panel">
      <div className="ma-result-header">
        <div
          className="ma-result-emoji-wrap"
          style={{
            background: `linear-gradient(135deg,${accent.from}22,${accent.to}33)`,
            border: `1px solid ${accent.border}`,
          }}
        >
          <span className="ma-result-emoji">{emoji}</span>
        </div>

        <div>
          <p className="ma-result-emotion" style={{ color: accent.text }}>
            {emoKey}
          </p>

          <div className="ma-result-badges">
            <span
              className="ma-badge"
              style={{
                color: accent.text,
                background: accent.bg,
                borderColor: accent.border,
              }}
            >
              {confPct}% confidence
            </span>

            <span
              className="ma-badge"
              style={{
                color: sentAcc.text,
                background: sentAcc.bg,
                borderColor: sentAcc.border,
              }}
            >
              {result.sentimentLabel || "neutral"}
            </span>

            {result.confidenceLevel && (
              <span className="ma-badge ma-neutral-badge">
                {result.confidenceLevel} level
              </span>
            )}

            {typeof result.riskScore === "number" && (
              <span className="ma-badge ma-purple-badge">
                Risk: {result.riskScore}/100
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="ma-info-grid">
        <InfoCard title="Support Level" value={result.supportLevel || "moderate"} />
        <InfoCard title="Trigger Category" value={result.triggerCategory || "general"} />
        <InfoCard
          title="Recommendation Type"
          value={(result.recommendationType || "general reflection").replaceAll("_", " ")}
        />
      </div>

      {topPredictions.length > 0 && (
        <div className="ma-section">
          <p className="ma-section-label">Top 3 AI Predictions</p>
          <div className="ma-predictions">
            {topPredictions.map((item, i) => {
              const pct =
                item.score <= 1 ? Math.round(item.score * 100) : Math.round(item.score);
              const a = EMOTION_ACCENT[item.emotion?.toLowerCase()] || EMOTION_ACCENT.neutral;

              return (
                <div key={`${item.emotion}-${i}`} className="ma-pred-item">
                  <div className="ma-pred-row">
                    <span className="ma-pred-emoji">
                      {EMOTION_EMOJI[item.emotion?.toLowerCase()] || "😐"}
                    </span>
                    <span className="ma-pred-name">{item.emotion}</span>
                    <span className="ma-pred-pct" style={{ color: a.text }}>
                      {pct}%
                    </span>
                  </div>

                  <div className="ma-bar-track">
                    <div
                      className="ma-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg,${a.from},${a.to})`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {explanationKeywords.length > 0 && (
        <div className="ma-section">
          <p className="ma-section-label">Detected Keywords</p>
          <div className="ma-keywords">
            {explanationKeywords.map((kw, i) => (
              <span key={`${kw}-${i}`} className="ma-keyword">
                #{kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {support?.supportResponse && (
        <div className="ma-support-box">
          <p className="ma-support-eyebrow">Support Guidance</p>
          <p className="ma-support-text">{support.supportResponse}</p>
        </div>
      )}

      {support?.recommendations?.length > 0 && (
        <div className="ma-section">
          <p className="ma-section-label">Recommendations</p>
          <div className="ma-rec-grid">
            {support.recommendations.map((item, i) => (
              <div key={i} className="ma-rec-item">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {featuredPlaylist && featuredEmbedUrl && (
        <div className="ma-playlist-section">
          <div className="ma-playlist-header">
            <span>🎶</span>
            <span className="ma-playlist-title">Featured Playlist</span>
          </div>

          <p className="ma-playlist-name">{featuredPlaylist.title}</p>

          <div className="ma-embed-wrap">
            <iframe
              className="ma-embed"
              src={`${featuredEmbedUrl}&rel=0`}
              title="YouTube Playlist"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <a
            href={featuredPlaylist.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ma-playlist-link"
          >
            Open playlist in YouTube →
          </a>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ title, value }) => (
  <div className="ma-info-card">
    <p className="ma-info-card-label">{title}</p>
    <p className="ma-info-card-val">{value}</p>
  </div>
);

const PAGE_STYLES = (darkMode) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Serif+Display&display=swap');

  .ma-root {
    display: flex;
    min-height: 100svh;
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
    overflow-x: hidden;
    background: ${
      darkMode
        ? "radial-gradient(circle at top left, rgba(20,184,166,0.10), transparent 34%), radial-gradient(circle at bottom right, rgba(14,165,233,0.08), transparent 38%), #050810"
        : "linear-gradient(135deg, #ecfeff 0%, #f8fafc 45%, #eef2ff 100%)"
    };
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .ma-body {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .ma-main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
  }

  @media(min-width:1024px) {
    .ma-main { padding: 38px 42px; }
  }

  .ma-container {
    max-width: 920px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .ma-header,
  .ma-input-card,
  .ma-result-panel {
    border-radius: 28px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"};
    backdrop-filter: blur(24px);
    box-shadow: ${darkMode ? "0 26px 70px rgba(0,0,0,0.28)" : "0 26px 70px rgba(15,23,42,0.09)"};
  }

  .ma-header {
    position: relative;
    overflow: hidden;
    padding: 32px;
  }

  .ma-header::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, #14b8a6, #0ea5e9, #8b5cf6);
  }

  .ma-eyebrow {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #14b8a6;
    margin-bottom: 10px;
  }

  .ma-title {
    font-size: clamp(34px,5vw,52px);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.055em;
    color: ${darkMode ? "rgba(255,255,255,0.96)" : "#0f172a"};
    margin: 0 0 14px;
  }

  .ma-title-accent {
    background: linear-gradient(135deg,#14b8a6,#38bdf8,#818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .ma-subtitle {
    max-width: 620px;
    font-size: 14px;
    line-height: 1.75;
    color: ${darkMode ? "rgba(255,255,255,0.44)" : "rgba(15,23,42,0.58)"};
    font-weight: 600;
  }

  .ma-subtitle strong {
    color: #14b8a6;
    font-weight: 900;
  }

  .ma-input-card {
    padding: 26px;
  }

  .ma-quick-section {
    margin-bottom: 20px;
  }

  .ma-section-label {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.32)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 12px;
  }

  .ma-quick-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ma-quick-btn {
    padding: 7px 14px;
    border-radius: 999px;
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    color: ${darkMode ? "rgba(255,255,255,0.58)" : "rgba(15,23,42,0.62)"};
    font-size: 12px;
    font-weight: 800;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .ma-quick-btn:hover {
    background: rgba(20,184,166,0.12);
    border-color: rgba(20,184,166,0.28);
    color: #14b8a6;
    transform: translateY(-2px);
  }

  .ma-textarea-wrap {
    position: relative;
    margin-bottom: 16px;
  }

  .ma-textarea {
    width: 100%;
    resize: none;
    border-radius: 22px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)"};
    background: ${darkMode ? "rgba(2,6,23,0.45)" : "rgba(255,255,255,0.8)"};
    padding: 20px 62px 44px 20px;
    font-size: 14px;
    line-height: 1.7;
    color: ${darkMode ? "rgba(255,255,255,0.82)" : "#0f172a"};
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
    transition: all 0.22s ease;
  }

  .ma-textarea::placeholder {
    color: ${darkMode ? "rgba(255,255,255,0.25)" : "rgba(15,23,42,0.34)"};
  }

  .ma-textarea:focus,
  .ma-textarea-listening {
    border-color: rgba(20,184,166,0.55);
    box-shadow: 0 0 0 4px rgba(20,184,166,0.13);
  }

  .ma-mic-btn {
    position: absolute;
    bottom: 14px;
    right: 52px;
    width: 34px;
    height: 34px;
    border-radius: 999px;
    background: rgba(20,184,166,0.13);
    border: 1px solid rgba(20,184,166,0.32);
    color: #14b8a6;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ma-mic-active {
    background: rgba(244,63,94,0.14) !important;
    border-color: rgba(244,63,94,0.34) !important;
    color: #fb7185 !important;
  }

  .ma-char-count {
    position: absolute;
    bottom: 22px;
    right: 16px;
    font-size: 10px;
    font-family: monospace;
    color: ${darkMode ? "rgba(255,255,255,0.28)" : "rgba(15,23,42,0.4)"};
  }

  .ma-char-warn { color: #fb7185 !important; }

  .ma-error {
    padding: 12px 16px;
    border-radius: 16px;
    margin-bottom: 14px;
    background: rgba(244,63,94,0.09);
    border: 1px solid rgba(244,63,94,0.24);
    font-size: 13px;
    color: #fb7185;
    font-weight: 700;
  }

  .ma-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .ma-btn-analyze {
    flex: 1;
    min-width: 190px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 14px 24px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    background: linear-gradient(135deg,#14b8a6,#0ea5e9);
    color: #fff;
    font-size: 14px;
    font-weight: 900;
    box-shadow: 0 16px 34px rgba(20,184,166,0.24);
    transition: all 0.18s ease;
  }

  .ma-btn-analyze:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .ma-btn-analyze:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }

  .ma-spinner {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .ma-btn-save,
  .ma-btn-clear {
    padding: 14px 21px;
    border-radius: 999px;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
    font-weight: 900;
    transition: all 0.18s ease;
  }

  .ma-btn-save {
    background: ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.05)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.1)"};
    color: ${darkMode ? "rgba(255,255,255,0.62)" : "rgba(15,23,42,0.62)"};
  }

  .ma-btn-saved {
    border-color: rgba(16,185,129,0.35) !important;
    color: #34d399 !important;
    background: rgba(16,185,129,0.1) !important;
  }

  .ma-btn-clear {
    background: transparent;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.45)"};
  }

  .ma-result-panel {
    padding: 30px;
    gap: 24px;
    display: flex;
    flex-direction: column;
  }

  .ma-result-header {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
  }

  .ma-result-emoji-wrap {
    width: 78px;
    height: 78px;
    border-radius: 24px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ma-result-emoji {
    font-size: 40px;
  }

  .ma-result-emotion {
    font-size: 34px;
    font-weight: 900;
    text-transform: capitalize;
    letter-spacing: -0.04em;
    margin-bottom: 10px;
  }

  .ma-result-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }

  .ma-badge {
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.04em;
    border: 1px solid;
    text-transform: capitalize;
  }

  .ma-neutral-badge {
    color: ${darkMode ? "rgba(255,255,255,0.55)" : "rgba(15,23,42,0.58)"};
    background: ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.05)"};
    border-color: ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.09)"};
  }

  .ma-purple-badge {
    color: #a78bfa;
    background: rgba(139,92,246,0.1);
    border-color: rgba(139,92,246,0.22);
  }

  .ma-info-grid {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 12px;
  }

  @media(max-width:640px) {
    .ma-info-grid { grid-template-columns: 1fr; }
  }

  .ma-info-card,
  .ma-pred-item,
  .ma-rec-item {
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.62)"};
  }

  .ma-info-card {
    border-radius: 18px;
    padding: 17px;
  }

  .ma-info-card-label {
    font-size: 9.5px;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.32)" : "rgba(15,23,42,0.44)"};
    margin-bottom: 8px;
  }

  .ma-info-card-val {
    font-size: 13px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.76)" : "#0f172a"};
    text-transform: capitalize;
  }

  .ma-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ma-predictions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ma-pred-item {
    border-radius: 16px;
    padding: 15px 17px;
  }

  .ma-pred-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .ma-pred-emoji { font-size: 18px; }

  .ma-pred-name {
    font-size: 13px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.72)" : "#0f172a"};
    text-transform: capitalize;
    flex: 1;
  }

  .ma-pred-pct {
    font-size: 13px;
    font-weight: 950;
  }

  .ma-bar-track {
    height: 5px;
    width: 100%;
    border-radius: 999px;
    background: ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    overflow: hidden;
  }

  .ma-bar-fill {
    height: 100%;
    border-radius: 999px;
  }

  .ma-keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ma-keyword {
    padding: 6px 13px;
    border-radius: 999px;
    background: rgba(20,184,166,0.11);
    border: 1px solid rgba(20,184,166,0.24);
    color: #14b8a6;
    font-size: 11.5px;
    font-weight: 900;
  }

  .ma-support-box {
    background: rgba(14,165,233,0.08);
    border: 1px solid rgba(14,165,233,0.22);
    border-radius: 18px;
    padding: 20px;
  }

  .ma-support-eyebrow {
    font-size: 9.5px;
    font-weight: 900;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #38bdf8;
    margin-bottom: 9px;
  }

  .ma-support-text {
    font-size: 13.5px;
    line-height: 1.75;
    color: ${darkMode ? "rgba(255,255,255,0.58)" : "rgba(15,23,42,0.62)"};
    font-weight: 600;
  }

  .ma-rec-grid {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 10px;
  }

  @media(max-width:640px) {
    .ma-rec-grid { grid-template-columns: 1fr; }
  }

  .ma-rec-item {
    border-radius: 16px;
    padding: 15px 17px;
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.5)" : "rgba(15,23,42,0.62)"};
    line-height: 1.65;
    font-weight: 650;
  }

  .ma-playlist-section {
    border-top: 1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.08)"};
    padding-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ma-playlist-header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ma-playlist-title {
    font-size: 15px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.78)" : "#0f172a"};
  }

  .ma-playlist-name {
    font-size: 14px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.56)" : "rgba(15,23,42,0.64)"};
  }

  .ma-embed-wrap {
    aspect-ratio: 16/9;
    border-radius: 18px;
    overflow: hidden;
    background: rgba(0,0,0,0.3);
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
  }

  .ma-embed {
    width: 100%;
    height: 100%;
    border: none;
  }

  .ma-playlist-link {
    font-size: 12.5px;
    font-weight: 900;
    color: #14b8a6;
    text-decoration: none;
  }

  @media(max-width:640px) {
    .ma-main { padding: 24px 16px; }

    .ma-header,
    .ma-input-card,
    .ma-result-panel {
      border-radius: 24px;
      padding: 24px;
    }

    .ma-title { font-size: 36px; }

    .ma-actions { flex-direction: column; }

    .ma-btn-analyze,
    .ma-btn-save,
    .ma-btn-clear {
      width: 100%;
    }
  }
`;

export default MoodAnalysis;