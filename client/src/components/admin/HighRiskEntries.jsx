import React, { useState } from "react";
import { useTheme } from "../../context/useTheme";

const MOOD_EMOJI = {
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

const MOOD_COLOR = {
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

const getRiskTone = (entry) => {
  const level = String(entry?.supportLevel || "").toLowerCase();
  const score = Number(entry?.riskScore || 0);

  if (level === "high" || score >= 75) {
    return {
      label: "High Priority",
      color: "#fb7185",
      from: "#fb7185",
      to: "#e11d48",
      soft: "rgba(251,113,133,0.14)",
      border: "rgba(251,113,133,0.35)",
    };
  }

  return {
    label: "Moderate",
    color: "#fb923c",
    from: "#fb923c",
    to: "#f97316",
    soft: "rgba(251,146,60,0.13)",
    border: "rgba(251,146,60,0.32)",
  };
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

const getInitials = (name) =>
  (name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const HighRiskEntries = ({ entries = [] }) => {
  const { darkMode } = useTheme();
  const [expandedId, setExpandedId] = useState(null);

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <section className="hre-panel">
        <div className="hre-bg-glow hre-bg-glow-one" />
        <div className="hre-bg-glow hre-bg-glow-two" />

        <header className="hre-header">
          <div>
            <span className="hre-kicker">
              <span />
              Risk Monitoring
            </span>

            <h2>High-Risk Alerts</h2>

            <p>
              Premium admin view for emotionally sensitive records requiring
              review and support follow-up.
            </p>
          </div>

          <div className="hre-counter">
            <div className="hre-counter-orb">{entries.length}</div>
            <div>
              <strong>Active</strong>
              <span>Alerts</span>
            </div>
          </div>
        </header>

        {!entries.length ? (
          <div className="hre-empty">
            <div>✓</div>
            <h3>All Clear</h3>
            <p>No high-risk entries detected right now.</p>
          </div>
        ) : (
          <div className="hre-list">
            {entries.map((entry, idx) => {
              const id = entry._id || idx;
              const open = expandedId === id;
              const tone = getRiskTone(entry);

              const emotion = String(
                entry.predictedEmotion || "neutral"
              ).toLowerCase();

              const emoji = MOOD_EMOJI[emotion] || "😐";
              const emoColor = MOOD_COLOR[emotion] || "#94a3b8";

              const confidence =
                typeof entry.confidence === "number"
                  ? Math.round(entry.confidence * 100)
                  : null;

              const displayText =
                entry.displayText ||
                entry.inputText ||
                entry.text ||
                "No journal text available.";

              return (
                <article
                  key={id}
                  className={`hre-card ${open ? "is-open" : ""}`}
                  style={{
                    "--accent": tone.color,
                    "--accent-from": tone.from,
                    "--accent-to": tone.to,
                    "--accent-soft": tone.soft,
                    "--accent-border": tone.border,
                  }}
                  onClick={() => setExpandedId(open ? null : id)}
                >
                  <div className="hre-card-line" />

                  <div className="hre-main-row">
                    <div className="hre-avatar">
                      {getInitials(entry.user?.fullName)}
                    </div>

                    <div className="hre-user">
                      <div className="hre-user-top">
                        <h3>{entry.user?.fullName || "Unknown User"}</h3>

                        <span className="hre-priority">
                          <span />
                          {tone.label}
                        </span>
                      </div>

                      <p>{entry.user?.email || "No email available"}</p>
                    </div>

                    <div className="hre-date">
                      <span>Detected</span>
                      <strong>{formatDate(entry.createdAt)}</strong>
                    </div>

                    <button className="hre-toggle" type="button">
                      {open ? "−" : "+"}
                    </button>
                  </div>

                  <div className="hre-tags">
                    <span
                      className="hre-tag"
                      style={{
                        color: emoColor,
                        background: `${emoColor}18`,
                        borderColor: `${emoColor}35`,
                      }}
                    >
                      {emoji} {emotion}
                    </span>

                    <span className="hre-tag neutral">
                      Trigger: {entry.triggerCategory || "General"}
                    </span>

                    <span className="hre-tag risk">
                      Risk {entry.riskScore || 0}/100
                    </span>

                    {confidence !== null && (
                      <span className="hre-tag confidence">
                        Confidence {confidence}%
                      </span>
                    )}
                  </div>

                  <div className="hre-preview">
                    <span>Journal Preview</span>
                    <p>{displayText}</p>
                  </div>

                  <div className={`hre-details ${open ? "show" : ""}`}>
                    <div className="hre-quote">
                      <span>Flagged Journal Text</span>
                      <p>“{displayText}”</p>
                    </div>

                    <div className="hre-note">
                      Review recommended for emotional wellness follow-up.
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

const STYLES = (darkMode) => `
  .hre-panel {
    position: relative;
    overflow: hidden;
    border-radius: 30px;
    padding: 28px;
    background: ${
      darkMode
        ? `radial-gradient(circle at top left, rgba(251,113,133,0.14), transparent 34%),
           linear-gradient(145deg, rgba(15,23,42,0.96), rgba(2,6,23,0.94))`
        : `radial-gradient(circle at top left, rgba(251,113,133,0.12), transparent 34%),
           linear-gradient(145deg, rgba(255,255,255,0.96), rgba(248,250,252,0.94))`
    };
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"
    };
    box-shadow: ${
      darkMode
        ? "0 28px 80px rgba(0,0,0,0.42)"
        : "0 24px 60px rgba(15,23,42,0.12)"
    };
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .hre-bg-glow {
    position: absolute;
    border-radius: 999px;
    filter: blur(70px);
    pointer-events: none;
  }

  .hre-bg-glow-one {
    width: 260px;
    height: 260px;
    top: -90px;
    right: 12%;
    background: rgba(251,113,133,0.18);
  }

  .hre-bg-glow-two {
    width: 220px;
    height: 220px;
    bottom: -80px;
    left: 8%;
    background: rgba(56,189,248,0.12);
  }

  .hre-header {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: flex-start;
    margin-bottom: 22px;
  }

  .hre-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 13px;
    border-radius: 999px;
    background: rgba(251,113,133,0.12);
    border: 1px solid rgba(251,113,133,0.24);
    color: #fb7185;
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  .hre-kicker span {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #fb7185;
    box-shadow: 0 0 14px #fb7185;
  }

  .hre-header h2 {
    margin: 12px 0 6px;
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
    font-size: clamp(24px, 3vw, 34px);
    line-height: 1;
    letter-spacing: -0.05em;
    font-weight: 950;
  }

  .hre-header p {
    margin: 0;
    max-width: 560px;
    color: ${
      darkMode ? "rgba(226,232,240,0.56)" : "rgba(15,23,42,0.55)"
    };
    font-size: 13.5px;
    font-weight: 600;
    line-height: 1.6;
  }

  .hre-counter {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 22px;
    background: ${
      darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"
    };
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)"
    };
  }

  .hre-counter-orb {
    width: 48px;
    height: 48px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #fb7185, #e11d48);
    color: white;
    font-size: 20px;
    font-weight: 950;
    box-shadow: 0 14px 28px rgba(225,29,72,0.28);
  }

  .hre-counter strong,
  .hre-counter span {
    display: block;
  }

  .hre-counter strong {
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
    font-size: 13px;
    font-weight: 900;
  }

  .hre-counter span {
    color: ${
      darkMode ? "rgba(226,232,240,0.48)" : "rgba(15,23,42,0.48)"
    };
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
  }

  .hre-list {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 14px;
    max-height: 640px;
    overflow-y: auto;
    padding-right: 6px;
  }

  .hre-card {
    position: relative;
    overflow: hidden;
    padding: 18px;
    border-radius: 24px;
    background: ${
      darkMode
        ? "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035))"
        : "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.75))"
    };
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.085)" : "rgba(15,23,42,0.08)"
    };
    box-shadow: ${
      darkMode
        ? "inset 0 1px 0 rgba(255,255,255,0.08)"
        : "0 16px 32px rgba(15,23,42,0.08)"
    };
    cursor: pointer;
    transition: transform 0.22s ease, border-color 0.22s ease, background 0.22s ease;
  }

  .hre-card:hover,
  .hre-card.is-open {
    transform: translateY(-2px);
    border-color: var(--accent-border);
    background: ${
      darkMode
        ? "radial-gradient(circle at top right, var(--accent-soft), transparent 38%), linear-gradient(135deg, rgba(255,255,255,0.105), rgba(255,255,255,0.04))"
        : "radial-gradient(circle at top right, var(--accent-soft), transparent 38%), linear-gradient(135deg, rgba(255,255,255,1), rgba(248,250,252,0.92))"
    };
  }

  .hre-card-line {
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: linear-gradient(180deg, var(--accent-from), var(--accent-to));
  }

  .hre-main-row {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .hre-avatar {
    width: 48px;
    height: 48px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: var(--accent-soft);
    border: 1px solid var(--accent-border);
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
    font-size: 13px;
    font-weight: 950;
  }

  .hre-user {
    flex: 1;
    min-width: 0;
  }

  .hre-user-top {
    display: flex;
    align-items: center;
    gap: 9px;
    flex-wrap: wrap;
  }

  .hre-user h3 {
    margin: 0;
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
    font-size: 15px;
    font-weight: 950;
  }

  .hre-user p {
    margin: 3px 0 0;
    color: ${
      darkMode ? "rgba(226,232,240,0.48)" : "rgba(15,23,42,0.50)"
    };
    font-size: 12px;
    font-weight: 700;
  }

  .hre-priority {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    color: var(--accent);
    background: var(--accent-soft);
    border: 1px solid var(--accent-border);
    font-size: 10px;
    font-weight: 950;
  }

  .hre-priority span {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--accent);
  }

  .hre-date {
    text-align: right;
  }

  .hre-date span {
    display: block;
    color: ${
      darkMode ? "rgba(226,232,240,0.34)" : "rgba(15,23,42,0.40)"
    };
    font-size: 9px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .hre-date strong {
    display: block;
    color: ${
      darkMode ? "rgba(248,250,252,0.72)" : "rgba(15,23,42,0.70)"
    };
    font-size: 12px;
    font-weight: 900;
  }

  .hre-toggle {
    width: 34px;
    height: 34px;
    border-radius: 14px;
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)"
    };
    background: ${
      darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.04)"
    };
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
    font-size: 20px;
    font-weight: 800;
    cursor: pointer;
  }

  .hre-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 14px;
  }

  .hre-tag {
    padding: 5px 11px;
    border-radius: 999px;
    border: 1px solid;
    font-size: 11px;
    font-weight: 900;
    text-transform: capitalize;
  }

  .hre-tag.neutral {
    color: ${darkMode ? "rgba(226,232,240,0.65)" : "rgba(15,23,42,0.60)"};
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"};
    border-color: ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)"};
  }

  .hre-tag.risk {
    color: #fb7185;
    background: rgba(251,113,133,0.12);
    border-color: rgba(251,113,133,0.25);
  }

  .hre-tag.confidence {
    color: #38bdf8;
    background: rgba(56,189,248,0.1);
    border-color: rgba(56,189,248,0.25);
  }

  .hre-preview {
    margin-top: 14px;
    padding: 13px 15px;
    border-radius: 18px;
    background: ${darkMode ? "rgba(15,23,42,0.48)" : "rgba(248,250,252,0.92)"};
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.08)"
    };
  }

  .hre-preview span,
  .hre-quote span {
    display: block;
    margin-bottom: 6px;
    color: rgba(251,113,133,0.9);
    font-size: 9.5px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }

  .hre-preview p {
    margin: 0;
    color: ${darkMode ? "rgba(226,232,240,0.72)" : "rgba(15,23,42,0.70)"};
    font-size: 13px;
    line-height: 1.55;
    font-weight: 650;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .hre-details {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: all 0.28s ease;
  }

  .hre-details.show {
    max-height: 260px;
    opacity: 1;
    margin-top: 14px;
  }

  .hre-quote {
    padding: 16px;
    border-radius: 20px;
    background: rgba(251,113,133,0.08);
    border: 1px solid rgba(251,113,133,0.18);
  }

  .hre-quote p {
    margin: 0;
    color: ${darkMode ? "rgba(248,250,252,0.78)" : "rgba(15,23,42,0.76)"};
    font-size: 13.5px;
    line-height: 1.7;
    font-style: italic;
    font-weight: 650;
  }

  .hre-note {
    margin-top: 10px;
    color: ${darkMode ? "rgba(226,232,240,0.48)" : "rgba(15,23,42,0.52)"};
    font-size: 12px;
    font-weight: 750;
  }

  .hre-empty {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 52px 20px;
    border-radius: 24px;
    background: ${darkMode ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.70)"};
    border: 1px dashed ${
      darkMode ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.12)"
    };
  }

  .hre-empty div {
    margin: 0 auto 12px;
    width: 54px;
    height: 54px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(45,212,191,0.12);
    border: 1px solid rgba(45,212,191,0.25);
    color: #2dd4bf;
    font-size: 26px;
    font-weight: 950;
  }

  .hre-empty h3 {
    margin: 0;
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
    font-size: 18px;
    font-weight: 950;
  }

  .hre-empty p {
    margin: 6px 0 0;
    color: ${darkMode ? "rgba(226,232,240,0.48)" : "rgba(15,23,42,0.52)"};
    font-size: 13px;
    font-weight: 650;
  }

  @media (max-width: 760px) {
    .hre-panel {
      padding: 20px;
      border-radius: 24px;
    }

    .hre-header,
    .hre-main-row {
      flex-direction: column;
      align-items: flex-start;
    }

    .hre-date {
      text-align: left;
    }

    .hre-toggle {
      position: absolute;
      top: 16px;
      right: 16px;
    }
  }
`;

export default HighRiskEntries;