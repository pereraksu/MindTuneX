import { useState, useEffect, useRef } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const USAGE_DATA = [
  { name: "Mon", entries: 45 },
  { name: "Tue", entries: 52 },
  { name: "Wed", entries: 38 },
  { name: "Thu", entries: 65 },
  { name: "Fri", entries: 48 },
  { name: "Sat", entries: 25 },
  { name: "Sun", entries: 30 },
];

const BAR_COLORS = [
  "#8b5cf6",
  "#a78bfa",
  "#8b5cf6",
  "#a78bfa",
  "#8b5cf6",
  "#c4b5fd",
  "#c4b5fd",
];

const ACTIVITY_LOGS = [
  {
    action: "Admin Report Export",
    user: "Sasini U.",
    status: "Success",
    time: "10:45 AM",
    statusColor: "#34d399",
  },
  {
    action: "Risk Alert Triggered",
    user: "User #402",
    status: "Notified",
    time: "09:12 AM",
    statusColor: "#fb923c",
  },
  {
    action: "DB Maintenance",
    user: "System",
    status: "Completed",
    time: "01:00 AM",
    statusColor: "#38bdf8",
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="sr-tooltip">
      <p className="sr-tooltip-label">{label}</p>
      <p className="sr-tooltip-value">{payload[0].value} entries</p>
    </div>
  );
};

const SystemReportsPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode } = useTheme();

  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      setIsDownloading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const node = reportRef.current;

      const dataUrl = await toPng(node, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: darkMode ? "#080c14" : "#ffffff",
        width: node.scrollWidth,
        height: node.scrollHeight,
        style: {
          overflow: "visible",
          width: `${node.scrollWidth}px`,
          height: `${node.scrollHeight}px`,
          maxHeight: "none",
        },
      });

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(dataUrl);
      const imgWidth = pageWidth - 20;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(dataUrl, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }

      pdf.save(`MindTuneX_System_Report_${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF Error:", err);
      alert("Failed to generate PDF report.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="sr-root">
        <div className="sr-glow sr-glow-1" />
        <div className="sr-glow sr-glow-2" />

        <Sidebar forceAdmin />

        <div className="sr-body">
          <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

          <main className="sr-main">
            <div className="sr-container">
              <section className="sr-hero">
                <div className="sr-hero-line" />

                <div>
                  <p className="sr-eyebrow">Administrative Analytics</p>
                  <h1 className="sr-title">
                    Executive <span>Insights</span>
                  </h1>
                  <p className="sr-subtitle">
                    Comprehensive overview of platform performance, AI service
                    status, user engagement, and safety signals.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading || loading}
                  className="sr-export-btn"
                >
                  {isDownloading ? (
                    <>
                      <span className="sr-spinner" /> Preparing…
                    </>
                  ) : (
                    <>Export Executive Report ↓</>
                  )}
                </button>
              </section>

              {loading ? (
                <div className="sr-loading">
                  <div className="sr-spinner-lg" />
                  <p>Loading analytics…</p>
                </div>
              ) : (
                <div ref={reportRef} className="sr-report">
                  <div className="sr-report-header">
                    <h2>MindTuneX System Analytics</h2>
                    <p>
                      Administrator: {user?.fullName || "Administrator"} |
                      Generated: {new Date().toLocaleString()}
                    </p>
                  </div>

                  <div className="sr-status-grid">
                    <StatusCard
                      title="Server Status"
                      value="Operational"
                      valueColor="#34d399"
                      dotColor="#10b981"
                      from="#10b981"
                      to="#14b8a6"
                    />

                    <StatusCard
                      title="AI Model API"
                      value="Connected"
                      valueColor="#34d399"
                      dotColor="#10b981"
                      from="#8b5cf6"
                      to="#6366f1"
                    />

                    <StatusCard
                      title="Active Users"
                      value="1,240"
                      valueColor={darkMode ? "#f8fafc" : "#0f172a"}
                      from="#0ea5e9"
                      to="#6366f1"
                    />

                    <StatusCard
                      title="Database"
                      value="Healthy"
                      valueColor="#34d399"
                      dotColor="#10b981"
                      from="#14b8a6"
                      to="#06b6d4"
                    />
                  </div>

                  <div className="sr-charts-row">
                    <div className="sr-card sr-chart-wide">
                      <p className="sr-card-eyebrow">User Engagement</p>
                      <h2 className="sr-card-title">Weekly Mood Entries</h2>
                      <p className="sr-card-sub">
                        Platform usage volume across the last seven days.
                      </p>

                      <div className="sr-chart-area">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={USAGE_DATA}
                            margin={{ top: 8, right: 4, left: -16, bottom: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray="4 4"
                              vertical={false}
                              stroke={
                                darkMode
                                  ? "rgba(255,255,255,0.06)"
                                  : "rgba(15,23,42,0.08)"
                              }
                            />

                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              fontSize={11}
                              tick={{
                                fill: darkMode
                                  ? "rgba(255,255,255,0.38)"
                                  : "rgba(15,23,42,0.48)",
                                fontFamily: "'DM Sans', system-ui, sans-serif",
                              }}
                            />

                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              fontSize={11}
                              tick={{
                                fill: darkMode
                                  ? "rgba(255,255,255,0.28)"
                                  : "rgba(15,23,42,0.42)",
                                fontFamily: "'DM Sans', system-ui, sans-serif",
                              }}
                            />

                            <Tooltip
                              content={<CustomTooltip />}
                              cursor={{
                                fill: darkMode
                                  ? "rgba(255,255,255,0.04)"
                                  : "rgba(139,92,246,0.06)",
                              }}
                            />

                            <Bar
                              dataKey="entries"
                              radius={[10, 10, 0, 0]}
                              barSize={38}
                            >
                              {USAGE_DATA.map((_, index) => (
                                <Cell
                                  key={index}
                                  fill={BAR_COLORS[index]}
                                  fillOpacity={0.94}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="sr-card sr-chart-narrow">
                      <p className="sr-card-eyebrow">Mood Distribution</p>
                      <h2 className="sr-card-title">Safety Overview</h2>
                      <p className="sr-card-sub">
                        Sentiment and high-risk signal breakdown.
                      </p>

                      <div className="sr-progress-list">
                        <ProgressItem
                          label="Positive"
                          val={68}
                          from="#10b981"
                          to="#14b8a6"
                        />
                        <ProgressItem
                          label="Neutral"
                          val={18}
                          from="#0ea5e9"
                          to="#6366f1"
                        />
                        <ProgressItem
                          label="High Risk"
                          val={14}
                          from="#f43f5e"
                          to="#f97316"
                        />
                      </div>

                      <div className="sr-ai-box">
                        <p>AI Insight</p>
                        <span>
                          Engagement is rising. User safety metrics remain within
                          stable monitoring thresholds.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sr-card">
                    <div className="sr-log-head">
                      <div>
                        <p className="sr-card-eyebrow">System Activity Logs</p>
                        <h2 className="sr-card-title">Recent Admin Events</h2>
                      </div>

                      <span className="sr-log-count">
                        {ACTIVITY_LOGS.length} logs
                      </span>
                    </div>

                    <div className="sr-log-list">
                      {ACTIVITY_LOGS.map((log, index) => (
                        <div key={index} className="sr-log-row">
                          <div className="sr-log-left">
                            <span
                              className="sr-log-dot"
                              style={{
                                background: log.statusColor,
                                boxShadow: `0 0 10px ${log.statusColor}88`,
                              }}
                            />

                            <div>
                              <p className="sr-log-action">{log.action}</p>
                              <p className="sr-log-user">{log.user}</p>
                            </div>
                          </div>

                          <div className="sr-log-right">
                            <p style={{ color: log.statusColor }}>
                              {log.status}
                            </p>
                            <span>{log.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const StatusCard = ({ title, value, valueColor, dotColor, from, to }) => (
  <div className="sr-status-card">
    <div
      className="sr-status-line"
      style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}
    />

    <p className="sr-status-label">{title}</p>

    <div className="sr-status-row">
      {dotColor && (
        <span
          className="sr-status-dot"
          style={{
            background: dotColor,
            boxShadow: `0 0 10px ${dotColor}88`,
          }}
        />
      )}

      <p style={{ color: valueColor }}>{value}</p>
    </div>
  </div>
);

const ProgressItem = ({ label, val, from, to }) => (
  <div className="sr-prog-item">
    <div className="sr-prog-head">
      <span>{label}</span>
      <strong style={{ color: from }}>{val}%</strong>
    </div>

    <div className="sr-prog-track">
      <div
        className="sr-prog-fill"
        style={{
          width: `${val}%`,
          background: `linear-gradient(90deg, ${from}, ${to})`,
        }}
      />
    </div>
  </div>
);

const STYLES = (darkMode) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

  .sr-root {
    display: flex;
    min-height: 100svh;
    position: relative;
    overflow-x: hidden;
    font-family: 'DM Sans', system-ui, sans-serif;
    background: ${
      darkMode
        ? "radial-gradient(circle at top left, rgba(139,92,246,0.13), transparent 34%), #080c14"
        : "linear-gradient(135deg, #f5f3ff 0%, #f8fafc 48%, #eef9ff 100%)"
    };
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .sr-glow {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(76px);
    z-index: 0;
  }

  .sr-glow-1 {
    top: -120px;
    left: -100px;
    width: 480px;
    height: 480px;
    background: rgba(139,92,246,0.16);
  }

  .sr-glow-2 {
    bottom: -120px;
    right: -100px;
    width: 430px;
    height: 430px;
    background: rgba(14,165,233,0.12);
  }

  .sr-body {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .sr-main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
  }

  @media(min-width: 1024px) {
    .sr-main {
      padding: 36px 40px;
    }
  }

  .sr-container {
    max-width: 1220px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .sr-hero,
  .sr-card,
  .sr-status-card {
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

  .sr-hero {
    position: relative;
    overflow: hidden;
    border-radius: 28px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  @media(min-width: 760px) {
    .sr-hero {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  .sr-hero-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #8b5cf6, #6366f1, #38bdf8);
  }

  .sr-eyebrow,
  .sr-card-eyebrow {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${
      darkMode ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.42)"
    };
  }

  .sr-title {
    margin-top: 8px;
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 900;
    letter-spacing: -0.055em;
    line-height: 1.05;
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .sr-title span {
    background: linear-gradient(135deg, #8b5cf6, #38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .sr-subtitle {
    margin-top: 12px;
    max-width: 620px;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.7;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.56)"};
  }

  .sr-export-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-height: 46px;
    padding: 12px 24px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
    font-weight: 900;
    color: #fff;
    background: linear-gradient(135deg, #8b5cf6, #6366f1);
    box-shadow: 0 16px 34px rgba(139,92,246,0.28);
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .sr-export-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    opacity: 0.92;
  }

  .sr-export-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .sr-spinner,
  .sr-spinner-lg {
    border-radius: 999px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    animation: sr-spin 0.75s linear infinite;
  }

  .sr-spinner {
    width: 14px;
    height: 14px;
  }

  .sr-spinner-lg {
    width: 38px;
    height: 38px;
    border-width: 3px;
    border-top-color: #8b5cf6;
  }

  @keyframes sr-spin {
    to { transform: rotate(360deg); }
  }

  .sr-loading {
    min-height: 42vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 14px;
  }

  .sr-loading p {
    font-size: 13px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.5)"};
  }

  .sr-report {
    width: 100%;
    min-height: auto;
    overflow: visible;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 4px;
    background: ${darkMode ? "#080c14" : "#ffffff"};
  }

  .sr-report-header {
    border-radius: 24px;
    padding: 26px;
    background: ${
      darkMode
        ? "linear-gradient(135deg, #111827, #020617)"
        : "linear-gradient(135deg, #f8fafc, #ffffff)"
    };
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"
    };
  }

  .sr-report-header h2 {
    font-size: 30px;
    font-weight: 900;
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .sr-report-header p {
    margin-top: 8px;
    font-size: 13px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.5)" : "rgba(15,23,42,0.55)"};
  }

  .sr-status-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media(min-width: 1024px) {
    .sr-status-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .sr-status-card {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    padding: 22px;
    transition: all 0.2s ease;
  }

  .sr-status-card:hover {
    transform: translateY(-3px);
    border-color: rgba(139,92,246,0.25);
  }

  .sr-status-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
  }

  .sr-status-label {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.44)"};
    margin-bottom: 12px;
  }

  .sr-status-row {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .sr-status-row p {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: -0.04em;
  }

  .sr-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    animation: sr-pulse 2s ease-in-out infinite;
  }

  @keyframes sr-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.45; transform: scale(0.82); }
  }

  .sr-charts-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @media(min-width: 1024px) {
    .sr-charts-row {
      grid-template-columns: 2fr 1fr;
    }
  }

  .sr-card {
    border-radius: 24px;
    padding: 24px;
  }

  .sr-card-title {
    margin-top: 6px;
    font-size: 20px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.9)" : "#0f172a"};
  }

  .sr-card-sub {
    margin-top: 5px;
    margin-bottom: 16px;
    font-size: 12.5px;
    font-weight: 600;
    color: ${darkMode ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.5)"};
  }

  .sr-chart-area {
    height: 250px;
    width: 100%;
  }

  .sr-progress-list {
    display: flex;
    flex-direction: column;
    gap: 17px;
    margin-top: 18px;
  }

  .sr-prog-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .sr-prog-head span {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.48)"};
  }

  .sr-prog-head strong {
    font-size: 12px;
    font-weight: 900;
  }

  .sr-prog-track {
    height: 6px;
    width: 100%;
    border-radius: 999px;
    overflow: hidden;
    background: ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
  }

  .sr-prog-fill {
    height: 100%;
    border-radius: 999px;
  }

  .sr-ai-box {
    margin-top: 22px;
    padding: 16px;
    border-radius: 18px;
    background: rgba(139,92,246,0.1);
    border: 1px solid rgba(139,92,246,0.24);
  }

  .sr-ai-box p {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #a78bfa;
    margin-bottom: 7px;
  }

  .sr-ai-box span {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    line-height: 1.65;
    color: ${darkMode ? "rgba(255,255,255,0.5)" : "rgba(15,23,42,0.6)"};
  }

  .sr-log-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }

  .sr-log-count {
    padding: 5px 13px;
    border-radius: 999px;
    background: rgba(139,92,246,0.11);
    border: 1px solid rgba(139,92,246,0.24);
    color: #a78bfa;
    font-size: 11px;
    font-weight: 900;
  }

  .sr-log-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .sr-log-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 18px;
    background: ${darkMode ? "rgba(255,255,255,0.045)" : "rgba(15,23,42,0.035)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.06)"};
  }

  .sr-log-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sr-log-dot {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .sr-log-action {
    font-size: 13px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.78)" : "#0f172a"};
  }

  .sr-log-user {
    margin-top: 2px;
    font-size: 11px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.32)" : "rgba(15,23,42,0.45)"};
  }

  .sr-log-right {
    text-align: right;
    flex-shrink: 0;
  }

  .sr-log-right p {
    font-size: 12px;
    font-weight: 900;
  }

  .sr-log-right span {
    display: block;
    margin-top: 3px;
    font-size: 10.5px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.28)" : "rgba(15,23,42,0.42)"};
  }

  .sr-tooltip {
    border-radius: 14px;
    padding: 10px 14px;
    background: ${darkMode ? "rgba(8,12,20,0.96)" : "rgba(255,255,255,0.98)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)"};
    box-shadow: 0 18px 35px rgba(0,0,0,0.18);
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .sr-tooltip-label {
    font-size: 11px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
    margin-bottom: 4px;
  }

  .sr-tooltip-value {
    font-size: 12px;
    font-weight: 900;
    color: #a78bfa;
  }
`;

export default SystemReportsPage;