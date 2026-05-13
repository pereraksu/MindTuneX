import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import HighRiskEntries from "../components/admin/HighRiskEntries";
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

const formatDate = (iso) => {
  if (!iso) return "N/A";

  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const RiskAlertsPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode } = useTheme();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getHighRiskEntriesApi();

      console.log("Risk alerts response:", res);

      const data = Array.isArray(res)
        ? res
        : Array.isArray(res?.data?.alerts)
        ? res.data.alerts
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : [];

      setAlerts(data);
    } catch (err) {
      console.error("Failed to load alerts:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to fetch risk alerts. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const showSuccess = (message) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="ra-root">
        <div className="ra-glow ra-glow-1" />
        <div className="ra-glow ra-glow-2" />

        {successMsg && <div className="ra-toast">✅ {successMsg}</div>}

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

                    <button
                      type="button"
                      onClick={loadAlerts}
                      className="ra-refresh"
                      disabled={loading}
                    >
                      {loading ? "Refreshing..." : "↻ Refresh Alerts"}
                    </button>
                  </div>
                </div>
              </section>

              {loading ? (
                <StateCard title="Loading risk alerts..." loading />
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
                      setAlerts={setAlerts}
                      showSuccess={showSuccess}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="ra-footer-wrap">
              <Footer admin />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const AlertCard = ({ entry, setAlerts, showSuccess }) => {
  const [reviewing, setReviewing] = useState(false);
  const [contacting, setContacting] = useState(false);

  const tone = getRiskTone(entry.supportLevel);
  const emoKey = entry.predictedEmotion?.toLowerCase() || "neutral";
  const emoEmoji = MOOD_EMOJI[emoKey] || "😐";
  const emoColor = MOOD_COLOR[emoKey] || "#94a3b8";

  const confPct =
    entry.confidence !== null && entry.confidence !== undefined
      ? Math.round(entry.confidence * 100)
      : null;

  const fullName = entry.user?.fullName || entry.user?.name || "Unknown User";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleReview = async () => {
    try {
      setReviewing(true);

      await markReviewedApi(entry._id);

      setAlerts((prev) => prev.filter((item) => item._id !== entry._id));

      showSuccess("Alert marked as reviewed");
    } catch (err) {
      console.error("Review failed:", err);
    } finally {
      setReviewing(false);
    }
  };

  const handleContact = async () => {
    try {
      setContacting(true);

      const res = await contactUserApi(entry._id);
      const email = res?.email || res?.data?.email || entry.user?.email;

      if (!email) {
        showSuccess("User email not found");
        return;
      }

      window.location.href = `mailto:${email}`;
    } catch (err) {
      console.error("Contact failed:", err);
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
          {initials || "U"}
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
          “
          {entry.displayText ||
            entry.inputText ||
            entry.text ||
            "No journal text available"}
          ”
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
            type="button"
            className="ra-review"
            onClick={handleReview}
            disabled={reviewing}
          >
            {reviewing ? "Reviewing..." : "Mark as Reviewed"}
          </button>

          <button
            type="button"
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
      <button type="button" onClick={action} className="ra-state-btn">
        Try Again
      </button>
    )}
  </div>
);

const STYLES = (darkMode) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  .ra-root {
    display: flex;
    min-height: 100svh;
    position: relative;
    overflow-x: hidden;
    font-family: 'Inter', system-ui, sans-serif;
    background: ${
      darkMode
        ? "linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)"
        : "linear-gradient(135deg, #f8fafc 0%, #fff7ed 50%, #fef2f2 100%)"
    };
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .ra-toast {
    position: fixed;
    top: 22px;
    right: 24px;
    z-index: 9999;
    padding: 14px 18px;
    border-radius: 16px;
    background: ${darkMode ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.96)"};
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.14)" : "rgba(15,23,42,0.10)"
    };
    box-shadow: 0 18px 45px rgba(15,23,42,0.18);
    font-size: 13px;
    font-weight: 900;
  }

  .ra-glow {
    position: fixed;
    border-radius: 999px;
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
    opacity: ${darkMode ? "0.45" : "0.25"};
  }

  .ra-glow-1 {
    top: -160px;
    left: -120px;
    width: 520px;
    height: 520px;
    background: #fb7185;
  }

  .ra-glow-2 {
    bottom: -150px;
    right: -120px;
    width: 480px;
    height: 480px;
    background: #f97316;
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
    padding: 34px 26px;
  }

  @media(min-width:1024px) {
    .ra-main {
      padding: 38px 44px;
    }
  }

  .ra-container {
    max-width: 1220px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
 
  .ra-footer-wrap {
  width: 100%;
  max-width: 1220px;
  margin: 64px auto 24px;
}
  
  .ra-hero,
  .ra-card,
  .ra-state {
    border-radius: 30px;
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.08)"
    };
    background: ${
      darkMode
        ? "linear-gradient(145deg, rgba(15,23,42,0.86), rgba(2,6,23,0.82))"
        : "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(248,250,252,0.82))"
    };
    backdrop-filter: blur(28px);
    box-shadow: ${
      darkMode
        ? "0 28px 70px rgba(0,0,0,0.40)"
        : "0 24px 60px rgba(15,23,42,0.10)"
    };
  }

  .ra-hero {
    position: relative;
    overflow: hidden;
    padding: 34px;
  }

  .ra-hero-line,
  .ra-card-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
  }

  .ra-hero-line {
    background: linear-gradient(90deg, #fb7185, #f97316, #f59e0b);
  }

  .ra-hero-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  @media(min-width:1024px) {
    .ra-hero-inner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .ra-eyebrow {
    display: inline-flex;
    width: fit-content;
    padding: 7px 14px;
    border-radius: 999px;
    background: rgba(251,113,133,0.12);
    border: 1px solid rgba(251,113,133,0.24);
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #fb7185;
  }

  .ra-title {
    margin-top: 14px;
    font-size: clamp(34px, 4vw, 52px);
    font-weight: 900;
    letter-spacing: -0.06em;
    line-height: 1.02;
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .ra-title span {
    background: linear-gradient(135deg, #fb7185, #f97316);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .ra-subtitle {
    margin-top: 14px;
    max-width: 650px;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.75;
    color: ${darkMode ? "rgba(226,232,240,0.58)" : "rgba(15,23,42,0.56)"};
  }

  .ra-pills,
  .ra-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .ra-pills {
    margin-top: 20px;
  }

  .ra-actions {
    align-items: center;
    flex-shrink: 0;
  }

  .ra-pill,
  .ra-live {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 15px;
    border-radius: 999px;
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.08)"
    };
    background: ${
      darkMode ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.72)"
    };
    font-size: 12px;
    font-weight: 800;
    color: ${darkMode ? "rgba(226,232,240,0.68)" : "rgba(15,23,42,0.62)"};
  }

  .ra-pill.danger,
  .ra-live {
    color: #fb7185;
    border-color: rgba(251,113,133,0.28);
    background: rgba(251,113,133,0.12);
  }

  .ra-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .pulse {
    animation: ra-pulse 1.5s ease-in-out infinite;
  }

  @keyframes ra-pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }

    50% {
      opacity: 0.45;
      transform: scale(0.82);
    }
  }

  .ra-refresh,
  .ra-state-btn {
    border: none;
    cursor: pointer;
    font-family: inherit;
    border-radius: 999px;
    font-weight: 900;
    color: #fff;
    background: linear-gradient(135deg, #fb7185, #f97316);
    box-shadow: 0 18px 36px rgba(251,113,133,0.30);
    transition: all 0.2s ease;
  }

  .ra-refresh {
    padding: 13px 22px;
    font-size: 13px;
  }

  .ra-refresh:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .ra-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
  }

  @media(min-width:1280px) {
    .ra-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .ra-card {
    position: relative;
    overflow: hidden;
    padding: 24px;
    transition: all 0.24s ease;
  }

  .ra-card:hover {
    transform: translateY(-4px);
    border-color: rgba(251,113,133,0.30);
  }

  .ra-card-head {
    display: flex;
    gap: 14px;
    padding-bottom: 17px;
    border-bottom: 1px solid ${
      darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.07)"
    };
  }

  .ra-avatar {
    width: 52px;
    height: 52px;
    border-radius: 18px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 950;
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
    gap: 9px;
    margin-bottom: 5px;
  }

  .ra-name-row h3 {
    font-size: 16px;
    font-weight: 950;
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .ra-user p {
    font-size: 12.5px;
    font-weight: 650;
    color: ${darkMode ? "rgba(148,163,184,0.72)" : "rgba(15,23,42,0.48)"};
  }

  .ra-priority {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 999px;
    border: 1px solid;
    font-size: 10.5px;
    font-weight: 950;
  }

  .ra-priority span {
    width: 6px;
    height: 6px;
    border-radius: 999px;
  }

  .ra-content-box {
    margin-top: 17px;
    padding: 17px 18px;
    border-radius: 20px;
    border: 1px solid rgba(251,113,133,0.20);
    background: ${
      darkMode ? "rgba(251,113,133,0.08)" : "rgba(251,113,133,0.07)"
    };
  }

  .ra-content-label {
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #fb7185;
    margin-bottom: 9px;
  }

  .ra-content-text {
    font-size: 13.5px;
    font-weight: 600;
    line-height: 1.75;
    font-style: italic;
    color: ${darkMode ? "rgba(248,250,252,0.74)" : "rgba(15,23,42,0.70)"};
  }

  .ra-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 15px;
  }

  .ra-tag {
    padding: 6px 13px;
    border-radius: 999px;
    border: 1px solid;
    font-size: 11px;
    font-weight: 900;
    text-transform: capitalize;
  }

  .ra-tag.muted {
    color: ${darkMode ? "rgba(226,232,240,0.62)" : "rgba(15,23,42,0.58)"};
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"};
    border-color: ${darkMode ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.08)"};
  }

  .ra-tag.blue {
    color: #38bdf8;
    background: rgba(14,165,233,0.11);
    border-color: rgba(14,165,233,0.26);
  }

  .ra-footer {
    margin-top: 17px;
    padding-top: 15px;
    border-top: 1px solid ${
      darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.07)"
    };
    display: flex;
    flex-direction: column;
    gap: 13px;
  }

  .ra-footer p {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 750;
    color: ${darkMode ? "rgba(226,232,240,0.50)" : "rgba(15,23,42,0.52)"};
  }

  .ra-footer p span {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .ra-card-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .ra-review,
  .ra-contact {
    padding: 12px;
    border-radius: 16px;
    cursor: pointer;
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 950;
    transition: all 0.18s ease;
  }

  .ra-review:disabled,
  .ra-contact:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .ra-review {
    color: #fff;
    background: linear-gradient(135deg, #fb7185, #e11d48);
    border: 1px solid rgba(251,113,133,0.30);
    box-shadow: 0 14px 28px rgba(225,29,72,0.20);
  }

  .ra-contact {
    color: ${darkMode ? "#e2e8f0" : "#0f172a"};
    background: ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.76)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.08)"};
  }

  .ra-state {
    min-height: 42vh;
    padding: 52px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 13px;
    text-align: center;
  }

  .ra-state-icon {
    width: 68px;
    height: 68px;
    border-radius: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.72)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.08)"};
  }

  .ra-state h3 {
    font-size: 19px;
    font-weight: 950;
  }

  .ra-state p {
    max-width: 380px;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.7;
    color: ${darkMode ? "rgba(226,232,240,0.54)" : "rgba(15,23,42,0.56)"};
  }

  .ra-state-btn {
    margin-top: 8px;
    padding: 11px 22px;
    font-size: 13px;
  }

  .ra-spinner {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    border: 3px solid ${
      darkMode ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.10)"
    };
    border-top-color: #fb7185;
    animation: ra-spin 0.75s linear infinite;
  }

  @keyframes ra-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media(max-width: 720px) {
    .ra-main {
      padding: 24px 16px;
    }

    .ra-hero {
      padding: 24px;
      border-radius: 24px;
    }

    .ra-card {
      padding: 20px;
      border-radius: 24px;
    }

    .ra-card-actions {
      grid-template-columns: 1fr;
    }
  }
`;

export default RiskAlertsPage;