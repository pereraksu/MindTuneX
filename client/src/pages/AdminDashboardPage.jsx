import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import AdminStatsCards from "../components/admin/AdminStatsCards";
import AdminUserTable from "../components/admin/AdminUserTable";
import HighRiskEntries from "../components/admin/HighRiskEntries";
import SupportUserList from "../components/admin/SupportUserList";
import {
  getAdminSummaryApi,
  getAdminUsersApi,
  getHighRiskEntriesApi,
  getSupportUsersApi,
  getSystemStatusApi,
  getChatbotStatsApi,
} from "../api/adminApi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";

const AnimNum = ({ value }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const end = Number(value) || 0;
    if (typeof value !== "number") return;

    let start = 0;
    const step = Math.ceil(end / 30) || 1;

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [value]);

  return <>{typeof value === "number" ? display : value}</>;
};

const MetricCard = ({
  icon,
  label,
  value,
  sub,
  gradFrom,
  gradTo,
  valColor,
}) => (
  <div className="ad-metric-card">
    <div
      className="ad-metric-bar"
      style={{ background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})` }}
    />
    <div className="ad-metric-glow" style={{ background: `${gradFrom}24` }} />

    <div className="ad-metric-inner">
      <div className="ad-metric-row">
        <div
          className="ad-metric-icon"
          style={{
            background: `${gradFrom}18`,
            borderColor: `${gradFrom}38`,
            color: gradFrom,
          }}
        >
          {icon}
        </div>
        <span className="ad-metric-pulse" style={{ background: gradFrom }} />
      </div>

      <p className="ad-metric-label">{label}</p>
      <p className="ad-metric-val" style={valColor ? { color: valColor } : {}}>
        <AnimNum value={value} />
      </p>
      <p className="ad-metric-sub">{sub}</p>
    </div>
  </div>
);

const SectionHeader = ({ eyebrow, title, badge, badgeColor }) => (
  <div className="ad-section-header">
    <div>
      <p className="ad-eyebrow">{eyebrow}</p>
      <h2 className="ad-section-title">{title}</h2>
    </div>

    {badge && (
      <span
        className="ad-badge"
        style={{
          color: badgeColor,
          background: `${badgeColor}15`,
          borderColor: `${badgeColor}33`,
        }}
      >
        {badge}
      </span>
    )}
  </div>
);

const AdminDashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode } = useTheme();

  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [highRiskEntries, setHighRiskEntries] = useState([]);
  const [supportUsers, setSupportUsers] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [chatbotStats, setChatbotStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        summaryRes,
        usersRes,
        highRiskRes,
        supportUsersRes,
        systemStatusRes,
        chatbotStatsRes,
      ] = await Promise.all([
        getAdminSummaryApi(),
        getAdminUsersApi(),
        getHighRiskEntriesApi(),
        getSupportUsersApi(),
        getSystemStatusApi(),
        getChatbotStatsApi(),
      ]);

      setSummary(summaryRes?.data || summaryRes || null);
      setUsers(usersRes?.data || usersRes || []);
      setHighRiskEntries(highRiskRes?.data || highRiskRes || []);
      setSupportUsers(supportUsersRes?.data || supportUsersRes || []);
      setSystemStatus(systemStatusRes?.data || systemStatusRes || null);
      setChatbotStats(chatbotStatsRes?.data || chatbotStatsRes || null);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Admin load failed:", err);
      setError("Failed to load dashboard data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
    const interval = setInterval(loadAdminData, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalUsers = users.length;
  const totalHighRisk = highRiskEntries.length;
  const totalSupport = supportUsers.length;

  const platformStatus =
    totalHighRisk >= 10
      ? "Critical"
      : totalHighRisk >= 5
      ? "Moderate Risk"
      : "Stable";

  const platformStatusColor =
    totalHighRisk >= 10
      ? "#fb7185"
      : totalHighRisk >= 5
      ? "#fb923c"
      : "#34d399";

  const systemCards = [
    {
      icon: "🖥️",
      label: "Server Status",
      value: systemStatus?.serverStatus || "—",
      sub: "Core backend service",
      gradFrom: "#10b981",
      gradTo: "#14b8a6",
      valColor:
        systemStatus?.serverStatus === "Operational" ? "#34d399" : "#fb7185",
    },
    {
      icon: "🧠",
      label: "AI Model API",
      value: systemStatus?.aiModelApi || "—",
      sub: "FastAPI · DistilBERT",
      gradFrom: "#8b5cf6",
      gradTo: "#ec4899",
      valColor:
        systemStatus?.aiModelApi === "Connected" ? "#34d399" : "#fb7185",
    },
    {
      icon: "👤",
      label: "Active Users",
      value: systemStatus?.activeUsers ?? 0,
      sub: "Last 24 hours",
      gradFrom: "#0ea5e9",
      gradTo: "#6366f1",
    },
    {
      icon: "🗄️",
      label: "Database",
      value: systemStatus?.database || "—",
      sub: "MongoDB connection",
      gradFrom: "#14b8a6",
      gradTo: "#06b6d4",
      valColor: systemStatus?.database === "Healthy" ? "#34d399" : "#fb7185",
    },
  ];

  const platformCards = [
    {
      icon: "👥",
      label: "Total Users",
      value: totalUsers,
      sub: "Registered accounts",
      gradFrom: "#0ea5e9",
      gradTo: "#6366f1",
    },
    {
      icon: "⚠️",
      label: "High Risk Entries",
      value: totalHighRisk,
      sub: "Requires immediate review",
      gradFrom: "#f43f5e",
      gradTo: "#e11d48",
      valColor: totalHighRisk > 0 ? "#fb7185" : undefined,
    },
    {
      icon: "🤝",
      label: "Support Queue",
      value: totalSupport,
      sub: "Pending attention",
      gradFrom: "#f59e0b",
      gradTo: "#f97316",
    },
  ];

  const chatbotCards = chatbotStats
    ? [
        {
          icon: "💬",
          label: "Total Chats",
          value: chatbotStats.totalChats || 0,
          sub: "User interactions",
          gradFrom: "#6366f1",
          gradTo: "#8b5cf6",
        },
        {
          icon: "❤️",
          label: "Avg Sentiment",
          value: chatbotStats.avgSentiment || "0.00",
          sub: "Overall emotional score",
          gradFrom: "#ec4899",
          gradTo: "#f43f5e",
        },
        {
          icon: "🎯",
          label: "Top Emotion",
          value: chatbotStats.topEmotion || "N/A",
          sub: "Most detected emotional state",
          gradFrom: "#f59e0b",
          gradTo: "#f97316",
        },
      ]
    : [];

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="ad-root">
        <div className="ad-glow ad-glow-1" />
        <div className="ad-glow ad-glow-2" />
        <div className="ad-glow ad-glow-3" />

        <Sidebar forceAdmin />

        <div className="ad-body">
          <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

          <main className="ad-main">
            <div className="ad-container">
              <div className="ad-hero">
                <div className="ad-hero-bar" />

                <div className="ad-hero-inner">
                  <div>
                    <p className="ad-eyebrow admin">
                      Administrative Control Center
                    </p>

                    <h1 className="ad-hero-title">
                      Admin <span>Dashboard</span>
                    </h1>

                    <p className="ad-hero-sub">
                      Monitor user wellbeing, review high-risk emotional signals,
                      manage support cases, and maintain platform health.
                    </p>

                    <div className="ad-hero-pills">
                      <span className="ad-pill">
                        <span
                          className="ad-pill-dot"
                          style={{ background: "#f59e0b" }}
                        />
                        {user?.fullName || "Administrator"}
                      </span>

                      <span
                        className="ad-pill"
                        style={{
                          color: platformStatusColor,
                          background: `${platformStatusColor}12`,
                          borderColor: `${platformStatusColor}33`,
                        }}
                      >
                        <span
                          className="ad-pill-dot ad-pill-dot-pulse"
                          style={{ background: platformStatusColor }}
                        />
                        Platform: {platformStatus}
                      </span>

                      <span className="ad-pill">
                        🕐 {lastRefresh.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="ad-hero-actions">
                    <button onClick={loadAdminData} className="ad-btn-refresh">
                      ↻ Refresh
                    </button>

                    <div className="ad-auto-badge">Auto · 1min</div>
                  </div>
                </div>
              </div>

              {loading && (
                <div className="ad-loading-state">
                  <div className="ad-spinner" />
                  <p className="ad-state-text">Loading dashboard data…</p>
                </div>
              )}

              {!loading && error && (
                <div className="ad-error-state">
                  <div className="ad-error-icon">⚠️</div>
                  <p className="ad-error-title">Unable to load data</p>
                  <p className="ad-error-sub">{error}</p>

                  <button onClick={loadAdminData} className="ad-retry-btn">
                    Try Again
                  </button>
                </div>
              )}

              {!loading && !error && (
                <div className="ad-content">
                  <section>
                    <SectionHeader
                      eyebrow="Infrastructure"
                      title="Live System Health"
                      badge={systemStatus?.serverStatus || "Checking…"}
                      badgeColor="#34d399"
                    />

                    <div className="ad-grid-4">
                      {systemCards.map((card, index) => (
                        <MetricCard key={index} {...card} />
                      ))}
                    </div>
                  </section>

                  <section>
                    <SectionHeader
                      eyebrow="Platform Analytics"
                      title="Key Metrics"
                      badge={`${totalUsers} total users`}
                      badgeColor="#38bdf8"
                    />

                    <div className="ad-grid-3">
                      {platformCards.map((card, index) => (
                        <MetricCard key={index} {...card} />
                      ))}
                    </div>
                  </section>

                  {chatbotStats && (
                    <section>
                      <SectionHeader
                        eyebrow="AI Chatbot"
                        title="Chat Intelligence"
                      />

                      <div className="ad-grid-3">
                        {chatbotCards.map((card, index) => (
                          <MetricCard key={index} {...card} />
                        ))}
                      </div>
                    </section>
                  )}

                  <section>
                    <SectionHeader
                      eyebrow="Detailed Breakdown"
                      title="Platform Statistics"
                    />
                    <AdminStatsCards summary={summary} />
                  </section>

                  <section className="ad-grid-2">
                    <div className="ad-table-section">
                      <div className="ad-table-header">
                        <h3 className="ad-table-title">High Risk Entries</h3>
                        <span
                          className="ad-badge"
                          style={{
                            color: "#fb7185",
                            background: "rgba(244,63,94,0.1)",
                            borderColor: "rgba(244,63,94,0.25)",
                          }}
                        >
                          {totalHighRisk} flagged
                        </span>
                      </div>

                      <HighRiskEntries entries={highRiskEntries} />
                    </div>

                    <div className="ad-table-section">
                      <div className="ad-table-header">
                        <h3 className="ad-table-title">Support Queue</h3>
                        <span
                          className="ad-badge"
                          style={{
                            color: "#fb923c",
                            background: "rgba(249,115,22,0.1)",
                            borderColor: "rgba(249,115,22,0.25)",
                          }}
                        >
                          {totalSupport} pending
                        </span>
                      </div>

                      <SupportUserList users={supportUsers} />
                    </div>
                  </section>

                  <section className="ad-table-section">
                    <div className="ad-table-header">
                      <h3 className="ad-table-title">All Registered Users</h3>
                      <span
                        className="ad-badge"
                        style={{
                          color: "#38bdf8",
                          background: "rgba(14,165,233,0.1)",
                          borderColor: "rgba(14,165,233,0.25)",
                        }}
                      >
                        {totalUsers} accounts
                      </span>
                    </div>

                    <AdminUserTable users={users} />
                  </section>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  .ad-root {
    display: flex;
    min-height: 100svh;
    background: ${
      darkMode
        ? "radial-gradient(circle at top left, rgba(245,158,11,0.1), transparent 34%), #080c14"
        : "linear-gradient(135deg, #fff7ed 0%, #f8fafc 48%, #eef9ff 100%)"
    };
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .ad-glow {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .ad-glow-1 {
    top: -120px;
    left: -100px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(245,158,11,0.14) 0%, transparent 65%);
  }

  .ad-glow-2 {
    top: 30%;
    right: -120px;
    width: 440px;
    height: 440px;
    background: radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 65%);
  }

  .ad-glow-3 {
    bottom: -80px;
    left: 20%;
    width: 380px;
    height: 380px;
    background: radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%);
  }

  .ad-body {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    z-index: 1;
    min-width: 0;
  }

  .ad-main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
  }

  @media(min-width: 1024px) {
    .ad-main {
      padding: 36px 40px;
    }
  }

  .ad-container {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .ad-hero,
  .ad-metric-card,
  .ad-error-state {
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

  .ad-hero {
    padding: 32px;
    animation: ad-fade-up 0.45s ease both;
  }

  @keyframes ad-fade-up {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ad-hero-bar {
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, #f59e0b, #f97316, #fbbf24);
  }

  .ad-hero-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  @media(min-width: 1024px) {
    .ad-hero-inner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .ad-eyebrow {
    display: block;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 9px;
  }

  .ad-eyebrow.admin {
    color: #f59e0b;
  }

  .ad-hero-title {
    font-size: clamp(34px, 4vw, 50px);
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.96)" : "#0f172a"};
    line-height: 1.02;
    margin-bottom: 13px;
    letter-spacing: -0.045em;
  }

  .ad-hero-title span {
    background: linear-gradient(135deg, #f59e0b, #fbbf24);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .ad-hero-sub {
    max-width: 590px;
    font-size: 13.5px;
    line-height: 1.75;
    color: ${darkMode ? "rgba(255,255,255,0.44)" : "rgba(15,23,42,0.56)"};
    margin-bottom: 18px;
  }

  .ad-hero-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }

  .ad-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 15px;
    border-radius: 999px;
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    font-size: 11.5px;
    font-weight: 850;
    color: ${darkMode ? "rgba(255,255,255,0.52)" : "rgba(15,23,42,0.58)"};
  }

  .ad-pill-dot,
  .ad-metric-pulse {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .ad-pill-dot-pulse,
  .ad-metric-pulse {
    animation: ad-pulse 1.9s ease-in-out infinite;
  }

  @keyframes ad-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.38; transform: scale(0.78); }
  }

  .ad-hero-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .ad-btn-refresh {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 42px;
    padding: 11px 22px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
    font-weight: 950;
    color: #fff;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    box-shadow: 0 15px 30px rgba(245,158,11,0.26);
    transition: all 0.2s ease;
  }

  .ad-btn-refresh:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 38px rgba(245,158,11,0.32);
  }

  .ad-auto-badge {
    padding: 11px 17px;
    border-radius: 999px;
    background: rgba(245,158,11,0.1);
    border: 1px solid rgba(245,158,11,0.25);
    font-size: 12px;
    font-weight: 950;
    color: #f59e0b;
  }

  .ad-loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 42vh;
    gap: 14px;
  }

  .ad-spinner {
    width: 38px;
    height: 38px;
    border-radius: 999px;
    border: 3px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    border-top-color: #f59e0b;
    animation: ad-spin 0.75s linear infinite;
  }

  @keyframes ad-spin {
    to { transform: rotate(360deg); }
  }

  .ad-state-text {
    font-size: 13px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.48)"};
  }

  .ad-error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 24px;
    text-align: center;
    border-color: rgba(244,63,94,0.25);
    background: rgba(244,63,94,0.08);
  }

  .ad-error-icon {
    width: 54px;
    height: 54px;
    border-radius: 18px;
    background: rgba(244,63,94,0.12);
    border: 1px solid rgba(244,63,94,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fb7185;
    margin-bottom: 14px;
    font-size: 24px;
  }

  .ad-error-title {
    font-size: 17px;
    font-weight: 950;
    color: #fb7185;
    margin-bottom: 6px;
  }

  .ad-error-sub {
    font-size: 13px;
    color: rgba(244,63,94,0.72);
    margin-bottom: 18px;
  }

  .ad-retry-btn {
    padding: 10px 22px;
    border-radius: 999px;
    background: rgba(244,63,94,0.14);
    border: 1px solid rgba(244,63,94,0.32);
    color: #fb7185;
    font-size: 13px;
    font-weight: 950;
    font-family: inherit;
    cursor: pointer;
  }

  .ad-content {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .ad-grid-4 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media(min-width: 1280px) {
    .ad-grid-4 {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .ad-grid-3 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @media(min-width: 768px) {
    .ad-grid-3 {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .ad-grid-2 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media(min-width: 1024px) {
    .ad-grid-2 {
      grid-template-columns: 1fr 1fr;
    }
  }

  .ad-section-header,
  .ad-table-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
  }

  .ad-section-title,
  .ad-table-title {
    font-size: 20px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.88)" : "#0f172a"};
  }

  .ad-table-title {
    font-size: 18px;
  }

  .ad-badge {
    padding: 5px 13px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 950;
    border: 1px solid;
    letter-spacing: 0.04em;
    text-transform: capitalize;
  }

  .ad-metric-card {
    transition: all 0.22s ease;
    animation: ad-fade-up 0.45s ease both;
  }

  .ad-metric-card:hover {
    transform: translateY(-4px);
    border-color: ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(245,158,11,0.2)"};
  }

  .ad-metric-glow {
    position: absolute;
    right: -70px;
    top: -70px;
    width: 190px;
    height: 190px;
    border-radius: 999px;
    filter: blur(22px);
    pointer-events: none;
  }

  .ad-metric-bar {
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
  }

  .ad-metric-inner {
    position: relative;
    z-index: 1;
    padding: 22px 24px;
  }

  .ad-metric-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .ad-metric-icon {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }

  .ad-metric-label {
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 8px;
  }

  .ad-metric-val {
    font-size: 32px;
    font-weight: 950;
    letter-spacing: -0.04em;
    color: ${darkMode ? "rgba(255,255,255,0.92)" : "#0f172a"};
    line-height: 1;
    text-transform: capitalize;
    margin-bottom: 7px;
  }

  .ad-metric-sub {
    font-size: 12px;
    font-weight: 750;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.48)"};
  }

  .ad-table-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

export default AdminDashboardPage;