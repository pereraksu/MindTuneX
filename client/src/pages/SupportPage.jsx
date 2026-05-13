import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import SupportResponseCard from "../components/support/SupportResponseCard";
import RecommendationCard from "../components/support/RecommendationCard";
import { getSupportApi } from "../api/supportApi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";

const EMOTIONS = [
  { value: "joy", label: "Joy", emoji: "😄", from: "#f59e0b", to: "#f97316", text: "#fbbf24" },
  { value: "calm", label: "Calm", emoji: "😌", from: "#14b8a6", to: "#0ea5e9", text: "#2dd4bf" },
  { value: "stress", label: "Stress", emoji: "😤", from: "#f43f5e", to: "#e11d48", text: "#fb7185" },
  { value: "anxiety", label: "Anxiety", emoji: "😰", from: "#f97316", to: "#f59e0b", text: "#fb923c" },
  { value: "sadness", label: "Sadness", emoji: "😢", from: "#8b5cf6", to: "#6366f1", text: "#a78bfa" },
  { value: "anger", label: "Anger", emoji: "😡", from: "#ef4444", to: "#f43f5e", text: "#f87171" },
  { value: "fatigue", label: "Fatigue", emoji: "😴", from: "#64748b", to: "#475569", text: "#94a3b8" },
  { value: "love", label: "Love", emoji: "🥰", from: "#ec4899", to: "#f43f5e", text: "#f472b6" },
  { value: "fear", label: "Fear", emoji: "😨", from: "#818cf8", to: "#8b5cf6", text: "#a5b4fc" },
  { value: "disgust", label: "Disgust", emoji: "🤢", from: "#4ade80", to: "#22c55e", text: "#86efac" },
  { value: "surprise", label: "Surprise", emoji: "😲", from: "#14b8a6", to: "#06b6d4", text: "#5eead4" },
  { value: "neutral", label: "Neutral", emoji: "😐", from: "#64748b", to: "#475569", text: "#94a3b8" },
];

const SupportPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode } = useTheme();

  const [emotion, setEmotion] = useState("stress");
  const [support, setSupport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedEmo = EMOTIONS.find((e) => e.value === emotion) || EMOTIONS[0];

  const handleGetSupport = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getSupportApi({ emotion });
      setSupport(res?.data || res || null);
    } catch {
      setError("Failed to load support resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="sp-root">
        <div className="sp-glow sp-glow-1" />
        <div className="sp-glow sp-glow-2" />

        <Sidebar />

        <div className="sp-body">
          <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

          <main className="sp-main">
            <div className="sp-container">
              <section className="sp-hero">
                <div className="sp-hero-line" />

                <p className="sp-eyebrow">Personalized Emotional Support</p>

                <h1 className="sp-title">
                  Mental Health <span>Support</span>
                </h1>

                <p className="sp-subtitle">
                  Select the emotion that best matches how you feel right now to
                  receive supportive guidance, tailored recommendations, and calming
                  audio resources.
                </p>

                <div className="sp-pills">
                  <span className="sp-pill">⚡ Instant support</span>
                  <span className="sp-pill teal">🧠 Personalized recommendations</span>
                  <span className="sp-pill rose">🎧 Audio therapy suggestions</span>
                </div>
              </section>

              <section className="sp-card">
                <div className="sp-section-head">
                  <span className="sp-step">01</span>
                  <div>
                    <h2>How are you feeling right now?</h2>
                    <p>Choose one emotional state to get the most relevant support.</p>
                  </div>
                </div>

                <div className="sp-emo-grid">
                  {EMOTIONS.map((emo) => {
                    const active = emotion === emo.value;

                    return (
                      <button
                        key={emo.value}
                        type="button"
                        onClick={() => {
                          setEmotion(emo.value);
                          setSupport(null);
                          setError("");
                        }}
                        className={`sp-emo-btn ${active ? "active" : ""}`}
                        style={
                          active
                            ? {
                                color: emo.text,
                                borderColor: `${emo.from}55`,
                                background: `${emo.from}14`,
                              }
                            : {}
                        }
                      >
                        {active && (
                          <div
                            className="sp-emo-line"
                            style={{
                              background: `linear-gradient(90deg, ${emo.from}, ${emo.to})`,
                            }}
                          />
                        )}

                        <span className="sp-emo-emoji">{emo.emoji}</span>
                        <span className="sp-emo-label">{emo.label}</span>
                      </button>
                    );
                  })}
                </div>

                {error && <div className="sp-error">⚠️ {error}</div>}

                <div className="sp-action-row">
                  <p className="sp-selected">
                    Selected:{" "}
                    <strong style={{ color: selectedEmo.text }}>
                      {selectedEmo.emoji} {selectedEmo.label}
                    </strong>
                  </p>

                  <button
                    type="button"
                    onClick={handleGetSupport}
                    disabled={loading}
                    className="sp-main-btn"
                    style={{
                      background: `linear-gradient(135deg, ${selectedEmo.from}, ${selectedEmo.to})`,
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="sp-spinner" /> Finding support…
                      </>
                    ) : (
                      <>Get Personalized Support →</>
                    )}
                  </button>
                </div>
              </section>

              {support && (
                <section className="sp-results">
                  <div className="sp-section-head flat">
                    <span className="sp-step">02</span>
                    <div>
                      <h2>Your Personalized Action Plan</h2>
                      <p>Support guidance generated for your selected emotion.</p>
                    </div>
                  </div>

                  <div className="sp-results-grid">
                    <SupportResponseCard support={support} />
                    <RecommendationCard support={support} />
                  </div>

                  {support.youtubePlaylists?.length > 0 && (
                    <div className="sp-playlists">
                      <div className="sp-section-head flat">
                        <span className="sp-step">03</span>
                        <div>
                          <h2>Curated Music & Audio Therapy</h2>
                          <p>External YouTube resources for emotional regulation.</p>
                        </div>
                      </div>

                      <div className="sp-playlist-grid">
                        {support.youtubePlaylists.map((pl, index) => (
                          <a
                            key={`${pl.title}-${index}`}
                            href={pl.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sp-pl-card"
                          >
                            <div className="sp-pl-thumb-wrap">
                              {pl.thumbnail ? (
                                <img
                                  src={pl.thumbnail}
                                  alt={pl.title}
                                  className="sp-pl-thumb"
                                />
                              ) : (
                                <div className="sp-pl-placeholder">🎧</div>
                              )}

                              <div className="sp-pl-overlay">
                                <span>▶</span>
                              </div>
                            </div>

                            <div className="sp-pl-info">
                              <p>{pl.title}</p>
                              <span>Listen Now →</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>

            <div className="sp-footer-wrap">
              <Footer />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

  .sp-root {
    display: flex;
    min-height: 100svh;
    position: relative;
    overflow-x: hidden;
    font-family: 'DM Sans', system-ui, sans-serif;
    background: ${
      darkMode
        ? "radial-gradient(circle at top left, rgba(20,184,166,0.12), transparent 34%), #080c14"
        : "linear-gradient(135deg, #ecfeff 0%, #f8fafc 48%, #f0fdf4 100%)"
    };
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .sp-glow {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(70px);
    z-index: 0;
  }

  .sp-glow-1 {
    top: -120px;
    left: -100px;
    width: 470px;
    height: 470px;
    background: rgba(20,184,166,0.15);
  }

  .sp-glow-2 {
    bottom: -120px;
    right: -100px;
    width: 430px;
    height: 430px;
    background: rgba(14,165,233,0.12);
  }

  .sp-body {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .sp-main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
  }

  @media(min-width: 1024px) {
    .sp-main {
      padding: 36px 40px;
    }
  }

  .sp-container {
    max-width: 1120px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .sp-footer-wrap { 
    width: 100%;
    max-width: 1080px;
    margin:46px auto 0;
  }

  .sp-hero,
  .sp-card,
  .sp-results,
  .sp-playlists {
    border-radius: 28px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.82)"};
    backdrop-filter: blur(24px);
    box-shadow: ${darkMode ? "0 24px 60px rgba(0,0,0,0.28)" : "0 24px 60px rgba(15,23,42,0.09)"};
  }

  .sp-hero {
    position: relative;
    overflow: hidden;
    padding: 30px;
  }

  .sp-hero-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #14b8a6, #0ea5e9, #8b5cf6);
  }

  .sp-eyebrow {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #14b8a6;
    margin-bottom: 8px;
  }

  .sp-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 900;
    letter-spacing: -0.055em;
    line-height: 1.05;
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .sp-title span {
    background: linear-gradient(135deg, #14b8a6, #38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .sp-subtitle {
    margin-top: 12px;
    max-width: 660px;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.75;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.56)"};
  }

  .sp-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    margin-top: 20px;
  }

  .sp-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    border-radius: 999px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"};
    font-size: 11.5px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.5)" : "rgba(15,23,42,0.6)"};
  }

  .sp-pill.teal {
    color: #2dd4bf;
    background: rgba(20,184,166,0.1);
    border-color: rgba(20,184,166,0.25);
  }

  .sp-pill.rose {
    color: #fb7185;
    background: rgba(244,63,94,0.1);
    border-color: rgba(244,63,94,0.25);
  }

  .sp-card,
  .sp-results,
  .sp-playlists {
    padding: 26px;
  }

  .sp-section-head {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 22px;
  }

  .sp-section-head.flat {
    margin-bottom: 16px;
  }

  .sp-step {
    width: 36px;
    height: 36px;
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 900;
    color: #14b8a6;
    background: rgba(20,184,166,0.1);
    border: 1px solid rgba(20,184,166,0.26);
  }

  .sp-section-head h2 {
    font-size: 19px;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: ${darkMode ? "rgba(255,255,255,0.9)" : "#0f172a"};
  }

  .sp-section-head p {
    margin-top: 4px;
    font-size: 12.5px;
    font-weight: 600;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.52)"};
  }

  .sp-emo-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
  }

  @media(max-width: 1024px) {
    .sp-emo-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media(max-width: 640px) {
    .sp-emo-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media(max-width: 420px) {
    .sp-emo-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .sp-emo-btn {
    position: relative;
    overflow: hidden;
    min-height: 86px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 14px 8px;
    border-radius: 18px;
    cursor: pointer;
    font-family: inherit;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(255,255,255,0.045)" : "rgba(15,23,42,0.035)"};
    transition: all 0.18s ease;
  }

  .sp-emo-btn:hover {
    transform: translateY(-3px);
    border-color: ${darkMode ? "rgba(255,255,255,0.16)" : "rgba(20,184,166,0.22)"};
    background: ${darkMode ? "rgba(255,255,255,0.075)" : "rgba(255,255,255,0.75)"};
  }

  .sp-emo-btn.active {
    transform: translateY(-2px);
  }

  .sp-emo-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
  }

  .sp-emo-emoji {
    font-size: 25px;
    line-height: 1;
  }

  .sp-emo-label {
    font-size: 11.5px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.55)"};
  }

  .sp-error {
    margin-top: 16px;
    padding: 12px 15px;
    border-radius: 16px;
    border: 1px solid rgba(244,63,94,0.25);
    background: rgba(244,63,94,0.1);
    color: #fb7185;
    font-size: 13px;
    font-weight: 700;
  }

  .sp-action-row {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"};
  }

  @media(min-width: 720px) {
    .sp-action-row {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .sp-selected {
    font-size: 13px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.56)"};
  }

  .sp-main-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-height: 48px;
    padding: 13px 26px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
    font-weight: 900;
    color: #fff;
    box-shadow: 0 16px 34px rgba(20,184,166,0.25);
    transition: all 0.2s ease;
  }

  .sp-main-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  .sp-main-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .sp-spinner {
    width: 15px;
    height: 15px;
    border-radius: 999px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    animation: sp-spin 0.75s linear infinite;
  }

  @keyframes sp-spin {
    to { transform: rotate(360deg); }
  }

  .sp-results {
    display: flex;
    flex-direction: column;
    gap: 18px;
    animation: sp-fade 0.3s ease;
  }

  @keyframes sp-fade {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .sp-results-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @media(min-width: 1024px) {
    .sp-results-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .sp-playlist-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media(min-width: 900px) {
    .sp-playlist-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .sp-pl-card {
    overflow: hidden;
    border-radius: 20px;
    text-decoration: none;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(255,255,255,0.045)" : "rgba(15,23,42,0.035)"};
    transition: all 0.18s ease;
  }

  .sp-pl-card:hover {
    transform: translateY(-4px);
    border-color: rgba(239,68,68,0.24);
  }

  .sp-pl-thumb-wrap {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(15,23,42,0.08)"};
  }

  .sp-pl-thumb,
  .sp-pl-placeholder {
    width: 100%;
    height: 100%;
  }

  .sp-pl-thumb {
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  .sp-pl-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
  }

  .sp-pl-card:hover .sp-pl-thumb {
    transform: scale(1.06);
  }

  .sp-pl-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.35);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .sp-pl-overlay span {
    width: 42px;
    height: 42px;
    border-radius: 999px;
    background: #ef4444;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 24px rgba(239,68,68,0.35);
  }

  .sp-pl-card:hover .sp-pl-overlay {
    opacity: 1;
  }

  .sp-pl-info {
    padding: 13px 14px;
  }

  .sp-pl-info p {
    font-size: 12.5px;
    font-weight: 800;
    line-height: 1.5;
    color: ${darkMode ? "rgba(255,255,255,0.66)" : "rgba(15,23,42,0.72)"};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .sp-pl-info span {
    display: inline-block;
    margin-top: 8px;
    font-size: 11.5px;
    font-weight: 900;
    color: #14b8a6;
  }
`;

export default SupportPage;