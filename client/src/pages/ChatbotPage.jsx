import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";
import { getChatHistoryApi, sendChatMessageApi } from "../api/chatbotApi";

const QUICK_PROMPTS = [
  "I feel stressed about my studies",
  "I feel very anxious today",
  "I feel calm and peaceful",
  "I feel lonely",
  "Can you help me calm down?",
  "Give me a journaling prompt",
];

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

const EMOTION_ACCENT = {
  joy: "#fbbf24",
  calm: "#2dd4bf",
  stress: "#fb7185",
  anxiety: "#fb923c",
  sadness: "#a78bfa",
  anger: "#f87171",
  fatigue: "#94a3b8",
  love: "#f472b6",
  fear: "#a5b4fc",
  disgust: "#86efac",
  surprise: "#5eead4",
  neutral: "#94a3b8",
};

const formatTime = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const ChatbotPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode } = useTheme();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoadingHistory(true);
        const res = await getChatHistoryApi();
        setMessages(res?.data || []);
      } catch {
        setMessages([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = async (customMessage) => {
    const msg = (customMessage || input).trim();
    if (!msg || typing) return;

    setError("");
    setTyping(true);

    const temp = {
      _id: `temp-${Date.now()}`,
      sender: "user",
      message: msg,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, temp]);
    setInput("");

    try {
      const res = await sendChatMessageApi({ message: msg });

      setMessages((prev) => {
        const clean = prev.filter((m) => m._id !== temp._id);
        return [
          ...clean,
          res?.data?.userMessage,
          res?.data?.botMessage,
        ].filter(Boolean);
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send message.");
      setMessages((prev) =>
        prev.filter((m) => !String(m._id).startsWith("temp-"))
      );
    } finally {
      setTyping(false);
    }
  };

  const latestBotAnalysis = useMemo(() => {
    const bot = [...messages]
      .reverse()
      .find((m) => m.sender === "bot" && m.analysis);

    return bot?.analysis || null;
  }, [messages]);

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="cb-root">
        <div className="cb-glow cb-glow-1" />
        <div className="cb-glow cb-glow-2" />

        <Sidebar />

        <div className="cb-body">
          <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

          <main className="cb-main">
            <div className="cb-container">
              <div className="cb-hero">
                <div className="cb-hero-bar" />

                <p className="cb-eyebrow">Wellness Assistant</p>

                <h1 className="cb-title">
                  MindTuneX <span>Chatbot</span>
                </h1>

                <p className="cb-hero-sub">
                  Share what is on your mind. The assistant responds with
                  emotion-aware support, gentle guidance, and practical next
                  steps.
                </p>
              </div>

              <div className="cb-grid">
                <section className="cb-chat-panel">
                  <div className="cb-chat-header">
                    <div className="cb-chat-avatar">AI</div>

                    <div>
                      <p className="cb-chat-name">MindTuneX Assistant</p>

                      <div className="cb-chat-status">
                        <span className="cb-status-dot" />
                        Emotion-Aware Support
                      </div>
                    </div>
                  </div>

                  <div className="cb-messages-area">
                    {loadingHistory ? (
                      <div className="cb-center-state">
                        <div className="cb-spinner" />
                        <span className="cb-state-text">Loading chat…</span>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="cb-center-state cb-center-state-text">
                        <div className="cb-empty-icon">💬</div>
                        <p className="cb-empty-title">Start your conversation</p>
                        <p className="cb-empty-sub">
                          Share how you feel and receive supportive guidance.
                        </p>
                      </div>
                    ) : (
                      <div className="cb-msg-list">
                        {messages.map((msg) => (
                          <div
                            key={msg._id}
                            className={`cb-msg-row${
                              msg.sender === "user" ? " cb-msg-row-user" : ""
                            }`}
                          >
                            {msg.sender === "bot" && (
                              <div className="cb-bot-avatar">AI</div>
                            )}

                            <div className="cb-msg-content">
                              <div
                                className={`cb-bubble${
                                  msg.sender === "user"
                                    ? " cb-bubble-user"
                                    : " cb-bubble-bot"
                                }`}
                              >
                                <p className="cb-bubble-text">{msg.message}</p>
                                <p className="cb-bubble-time">
                                  {formatTime(msg.createdAt)}
                                </p>
                              </div>

                              {msg.sender === "bot" && msg.analysis && (
                                <div className="cb-analysis-chips">
                                  <AnalysisChip
                                    label={`${
                                      EMOTION_EMOJI[
                                        msg.analysis.detectedEmotion
                                      ] || "😐"
                                    } ${msg.analysis.detectedEmotion}`}
                                    color={
                                      EMOTION_ACCENT[
                                        msg.analysis.detectedEmotion
                                      ] || "#94a3b8"
                                    }
                                  />

                                  <AnalysisChip
                                    label={`Support: ${msg.analysis.supportLevel}`}
                                    color="#a78bfa"
                                  />

                                  <AnalysisChip
                                    label={`Risk: ${msg.analysis.riskScore}/100`}
                                    color={
                                      msg.analysis.riskScore >= 75
                                        ? "#fb7185"
                                        : msg.analysis.riskScore >= 40
                                        ? "#fb923c"
                                        : "#34d399"
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {typing && (
                          <div className="cb-msg-row">
                            <div className="cb-bot-avatar">AI</div>
                            <div className="cb-bubble cb-bubble-bot">
                              <TypingDots darkMode={darkMode} />
                            </div>
                          </div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {error && <div className="cb-error">⚠️ {error}</div>}

                  <div className="cb-input-row">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                      }}
                      placeholder="Type how you feel…"
                      className="cb-input"
                    />

                    <button
                      onClick={() => handleSend()}
                      disabled={typing || !input.trim()}
                      className="cb-send-btn"
                    >
                      ➤
                    </button>
                  </div>

                  <div className="cb-quick-prompts">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="cb-quick-btn"
                        disabled={typing}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </section>

                <aside className="cb-side-panel">
                  <div className="cb-about-card">
                    <p className="cb-about-eyebrow">What this chatbot does</p>

                    <div className="cb-about-list">
                      {[
                        { icon: "😊", text: "Detects your emotional tone" },
                        { icon: "💬", text: "Gives calm supportive responses" },
                        { icon: "🧭", text: "Suggests simple next steps" },
                        { icon: "🚨", text: "Highlights distress risk early" },
                      ].map((item) => (
                        <div key={item.text} className="cb-about-item">
                          <span className="cb-about-icon">{item.icon}</span>
                          <span className="cb-about-text">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {latestBotAnalysis?.riskScore >= 75 && <CrisisCard />}

                  {latestBotAnalysis && (
                    <div className="cb-analysis-card">
                      <p className="cb-analysis-eyebrow">Latest Analysis</p>

                      <div className="cb-analysis-stats">
                        <MiniStat
                          label="Detected Emotion"
                          value={latestBotAnalysis.detectedEmotion}
                          color={
                            EMOTION_ACCENT[
                              latestBotAnalysis.detectedEmotion
                            ] || "#94a3b8"
                          }
                        />

                        <MiniStat
                          label="Sentiment"
                          value={latestBotAnalysis.sentimentLabel}
                        />

                        <MiniStat
                          label="Support Level"
                          value={latestBotAnalysis.supportLevel}
                        />

                        <MiniStat
                          label="Risk Score"
                          value={`${latestBotAnalysis.riskScore}/100`}
                          color={
                            latestBotAnalysis.riskScore >= 75
                              ? "#fb7185"
                              : latestBotAnalysis.riskScore >= 40
                              ? "#fb923c"
                              : "#34d399"
                          }
                        />
                      </div>

                      {latestBotAnalysis.recommendations?.length > 0 && (
                        <div className="cb-recs">
                          <p className="cb-recs-label">Suggested Actions</p>

                          {latestBotAnalysis.recommendations
                            .slice(0, 3)
                            .map((item, index) => (
                              <div key={index} className="cb-rec-item">
                                {item}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </aside>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const TypingDots = ({ darkMode }) => (
  <div className="cb-typing">
    <span
      style={{
        color: darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.48)",
      }}
    >
      MindTuneX is typing
    </span>

    <div className="cb-typing-dots">
      {[0, 0.15, 0.3].map((delay, index) => (
        <i
          key={index}
          style={{
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  </div>
);

const AnalysisChip = ({ label, color }) => (
  <span
    className="cb-analysis-chip"
    style={{
      color,
      background: `${color}18`,
      borderColor: `${color}44`,
    }}
  >
    {label}
  </span>
);

const MiniStat = ({ label, value, color }) => (
  <div className="cb-mini-stat">
    <p>{label}</p>
    <span style={color ? { color } : {}}>{value}</span>
  </div>
);

const CrisisCard = () => (
  <div className="cb-crisis-card">
    <div className="cb-crisis-bar" />

    <p className="cb-crisis-eyebrow">Immediate Support Notice</p>
    <h3 className="cb-crisis-title">High emotional distress detected</h3>

    <p className="cb-crisis-text">
      It may help to pause and reach out to someone you trust. You can also move
      to journaling or support resources right now.
    </p>

    <div className="cb-crisis-actions">
      <a href="/support" className="cb-crisis-btn-primary">
        Open Support Page
      </a>

      <a href="/journal" className="cb-crisis-btn-ghost">
        Write Journal Entry
      </a>
    </div>
  </div>
);

const STYLES = (darkMode) => `
  @keyframes cb-bounce {
    0%, 100% { transform: translateY(0); opacity: 0.45; }
    50% { transform: translateY(-5px); opacity: 1; }
  }

  @keyframes cb-fade-up {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes cb-spin {
    to { transform: rotate(360deg); }
  }

  @keyframes cb-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }

  .cb-root {
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

  .cb-glow {
    position: fixed;
    border-radius: 999px;
    pointer-events: none;
    z-index: 0;
  }

  .cb-glow-1 {
    top: -100px;
    left: -80px;
    width: 430px;
    height: 430px;
    background: radial-gradient(circle, rgba(20,184,166,0.14) 0%, transparent 65%);
  }

  .cb-glow-2 {
    bottom: -80px;
    right: -80px;
    width: 390px;
    height: 390px;
    background: radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 65%);
  }

  .cb-body {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    z-index: 1;
    min-width: 0;
  }

  .cb-main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
  }

  @media(min-width: 1024px) {
    .cb-main {
      padding: 36px 40px;
    }
  }

  .cb-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .cb-hero,
  .cb-chat-panel,
  .cb-about-card,
  .cb-analysis-card,
  .cb-crisis-card {
    position: relative;
    overflow: hidden;
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
        ? "0 24px 60px rgba(0,0,0,0.3)"
        : "0 24px 60px rgba(15,23,42,0.08)"
    };
  }

  .cb-hero {
    padding: 30px;
    animation: cb-fade-up 0.45s ease both;
  }

  .cb-hero-bar {
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, #14b8a6, #0ea5e9, #8b5cf6);
  }

  .cb-eyebrow {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 9px;
  }

  .cb-title {
    font-size: clamp(34px, 4vw, 50px);
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.96)" : "#0f172a"};
    line-height: 1.02;
    margin-bottom: 13px;
    letter-spacing: -0.045em;
  }

  .cb-title span {
    background: linear-gradient(135deg, #14b8a6, #38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .cb-hero-sub {
    max-width: 590px;
    font-size: 13.5px;
    line-height: 1.75;
    color: ${darkMode ? "rgba(255,255,255,0.44)" : "rgba(15,23,42,0.56)"};
  }

  .cb-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
  }

  @media(min-width: 1024px) {
    .cb-grid {
      grid-template-columns: minmax(0, 1.42fr) minmax(320px, 0.58fr);
    }
  }

  .cb-chat-panel {
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    animation: cb-fade-up 0.5s ease both;
  }

  .cb-chat-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 15px;
    border-bottom: 1px solid ${
      darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"
    };
  }

  .cb-chat-avatar,
  .cb-bot-avatar {
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 950;
    box-shadow: 0 12px 24px rgba(20,184,166,0.24);
    flex-shrink: 0;
  }

  .cb-chat-avatar {
    width: 40px;
    height: 40px;
    border-radius: 16px;
    font-size: 11px;
  }

  .cb-bot-avatar {
    width: 30px;
    height: 30px;
    border-radius: 999px;
    font-size: 9px;
    margin-bottom: 2px;
  }

  .cb-chat-name {
    font-size: 14px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.86)" : "#0f172a"};
    margin-bottom: 3px;
  }

  .cb-chat-status {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11.5px;
    font-weight: 800;
    color: #14b8a6;
  }

  .cb-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #14b8a6;
    animation: cb-pulse 1.8s ease-in-out infinite;
  }

  .cb-messages-area {
    height: 500px;
    overflow-y: auto;
    border-radius: 20px;
    padding: 18px;
    background: ${
      darkMode ? "rgba(0,0,0,0.18)" : "rgba(248,250,252,0.82)"
    };
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)"
    };
    scrollbar-width: thin;
    scrollbar-color: rgba(20,184,166,0.35) transparent;
  }

  .cb-messages-area::-webkit-scrollbar {
    width: 5px;
  }

  .cb-messages-area::-webkit-scrollbar-thumb {
    background: rgba(20,184,166,0.35);
    border-radius: 999px;
  }

  .cb-center-state {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .cb-center-state-text {
    text-align: center;
  }

  .cb-spinner {
    width: 30px;
    height: 30px;
    border-radius: 999px;
    border: 3px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    border-top-color: #14b8a6;
    animation: cb-spin 0.75s linear infinite;
  }

  .cb-state-text {
    font-size: 12px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.48)"};
  }

  .cb-empty-icon {
    width: 58px;
    height: 58px;
    border-radius: 18px;
    background: rgba(20,184,166,0.1);
    border: 1px solid rgba(20,184,166,0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #14b8a6;
    font-size: 28px;
    margin-bottom: 6px;
  }

  .cb-empty-title {
    font-size: 15px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.62)" : "#0f172a"};
  }

  .cb-empty-sub {
    max-width: 250px;
    font-size: 12.5px;
    line-height: 1.6;
    color: ${darkMode ? "rgba(255,255,255,0.32)" : "rgba(15,23,42,0.48)"};
  }

  .cb-msg-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .cb-msg-row {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    animation: cb-fade-up 0.24s ease both;
  }

  .cb-msg-row-user {
    flex-direction: row-reverse;
  }

  .cb-msg-content {
    display: flex;
    flex-direction: column;
    gap: 7px;
    max-width: 82%;
  }

  .cb-msg-row-user .cb-msg-content {
    align-items: flex-end;
  }

  .cb-bubble {
    max-width: 100%;
    padding: 12px 16px;
    border-radius: 18px;
  }

  .cb-bubble-user {
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    border-radius: 18px 6px 18px 18px;
    box-shadow: 0 12px 24px rgba(20,184,166,0.18);
  }

  .cb-bubble-bot {
    background: ${darkMode ? "rgba(255,255,255,0.065)" : "rgba(255,255,255,0.88)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.07)"};
    border-radius: 6px 18px 18px 18px;
  }

  .cb-bubble-text {
    font-size: 13.5px;
    line-height: 1.7;
    color: ${darkMode ? "rgba(255,255,255,0.86)" : "rgba(15,23,42,0.72)"};
    font-weight: 500;
    white-space: pre-line;
  }

  .cb-bubble-user .cb-bubble-text {
    color: rgba(255,255,255,0.96);
  }

  .cb-bubble-time {
    font-size: 10px;
    color: ${darkMode ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.38)"};
    margin-top: 6px;
    font-family: monospace;
  }

  .cb-bubble-user .cb-bubble-time {
    color: rgba(255,255,255,0.64);
  }

  .cb-analysis-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 0 2px;
  }

  .cb-analysis-chip {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 10.5px;
    font-weight: 950;
    border: 1px solid;
    letter-spacing: 0.04em;
  }

  .cb-typing {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cb-typing span {
    font-size: 12px;
    font-weight: 700;
  }

  .cb-typing-dots {
    display: flex;
    gap: 4px;
  }

  .cb-typing-dots i {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: #14b8a6;
    display: inline-block;
    animation: cb-bounce 0.8s ease-in-out infinite;
  }

  .cb-error {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 12px 15px;
    border-radius: 16px;
    background: rgba(244,63,94,0.09);
    border: 1px solid rgba(244,63,94,0.22);
    font-size: 13px;
    font-weight: 800;
    color: #fb7185;
  }

  .cb-input-row {
    display: flex;
    gap: 10px;
  }

  .cb-input {
    flex: 1;
    border-radius: 18px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.86)"};
    padding: 14px 17px;
    font-size: 13.5px;
    color: ${darkMode ? "rgba(255,255,255,0.82)" : "#0f172a"};
    font-family: inherit;
    outline: none;
    transition: all 0.2s ease;
  }

  .cb-input::placeholder {
    color: ${darkMode ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.36)"};
  }

  .cb-input:focus {
    border-color: rgba(20,184,166,0.48);
    box-shadow: 0 0 0 4px rgba(20,184,166,0.12);
  }

  .cb-send-btn {
    width: 48px;
    height: 48px;
    border-radius: 18px;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;
    box-shadow: 0 14px 28px rgba(20,184,166,0.24);
    font-size: 16px;
  }

  .cb-send-btn:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 18px 36px rgba(20,184,166,0.3);
  }

  .cb-send-btn:disabled {
    opacity: 0.42;
    cursor: not-allowed;
  }

  .cb-quick-prompts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .cb-quick-btn {
    padding: 7px 14px;
    border-radius: 999px;
    font-family: inherit;
    background: ${darkMode ? "rgba(255,255,255,0.045)" : "rgba(15,23,42,0.045)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    color: ${darkMode ? "rgba(255,255,255,0.46)" : "rgba(15,23,42,0.56)"};
    font-size: 11.5px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .cb-quick-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    background: rgba(20,184,166,0.1);
    color: #14b8a6;
    border-color: rgba(20,184,166,0.25);
  }

  .cb-quick-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .cb-side-panel {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .cb-about-card,
  .cb-analysis-card,
  .cb-crisis-card {
    padding: 20px;
    animation: cb-fade-up 0.55s ease both;
  }

  .cb-about-eyebrow,
  .cb-analysis-eyebrow,
  .cb-recs-label {
    font-size: 9.5px;
    font-weight: 950;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.32)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 14px;
  }

  .cb-about-list {
    display: flex;
    flex-direction: column;
    gap: 11px;
  }

  .cb-about-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 12px;
    border-radius: 16px;
    background: ${darkMode ? "rgba(255,255,255,0.035)" : "rgba(15,23,42,0.03)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.055)"};
  }

  .cb-about-icon {
    font-size: 19px;
    flex-shrink: 0;
  }

  .cb-about-text {
    font-size: 12.5px;
    line-height: 1.5;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.48)" : "rgba(15,23,42,0.58)"};
  }

  .cb-analysis-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px;
    margin-bottom: 15px;
  }

  .cb-mini-stat {
    border-radius: 15px;
    padding: 12px 13px;
    background: ${darkMode ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.035)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.065)" : "rgba(15,23,42,0.06)"};
  }

  .cb-mini-stat p {
    font-size: 9px;
    font-weight: 950;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.28)" : "rgba(15,23,42,0.4)"};
    margin-bottom: 6px;
  }

  .cb-mini-stat span {
    font-size: 13px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.74)" : "#0f172a"};
    text-transform: capitalize;
  }

  .cb-rec-item {
    border-radius: 15px;
    padding: 12px 13px;
    background: ${darkMode ? "rgba(255,255,255,0.035)" : "rgba(15,23,42,0.03)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.055)"};
    font-size: 12.5px;
    font-weight: 650;
    color: ${darkMode ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.58)"};
    line-height: 1.65;
    margin-bottom: 8px;
  }

  .cb-crisis-card {
    border-color: rgba(244,63,94,0.28);
    background: rgba(244,63,94,0.08);
  }

  .cb-crisis-bar {
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, #f43f5e, #f97316);
  }

  .cb-crisis-eyebrow {
    font-size: 9.5px;
    font-weight: 950;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #fb7185;
    margin-bottom: 9px;
    margin-top: 3px;
  }

  .cb-crisis-title {
    font-size: 16px;
    font-weight: 950;
    color: #fb7185;
    margin-bottom: 8px;
  }

  .cb-crisis-text {
    font-size: 12.5px;
    color: ${darkMode ? "rgba(255,255,255,0.5)" : "rgba(15,23,42,0.6)"};
    line-height: 1.7;
    margin-bottom: 14px;
  }

  .cb-crisis-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .cb-crisis-btn-primary,
  .cb-crisis-btn-ghost {
    padding: 9px 16px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 950;
    text-decoration: none;
    transition: all 0.18s ease;
  }

  .cb-crisis-btn-primary {
    background: rgba(244,63,94,0.18);
    border: 1px solid rgba(244,63,94,0.35);
    color: #fb7185;
  }

  .cb-crisis-btn-ghost {
    background: ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)"};
    color: ${darkMode ? "rgba(255,255,255,0.52)" : "rgba(15,23,42,0.58)"};
  }

  .cb-crisis-btn-primary:hover,
  .cb-crisis-btn-ghost:hover {
    transform: translateY(-1px);
  }
`;

export default ChatbotPage;