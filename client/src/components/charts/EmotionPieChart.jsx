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

const CenterLabel = ({ cx, cy, total, darkMode }) => (
  <>
    <text
      x={cx}
      y={cy - 10}
      textAnchor="middle"
      fill={darkMode ? "rgba(255,255,255,0.9)" : "#0f172a"}
      fontSize={28}
      fontWeight={800}
      fontFamily="'DM Sans', system-ui, sans-serif"
    >
      {total}
    </text>

    <text
      x={cx}
      y={cy + 16}
      textAnchor="middle"
      fill={darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.46)"}
      fontSize={10}
      fontWeight={800}
      fontFamily="'DM Sans', system-ui, sans-serif"
      letterSpacing="0.18em"
    >
      ENTRIES
    </text>
  </>
);

const CustomLegend = ({ data }) => (
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
);

const EmotionPieChart = ({ insight }) => {
  const { darkMode } = useTheme();

  const distribution =
    insight?.emotionDistribution || insight?.emotionCounts || {};

  const data = Object.keys(distribution).map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: Number(distribution[key]) || 0,
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0 || total === 0) {
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
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="52%"
                outerRadius="76%"
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    opacity={0.92}
                  />
                ))}
              </Pie>

              <Pie
                data={[{ value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={0}
                dataKey="value"
                labelLine={false}
                label={({ cx, cy }) => (
                  <CenterLabel cx={cx} cy={cy} total={total} darkMode={darkMode} />
                )}
                stroke="none"
              >
                <Cell fill="transparent" />
              </Pie>

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
                  boxShadow: darkMode
                    ? "0 20px 40px rgba(0,0,0,0.5)"
                    : "0 20px 40px rgba(15,23,42,0.12)",
                  padding: "10px 14px",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 13,
                }}
                itemStyle={{
                  color: "#14b8a6",
                  fontSize: 12,
                  fontWeight: 700,
                }}
                formatter={(value, name) => [`${value} entries`, name]}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <CustomLegend data={data} />

        <div className="pie-total-wrap">
          <div className="pie-total-pill">
            <span className="pie-total-dot" />
            Total logged emotions: <strong>{total}</strong>
          </div>
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
    height: 100%;
    min-height: 360px;
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
    margin-bottom: 10px;
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
    flex: 1;
    min-height: 230px;
  }

  .pie-legend {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 12px;
    margin-top: 16px;
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
    text-transform: capitalize;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pie-legend-value {
    font-size: 11.5px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.72)" : "#0f172a"};
    margin-left: auto;
    flex-shrink: 0;
  }

  .pie-total-wrap {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
  }

  .pie-total-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 16px auto 0;
    padding: 7px 16px;
    border-radius: 999px;
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    font-size: 12px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.44)" : "rgba(15,23,42,0.52)"};
  }

  .pie-total-pill strong {
    color: ${darkMode ? "rgba(255,255,255,0.78)" : "#0f172a"};
    font-weight: 900;
  }

  .pie-total-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: linear-gradient(135deg,#14b8a6,#0ea5e9);
    flex-shrink: 0;
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
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.055)"};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin-bottom: 16px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
  }

  .pie-empty-title {
    font-size: 15px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.7)" : "#0f172a"};
    margin-bottom: 6px;
  }

  .pie-empty-sub {
    font-size: 12.5px;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.48)"};
    line-height: 1.6;
  }
`;

export default EmotionPieChart;