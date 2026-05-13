import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/useTheme";

const COLORS = [
  "#14b8a6", "#0ea5e9", "#f59e0b", "#8b5cf6",
  "#ec4899", "#10b981", "#ef4444", "#6366f1",
  "#f97316", "#84cc16", "#06b6d4", "#a855f7",
];

const EmotionPieChart = ({ insight }) => {
  const { darkMode } = useTheme();

  const distribution =
    insight?.emotionDistribution || insight?.emotionCounts || {};

  const data = Object.keys(distribution)
    .map((key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: Number(distribution[key]) || 0,
    }))
    .filter((item) => item.value > 0);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!data.length || total === 0) {
    return (
      <>
        <style>{STYLES(darkMode)}</style>
        <div className="pie-empty">
          <div className="pie-empty-icon">🥧</div>
          <p className="pie-empty-title">No emotion data yet</p>
          <p className="pie-empty-sub">
            Log a few moods to view your emotional distribution.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="pie-card">
        <div className="pie-card-glow" />

        <div className="pie-header">
          <p className="pie-eyebrow">Emotion Distribution</p>
          <h2 className="pie-title">Emotional Pattern Overview</h2>
          <p className="pie-subtitle">
            Overview of emotional states in recent activity
          </p>
        </div>

        <div className="pie-chart-area">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={96}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    opacity={0.95}
                  />
                ))}
              </Pie>

              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={darkMode ? "rgba(255,255,255,0.92)" : "#0f172a"}
                fontSize="28"
                fontWeight="900"
              >
                {total}
              </text>

              <text
                x="50%"
                y="57%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.48)"}
                fontSize="10"
                fontWeight="900"
                letterSpacing="2"
              >
                ENTRIES
              </text>

              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode
                    ? "rgba(8,12,20,0.96)"
                    : "rgba(255,255,255,0.96)",
                  color: darkMode ? "#f8fafc" : "#0f172a",
                  border: darkMode
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid rgba(15,23,42,0.08)",
                  borderRadius: "14px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
                  padding: "10px 14px",
                  fontSize: 13,
                }}
                formatter={(value, name) => [`${value} entries`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="pie-legend">
          {data.map((item, i) => (
            <div key={item.name} className="pie-legend-item">
              <span
                className="pie-legend-dot"
                style={{
                  background: COLORS[i % COLORS.length],
                  boxShadow: `0 0 8px ${COLORS[i % COLORS.length]}88`,
                }}
              />
              <span className="pie-legend-name">{item.name}</span>
              <span className="pie-legend-value">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="pie-total-pill">
          <span className="pie-total-dot" />
          Total logged emotions: <strong>{total}</strong>
        </div>
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  .pie-card,
  .pie-empty {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: auto;
    min-height: 460px;
    border-radius: 24px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"};
    padding: 24px;
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    backdrop-filter: blur(22px);
    box-shadow: ${darkMode ? "0 22px 55px rgba(0,0,0,0.28)" : "0 22px 55px rgba(15,23,42,0.08)"};
    box-sizing: border-box;
  }

  .pie-card {
    display: flex;
    flex-direction: column;
  }

  .pie-card-glow {
    position: absolute;
    right: -90px;
    top: -90px;
    width: 240px;
    height: 240px;
    background: radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .pie-header {
    position: relative;
    z-index: 1;
  }

  .pie-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 6px;
  }

  .pie-title {
    font-size: 20px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.94)" : "#0f172a"};
    margin-bottom: 4px;
  }

  .pie-subtitle {
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
  }

  .pie-chart-area {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 260px;
    min-height: 260px;
    max-height: 260px;
    margin-top: 18px;
    flex: none;
  }

  .pie-legend {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 12px;
    margin-top: 12px;
  }

  @media(min-width: 520px) {
    .pie-legend {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .pie-legend-item {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  .pie-legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .pie-legend-name {
    font-size: 11.5px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.46)" : "rgba(15,23,42,0.56)"};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pie-legend-value {
    font-size: 11.5px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.78)" : "#0f172a"};
    margin-left: auto;
  }

  .pie-total-pill {
    position: relative;
    z-index: 1;
    width: fit-content;
    margin: 18px auto 0;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 16px;
    border-radius: 999px;
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    font-size: 12px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.44)" : "rgba(15,23,42,0.52)"};
  }

  .pie-total-pill strong {
    color: ${darkMode ? "rgba(255,255,255,0.82)" : "#0f172a"};
    font-weight: 900;
  }

  .pie-total-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: linear-gradient(135deg,#14b8a6,#0ea5e9);
    box-shadow: 0 0 10px rgba(20,184,166,0.65);
  }

  .pie-empty {
    min-height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .pie-empty-icon {
    font-size: 32px;
    margin-bottom: 14px;
  }

  .pie-empty-title {
    font-size: 15px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.7)" : "#0f172a"};
  }

  .pie-empty-sub {
    margin-top: 6px;
    font-size: 12.5px;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.48)"};
  }
`;

export default EmotionPieChart;