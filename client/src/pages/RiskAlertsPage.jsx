import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import {
  getHighRiskEntriesApi,
  markReviewedApi,
  contactUserApi,
} from "../api/adminApi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";

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

const getRiskTone = (level) => {
  const l = level?.toLowerCase();

  if (l === "high") {
    return {
      label: "High Priority",
      color: "#fb7185",
      from: "#f43f5e",
      to: "#e11d48",
    };
  }

  if (l === "moderate") {
    return {
      label: "Moderate Priority",
      color: "#fb923c",
      from: "#f97316",
      to: "#f59e0b",
    };
  }

  return {
    label: "Needs Review",
    color: "#94a3b8",
    from: "#64748b",
    to: "#475569",
  };
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

const RiskAlertsPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode } = useTheme();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getHighRiskEntriesApi();

      const data = Array.isArray(res)
        ? res
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : [];

      setAlerts(data);
    } catch (err) {
      console.error("Failed to load alerts:", err);
      setError("Unable to fetch risk alerts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="ra-root">
        <div className="ra-glow ra-glow-1" />
        <div className="ra-glow ra-glow-2" />

        <Sidebar forceAdmin />

        <div className="ra-body">
          <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

          <main className="ra-main">
            <div className="ra-container">
              <section className="ra-hero">
                <div className="ra-hero-line" />

                <div className="ra-hero-inner">
                  <div>
                    <p className="ra-eyebrow">Risk Monitoring</p>

                    <h1 className="ra-title">
                      Risk <span>Alerts</span>
                    </h1>

                    <p className="ra-subtitle">
                      Monitor emotionally sensitive entries that may require
                      timely administrative review and support follow-up.
                    </p>

                    <div className="ra-pills">
                      <span className="ra-pill">
                        <span
                          className="ra-dot"
                          style={{ background: "#f59e0b" }}
                        />
                        Admin: {user?.fullName || "Administrator"}
                      </span>

                      <span className="ra-pill danger">
                        <span
                          className="ra-dot pulse"
                          style={{ background: "#f43f5e" }}
                        />
                        Active Alerts: {alerts.length}
                      </span>
                    </div>
                  </div>

                  <div className="ra-actions">
                    <div className="ra-live">
                      <span className="ra-dot pulse" />
                      Live Risk Watch
                    </div>

                    <button onClick={loadAlerts} className="ra-refresh">
                      ↻ Refresh Alerts
                    </button>
                  </div>
                </div>
              </section>

              {loading ? (
                <StateCard icon="⏳" title="Loading risk alerts…" loading />
              ) : error ? (
                <StateCard
                  icon="⚠️"
                  title="Unable to load alerts"
                  text={error}
                  danger
                  action={loadAlerts}
                />
              ) : alerts.length === 0 ? (
                <StateCard
                  icon="✅"
                  title="No high-risk entries found"
                  text="Everything is stable right now. New elevated-risk alerts will appear here automatically."
                  success
                />
              ) : (
                <div className="ra-grid">
                  {alerts.map((entry) => (
                    <AlertCard
                      key={entry._id}
                      entry={entry}
                      onRefresh={loadAlerts}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const AlertCard = ({ entry, onRefresh }) => {
  const [reviewing, setReviewing] = useState(false);
  const [contacting, setContacting] = useState(false);

  const tone = getRiskTone(entry.supportLevel);
  const emoKey = entry.predictedEmotion?.toLowerCase() || "neutral";
  const emoEmoji = MOOD_EMOJI[emoKey] || "😐";
  const emoColor = MOOD_COLOR[emoKey] || "#94a3b8";
  const confPct =
    entry.confidence != null ? Math.round(entry.confidence * 100) : null;

  const fullName = entry.user?.fullName || entry.user?.name || "Unknown User";

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleReview = async () => {
    try {
      setReviewing(true);

      await markReviewedApi(entry._id);
      await onRefresh();

      alert("Alert marked as reviewed");
    } catch (err) {
      console.error("Review failed:", err);
      alert("Failed to mark as reviewed");
    } finally {
      setReviewing(false);
    }
  };

  const handleContact = async () => {
    try {
      setContacting(true);

      const res = await contactUserApi(entry._id);
      const email = res?.email || entry.user?.email;

      if (!email) {
        alert("User email not found");
        return;
      }

      window.location.href = `mailto:${email}`;
    } catch (err) {
      console.error("Contact failed:", err);
      alert("Failed to contact user");
    } finally {
      setContacting(false);
    }
  };

  return (
    <article className="ra-card">
      <div
        className="ra-card-line"
        style={{
          background: `linear-gradient(90deg, ${tone.from}, ${tone.to})`,
        }}
      />

      <div className="ra-card-head">
        <div
          className="ra-avatar"
          style={{
            color: tone.color,
            background: `${tone.color}16`,
            borderColor: `${tone.color}38`,
          }}
        >
          {initials}
        </div>

        <div className="ra-user">
          <div className="ra-name-row">
            <h3>{fullName}</h3>

            <span
              className="ra-priority"
              style={{
                color: tone.color,
                background: `${tone.color}15`,
                borderColor: `${tone.color}35`,
              }}
            >
              <span style={{ background: tone.color }} />
              {tone.label}
            </span>
          </div>

          <p>{entry.user?.email || "No email available"}</p>
        </div>
      </div>

      <div className="ra-content-box">
        <p className="ra-content-label">Flagged Content</p>

        <p className="ra-content-text">
          “{entry.displayText || entry.inputText || entry.text || "No journal text available"}”
        </p>
      </div>

      <div className="ra-tags">
        <span
          className="ra-tag"
          style={{
            color: emoColor,
            background: `${emoColor}15`,
            borderColor: `${emoColor}35`,
          }}
        >
          {emoEmoji} {emoKey}
        </span>

        <span className="ra-tag muted">
          Trigger: {entry.triggerCategory || "General"}
        </span>

        <span className="ra-tag muted">{formatDate(entry.createdAt)}</span>

        {confPct !== null && (
          <span className="ra-tag blue">Confidence: {confPct}%</span>
        )}
      </div>

      <div className="ra-footer">
        <p>
          <span style={{ background: tone.color }} />
          Review recommended for emotional wellness follow-up.
        </p>

        <div className="ra-card-actions">
          <button
            className="ra-review"
            onClick={handleReview}
            disabled={reviewing}
          >
            {reviewing ? "Reviewing..." : "Mark as Reviewed"}
          </button>

          <button
            className="ra-contact"
            onClick={handleContact}
            disabled={contacting}
          >
            {contacting ? "Opening..." : "Contact User"}
          </button>
        </div>
      </div>
    </article>
  );
};

const StateCard = ({ icon, title, text, loading, danger, success, action }) => (
  <div
    className={`ra-state ${danger ? "danger" : ""} ${
      success ? "success" : ""
    }`}
  >
    <div className="ra-state-icon">
      {loading ? <span className="ra-spinner" /> : icon}
    </div>

    <h3>{title}</h3>

    {text && <p>{text}</p>}

    {action && (
      <button onClick={action} className="ra-state-btn">
        Try Again
      </button>
    )}
  </div>
);

const STYLES = (darkMode) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

  .ra-root {
    display: flex;
    min-height: 100svh;
    position: relative;
    overflow-x: hidden;
    font-family: 'DM Sans', system-ui, sans-serif;
    background: ${
      darkMode
        ? "radial-gradient(circle at top left, rgba(244,63,94,0.12), transparent 34%), #080c14"
        : "linear-gradient(135deg, #fff7ed 0%, #f8fafc 48%, #fef2f2 100%)"
    };
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .ra-glow {
    position: fixed;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;
    z-index: 0;
  }

  .ra-glow-1 {
    top: -120px;
    left: -100px;
    width: 470px;
    height: 470px;
    background: rgba(244,63,94,0.15);
  }

  .ra-glow-2 {
    bottom: -120px;
    right: -100px;
    width: 430px;
    height: 430px;
    background: rgba(249,115,22,0.12);
  }

  .ra-body {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .ra-main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
  }

  @media(min-width:1024px) {
    .ra-main { padding: 36px 40px; }
  }

  .ra-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .ra-hero,
  .ra-card,
  .ra-state {
    border-radius: 28px;
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"
    };
    background: ${
      darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.82)"
    };
    backdrop-filter: blur(24px);
    box-shadow: ${
      darkMode
        ? "0 24px 60px rgba(0,0,0,0.28)"
        : "0 24px 60px rgba(15,23,42,0.09)"
    };
  }

  .ra-hero {
    position: relative;
    overflow: hidden;
    padding: 30px;
  }

  .ra-hero-line,
  .ra-card-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
  }

  .ra-hero-line {
    background: linear-gradient(90deg, #f43f5e, #f97316, #f59e0b);
  }

  .ra-hero-inner {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  @media(min-width:1024px) {
    .ra-hero-inner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .ra-eyebrow {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #fb7185;
    margin-bottom: 8px;
  }

  .ra-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 900;
    letter-spacing: -0.055em;
    line-height: 1.05;
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .ra-title span {
    background: linear-gradient(135deg, #f43f5e, #f97316);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .ra-subtitle {
    margin-top: 11px;
    max-width: 620px;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.7;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.55)"};
  }

  .ra-pills,
  .ra-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }

  .ra-pills {
    margin-top: 18px;
  }

  .ra-actions {
    align-items: center;
    flex-shrink: 0;
  }

  .ra-pill,
  .ra-live {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    border-radius: 999px;
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)"
    };
    background: ${
      darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"
    };
    font-size: 11.5px;
    font-weight: 800;
    color: ${
      darkMode ? "rgba(255,255,255,0.48)" : "rgba(15,23,42,0.58)"
    };
  }

  .ra-pill.danger,
  .ra-live {
    color: #fb7185;
    border-color: rgba(244,63,94,0.25);
    background: rgba(244,63,94,0.1);
  }

  .ra-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .pulse {
    animation: ra-pulse 1.5s ease-in-out infinite;
  }

  @keyframes ra-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.82); }
  }

  .ra-refresh,
  .ra-state-btn {
    border: none;
    cursor: pointer;
    font-family: inherit;
    border-radius: 999px;
    font-weight: 900;
    color: #fff;
    background: linear-gradient(135deg, #f43f5e, #f97316);
    box-shadow: 0 16px 34px rgba(244,63,94,0.26);
    transition: all 0.2s ease;
  }

  .ra-refresh {
    padding: 12px 20px;
    font-size: 13px;
  }

  .ra-refresh:hover,
  .ra-state-btn:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  .ra-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media(min-width:1280px) {
    .ra-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .ra-card {
    position: relative;
    overflow: hidden;
    padding: 22px;
    transition: all 0.22s ease;
  }

  .ra-card:hover {
    transform: translateY(-3px);
    border-color: ${
      darkMode ? "rgba(255,255,255,0.16)" : "rgba(244,63,94,0.22)"
    };
  }

  .ra-card-head {
    display: flex;
    gap: 13px;
    padding-bottom: 15px;
    border-bottom: 1px solid ${
      darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"
    };
  }

  .ra-avatar {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 900;
    flex-shrink: 0;
  }

  .ra-user {
    min-width: 0;
    flex: 1;
  }

  .ra-name-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 4px;
  }

  .ra-name-row h3 {
    font-size: 15px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.9)" : "#0f172a"};
  }

  .ra-user p {
    font-size: 12px;
    font-weight: 600;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.48)"};
  }

  .ra-priority {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 11px;
    border-radius: 999px;
    border: 1px solid;
    font-size: 10.5px;
    font-weight: 900;
  }

  .ra-priority span {
    width: 5px;
    height: 5px;
    border-radius: 999px;
  }

  .ra-content-box {
    margin-top: 15px;
    padding: 15px 17px;
    border-radius: 16px;
    border: 1px solid rgba(244,63,94,0.18);
    background: rgba(244,63,94,0.075);
  }

  .ra-content-label {
    font-size: 9.5px;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #fb7185;
    margin-bottom: 8px;
  }

  .ra-content-text {
    font-size: 13.5px;
    font-weight: 600;
    line-height: 1.75;
    font-style: italic;
    color: ${darkMode ? "rgba(255,255,255,0.58)" : "rgba(15,23,42,0.66)"};
  }

  .ra-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 14px;
  }

  .ra-tag {
    padding: 5px 12px;
    border-radius: 999px;
    border: 1px solid;
    font-size: 11px;
    font-weight: 900;
    text-transform: capitalize;
  }

  .ra-tag.muted {
    color: ${darkMode ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.58)"};
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"};
    border-color: ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)"};
  }

  .ra-tag.blue {
    color: #38bdf8;
    background: rgba(14,165,233,0.1);
    border-color: rgba(14,165,233,0.24);
  }

  .ra-footer {
    margin-top: 15px;
    padding-top: 14px;
    border-top: 1px solid ${
      darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"
    };
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ra-footer p {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11.5px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.48)"};
  }

  .ra-footer p span {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .ra-card-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px;
  }

  .ra-review,
  .ra-contact {
    padding: 11px;
    border-radius: 14px;
    cursor: pointer;
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 900;
    transition: all 0.18s ease;
  }

  .ra-review:disabled,
  .ra-contact:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .ra-review {
    color: #fb7185;
    background: rgba(244,63,94,0.12);
    border: 1px solid rgba(244,63,94,0.26);
  }

  .ra-contact {
    color: ${darkMode ? "rgba(255,255,255,0.62)" : "rgba(15,23,42,0.62)"};
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"};
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)"
    };
  }

  .ra-review:hover {
    background: rgba(244,63,94,0.2);
  }

  .ra-contact:hover {
    background: ${darkMode ? "rgba(255,255,255,0.095)" : "rgba(15,23,42,0.075)"};
  }

  .ra-state {
    min-height: 40vh;
    padding: 48px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-align: center;
  }

  .ra-state-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    background: ${
      darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"
    };
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)"
    };
  }

  .ra-state.success .ra-state-icon {
    color: #34d399;
    background: rgba(52,211,153,0.1);
    border-color: rgba(52,211,153,0.25);
  }

  .ra-state.danger .ra-state-icon {
    color: #fb7185;
    background: rgba(244,63,94,0.1);
    border-color: rgba(244,63,94,0.25);
  }

  .ra-state h3 {
    font-size: 18px;
    font-weight: 900;
  }

  .ra-state p {
    max-width: 360px;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.7;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.55)"};
  }

  .ra-state-btn {
    margin-top: 8px;
    padding: 10px 20px;
    font-size: 13px;
  }

  .ra-spinner {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    border: 3px solid ${
      darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)"
    };
    border-top-color: #f43f5e;
    animation: ra-spin 0.75s linear infinite;
  }

  @keyframes ra-spin {
    to { transform: rotate(360deg); }
  }
`;

export default RiskAlertsPage;