import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";
import { getMyMoodsApi } from "../api/moodApi";
import {
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

const CHART_COLORS = {
  joy: "#f59e0b", calm: "#14b8a6", stress: "#f43f5e", anxiety: "#f97316",
  sadness: "#8b5cf6", anger: "#ef4444", fatigue: "#64748b", love: "#ec4899",
  fear: "#818cf8", neutral: "#64748b", surprise: "#06b6d4", disgust: "#4ade80",
};

const SENTIMENT_COLOR = {
  Positive: "#34d399",
  Negative: "#fb7185",
  Neutral: "#94a3b8",
};

const ReportsPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode } = useTheme();

  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pieData, setPieData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [avgSentiment, setAvgSentiment] = useState("Neutral");
  const [streak, setStreak] = useState(0);

  const reportRef = useRef(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await getMyMoodsApi();

      const fetched = Array.isArray(response)
        ? response
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
        ? response.data
        : [];

      const sorted = [...fetched].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      setMoods(sorted);

      const emotionCounts = {};
      let totalScore = 0;

      sorted.forEach((m) => {
        const emo = m.predictedEmotion?.toLowerCase() || "neutral";
        emotionCounts[emo] = (emotionCounts[emo] || 0) + 1;

        const sent = m.sentimentLabel?.toLowerCase();
        if (sent === "positive") totalScore += 1;
        if (sent === "negative") totalScore -= 1;
      });

      setPieData(
        Object.entries(emotionCounts).map(([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value,
          color: CHART_COLORS[key] || "#94a3b8",
        }))
      );

      const avg = sorted.length ? totalScore / sorted.length : 0;
      setAvgSentiment(avg > 0.3 ? "Positive" : avg < -0.3 ? "Negative" : "Neutral");

      const trendMap = {};
      sorted.forEach((m) => {
        if (!m.createdAt) return;

        const date = new Date(m.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        const sent = m.sentimentLabel?.toLowerCase();
        const score = sent === "positive" ? 1 : sent === "negative" ? -1 : 0;

        if (!trendMap[date]) trendMap[date] = { date, totalScore: score, count: 1 };
        else {
          trendMap[date].totalScore += score;
          trendMap[date].count += 1;
        }
      });

      setTrendData(
        Object.values(trendMap).map((i) => ({
          date: i.date,
          score: Number((i.totalScore / i.count).toFixed(2)),
        }))
      );

      setStreak(calculateStreak(sorted));
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (items) => {
    const days = [
      ...new Set(
        items
          .filter((m) => m.createdAt)
          .map((m) => new Date(m.createdAt).toISOString().split("T")[0])
      ),
    ].sort((a, b) => new Date(b) - new Date(a));

    let streakCount = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);

    for (const day of days) {
      const compare = current.toISOString().split("T")[0];
      if (day === compare) {
        streakCount++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    return streakCount;
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      setIsDownloading(true);

      const dataUrl = await toPng(reportRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: darkMode ? "#080c14" : "#ffffff",
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const dateStr = new Date().toLocaleDateString();

      pdf.setFontSize(22);
      pdf.setTextColor(20, 184, 166);
      pdf.text("MindTuneX Wellness Report", 15, 20);

      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`User: ${user?.fullName || "User"} | Date: ${dateStr}`, 15, 28);

      const pdfWidth = pdf.internal.pageSize.getWidth() - 30;
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 15, 40, pdfWidth, pdfHeight);
      pdf.setFontSize(9);
      pdf.text("Generated by MindTuneX AI", 105, 285, { align: "center" });
      pdf.save(`MindTuneX_Report_${user?.fullName?.replaceAll(" ", "_") || "User"}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
      alert("Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="rp-root">
        <div className="rp-glow rp-glow-1" />
        <div className="rp-glow rp-glow-2" />

        <Sidebar />

        <div className="rp-body">
          <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

          <main className="rp-main">
            <div className="rp-container">
              <div className="rp-header">
                <div>
                  <p className="rp-eyebrow">Emotional Intelligence</p>
                  <h1 className="rp-title">
                    Wellness <span>Reports</span>
                  </h1>
                  <p className="rp-subtitle">
                    Track your emotional patterns and export a clean PDF summary.
                  </p>
                </div>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading || loading || moods.length === 0}
                  className="rp-download-btn"
                >
                  {isDownloading ? (
                    <>
                      <span className="rp-spinner" />
                      Preparing PDF…
                    </>
                  ) : (
                    <>Download PDF Report</>
                  )}
                </button>
              </div>

              {loading ? (
                <div className="rp-loading">
                  <div className="rp-spinner-lg" />
                  <p>Loading your analytics…</p>
                </div>
              ) : moods.length === 0 ? (
                <div className="rp-empty">
                  <div className="rp-empty-icon">📊</div>
                  <h3>No report data yet</h3>
                  <p>Log moods or journal entries to generate analytics reports.</p>
                </div>
              ) : (
                <div ref={reportRef} className="rp-report">
                  <div className="rp-stats-grid">
                    <StatCard label="Total Logs" value={moods.length} color="#2dd4bf" />
                    <StatCard label="Overall Sentiment" value={avgSentiment} color={SENTIMENT_COLOR[avgSentiment]} />
                    <StatCard label="Active Streak" value={`${streak} Days`} color="#a78bfa" />
                  </div>

                  <div className="rp-charts-grid">
                    <ChartCard title="Sentiment Trend" subtitle="Daily emotional polarity over time">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="sentimentFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.24} />
                              <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.16)" vertical={false} />
                          <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: darkMode ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.55)" }} />
                          <YAxis domain={[-1, 1]} hide />
                          <Tooltip content={<ReportTooltip darkMode={darkMode} />} />
                          <Area type="monotone" dataKey="score" stroke="#14b8a6" strokeWidth={2.5} fill="url(#sentimentFill)" dot={{ r: 4, fill: "#14b8a6" }} isAnimationActive={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Emotion Breakdown" subtitle="Distribution of recorded emotions">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius="52%" outerRadius="74%" paddingAngle={3} dataKey="value" stroke="none" isAnimationActive={false}>
                            {pieData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} opacity={0.9} />
                            ))}
                          </Pie>
                          <Tooltip content={<ReportTooltip darkMode={darkMode} />} />
                        </PieChart>
                      </ResponsiveContainer>

                      <div className="rp-legend">
                        {pieData.slice(0, 6).map((d) => (
                          <div key={d.name} className="rp-legend-item">
                            <span style={{ background: d.color }} />
                            <p>{d.name}</p>
                            <strong style={{ color: d.color }}>{d.value}</strong>
                          </div>
                        ))}
                      </div>
                    </ChartCard>
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

const StatCard = ({ label, value, color }) => (
  <div className="rp-stat-card">
    <div className="rp-stat-line" style={{ background: color }} />
    <p className="rp-stat-label">{label}</p>
    <h2 style={{ color }}>{value}</h2>
  </div>
);

const ChartCard = ({ title, subtitle, children }) => (
  <div className="rp-chart-card">
    <p className="rp-chart-title">{title}</p>
    <p className="rp-chart-sub">{subtitle}</p>
    <div className="rp-chart-area">{children}</div>
  </div>
);

const ReportTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: darkMode ? "rgba(8,12,20,0.96)" : "rgba(255,255,255,0.96)",
        border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.1)",
        borderRadius: 14,
        padding: "10px 14px",
        boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
      }}
    >
      {label && <p style={{ fontSize: 11, opacity: 0.6 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#14b8a6", fontWeight: 800, fontSize: 12 }}>
          {p.name ? `${p.name}: ` : ""}{p.value}
        </p>
      ))}
    </div>
  );
};

const STYLES = (darkMode) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

  .rp-root {
    display: flex;
    min-height: 100svh;
    position: relative;
    overflow-x: hidden;
    font-family: 'DM Sans', system-ui, sans-serif;
    background: ${
      darkMode
        ? "radial-gradient(circle at top left, rgba(20,184,166,0.12), transparent 35%), #080c14"
        : "linear-gradient(135deg, #ecfeff 0%, #f8fafc 48%, #eef2ff 100%)"
    };
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .rp-glow {
    position: fixed;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;
    z-index: 0;
  }

  .rp-glow-1 {
    top: -120px;
    left: -100px;
    width: 460px;
    height: 460px;
    background: rgba(20,184,166,0.14);
  }

  .rp-glow-2 {
    bottom: -120px;
    right: -100px;
    width: 430px;
    height: 430px;
    background: rgba(14,165,233,0.12);
  }

  .rp-body {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .rp-main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
  }

  @media(min-width:1024px) {
    .rp-main { padding: 36px 40px; }
  }

  .rp-container {
    max-width: 1080px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .rp-header {
    display: flex;
    flex-direction: column;
    gap: 18px;
    border-radius: 28px;
    padding: 28px 30px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.82)"};
    backdrop-filter: blur(24px);
    box-shadow: ${darkMode ? "0 24px 60px rgba(0,0,0,0.28)" : "0 24px 60px rgba(15,23,42,0.09)"};
  }

  @media(min-width:720px) {
    .rp-header {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  .rp-eyebrow {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #14b8a6;
    margin-bottom: 8px;
  }

  .rp-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 900;
    letter-spacing: -0.055em;
    line-height: 1.05;
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .rp-title span {
    background: linear-gradient(135deg,#14b8a6,#38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .rp-subtitle {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 600;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.55)"};
  }

  .rp-download-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 13px 22px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 900;
    color: #fff;
    background: linear-gradient(135deg,#14b8a6,#0ea5e9);
    box-shadow: 0 16px 34px rgba(20,184,166,0.28);
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .rp-download-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 20px 44px rgba(20,184,166,0.36);
  }

  .rp-download-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }

  .rp-spinner,
  .rp-spinner-lg {
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    animation: rp-spin 0.7s linear infinite;
  }

  .rp-spinner {
    width: 14px;
    height: 14px;
  }

  .rp-spinner-lg {
    width: 38px;
    height: 38px;
    border-width: 3px;
    border-color: ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.1)"};
    border-top-color: #14b8a6;
  }

  @keyframes rp-spin {
    to { transform: rotate(360deg); }
  }

  .rp-loading,
  .rp-empty {
    min-height: 42vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    text-align: center;
    border-radius: 28px;
    border: 1px dashed ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.12)"};
    background: ${darkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.62)"};
  }

  .rp-loading p,
  .rp-empty p {
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.55)"};
    font-weight: 700;
  }

  .rp-empty-icon {
    font-size: 34px;
  }

  .rp-empty h3 {
    font-size: 18px;
    font-weight: 900;
  }

  .rp-report {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .rp-stats-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @media(min-width:720px) {
    .rp-stats-grid { grid-template-columns: repeat(3,1fr); }
  }

  .rp-stat-card,
  .rp-chart-card {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.78)"};
    backdrop-filter: blur(22px);
    box-shadow: ${darkMode ? "0 20px 50px rgba(0,0,0,0.22)" : "0 20px 50px rgba(15,23,42,0.08)"};
  }

  .rp-stat-card {
    padding: 22px 24px;
  }

  .rp-stat-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
  }

  .rp-stat-label {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 12px;
  }

  .rp-stat-card h2 {
    font-size: 34px;
    font-weight: 900;
    letter-spacing: -0.045em;
    line-height: 1;
  }

  .rp-charts-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media(min-width:1024px) {
    .rp-charts-grid { grid-template-columns: 1fr 1fr; }
  }

  .rp-chart-card {
    padding: 24px;
  }

  .rp-chart-title {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 5px;
  }

  .rp-chart-sub {
    font-size: 13px;
    font-weight: 600;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.52)"};
    margin-bottom: 16px;
  }

  .rp-chart-area {
    height: 250px;
  }

  .rp-legend {
    margin-top: 14px;
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 8px 10px;
  }

  .rp-legend-item {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  .rp-legend-item span {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .rp-legend-item p {
    flex: 1;
    min-width: 0;
    font-size: 11px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.58)"};
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .rp-legend-item strong {
    font-size: 11px;
    font-weight: 900;
  }
`;

export default ReportsPage;