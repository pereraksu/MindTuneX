import React from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { useTheme } from "../../context/useTheme";

const EMOTION_EMOJI = {
  joy: "😄", calm: "😌", stress: "😤", anxiety: "😰",
  sadness: "😢", anger: "😡", fatigue: "😴", love: "🥰",
  fear: "😨", disgust: "🤢", surprise: "😲", neutral: "😐",
};

const EMOTION_COLOR = {
  joy: "#f59e0b", calm: "#14b8a6", stress: "#f43f5e", anxiety: "#f97316",
  sadness: "#8b5cf6", anger: "#ef4444", fatigue: "#64748b", love: "#ec4899",
  fear: "#818cf8", disgust: "#4ade80", surprise: "#06b6d4", neutral: "#64748b",
};

const EmotionDot = ({ cx, cy, payload, darkMode }) => {
  if (cx == null || cy == null) return null;

  const color = EMOTION_COLOR[payload?.emotion] || "#14b8a6";

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={color}
        stroke={darkMode ? "rgba(8,12,20,0.95)" : "#ffffff"}
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={10} fill={color} fillOpacity={0.14} />
    </g>
  );
};

const ActiveEmotionDot = ({ cx, cy, payload, darkMode }) => {
  if (cx == null || cy == null) return null;

  const color = EMOTION_COLOR[payload?.emotion] || "#14b8a6";

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={color}
        stroke={darkMode ? "rgba(8,12,20,0.95)" : "#ffffff"}
        strokeWidth={2.5}
      />
      <circle cx={cx} cy={cy} r={13} fill={color} fillOpacity={0.2} />
      <circle cx={cx} cy={cy} r={20} fill={color} fillOpacity={0.08} />
    </g>
  );
};

const CustomTooltip = ({ active, payload, darkMode }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;
  const color = EMOTION_COLOR[item.emotion] || "#14b8a6";

  return (
    <div
      style={{
        background: darkMode ? "rgba(8,12,20,0.96)" : "rgba(255,255,255,0.96)",
        border: darkMode
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid rgba(15,23,42,0.08)",
        borderRadius: 14,
        padding: "10px 14px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        boxShadow: darkMode
          ? "0 20px 40px rgba(0,0,0,0.5)"
          : "0 20px 40px rgba(15,23,42,0.14)",
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 800, color, marginBottom: 4 }}>
        {EMOTION_EMOJI[item.emotion]} {item.emotion}
      </p>

      <p
        style={{
          fontSize: 12,
          color: darkMode ? "rgba(255,255,255,0.48)" : "rgba(15,23,42,0.55)",
        }}
      >
        Score:{" "}
        <span
          style={{
            color: darkMode ? "rgba(255,255,255,0.82)" : "#0f172a",
            fontWeight: 800,
          }}
        >
          {item.score}
        </span>
      </p>

      <p
        style={{
          fontSize: 11,
          color: darkMode ? "rgba(255,255,255,0.32)" : "rgba(15,23,42,0.42)",
          marginTop: 2,
        }}
      >
        {item.time}
      </p>
    </div>
  );
};

const SentimentTrendChart = ({ moods = [] }) => {
  const { darkMode } = useTheme();

  const data = [...moods]
    .reverse()
    .slice(-10)
    .map((mood) => {
      const date = new Date(mood.createdAt);

      const score =
        mood.sentimentScore !== undefined
          ? mood.sentimentScore
          : mood.sentimentLabel === "positive"
          ? 1
          : mood.sentimentLabel === "negative"
          ? -1
          : 0;

      return {
        time: `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`,
        score,
        emotion: mood.predictedEmotion || "neutral",
      };
    });

  if (!moods || moods.length === 0) {
    return (
      <>
        <style>{STYLES(darkMode)}</style>

        <div className="stc-empty">
          <div className="stc-empty-icon">📈</div>
          <p className="stc-empty-title">No mood data yet</p>
          <p className="stc-empty-sub">
            Start logging moods to see your emotional trend.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="stc-card">
        <div className="stc-glow" />

        <div className="stc-header">
          <p className="stc-eyebrow">Sentiment Trend</p>
          <h2 className="stc-title">Emotional Fluctuation</h2>
          <p className="stc-sub">
            Your emotional fluctuation over recent entries
          </p>
        </div>

        <div className="stc-chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 16, right: 12, left: -20, bottom: 8 }}
            >
              <defs>
                <linearGradient id="stc-pos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="stc-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="50%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke={
                  darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.08)"
                }
              />

              <ReferenceLine
                y={0}
                stroke={
                  darkMode ? "rgba(255,255,255,0.14)" : "rgba(15,23,42,0.16)"
                }
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="time"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.46)",
                  fontFamily: "'DM Sans',system-ui,sans-serif",
                  fontWeight: 700,
                }}
              />

              <YAxis
                domain={[-1, 1]}
                ticks={[-1, 0, 1]}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: darkMode ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.42)",
                  fontFamily: "'DM Sans',system-ui,sans-serif",
                  fontWeight: 700,
                }}
                tickFormatter={(v) => (v === 1 ? "+1" : v === -1 ? "−1" : "0")}
              />

              <Tooltip
                content={<CustomTooltip darkMode={darkMode} />}
                cursor={{
                  stroke: darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.12)",
                  strokeWidth: 1,
                }}
              />

              <Area
                type="monotone"
                dataKey="score"
                stroke="none"
                fill="url(#stc-pos)"
                fillOpacity={1}
              />

              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#stc-line)"
                strokeWidth={2.8}
                dot={<EmotionDot darkMode={darkMode} />}
                activeDot={<ActiveEmotionDot darkMode={darkMode} />}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  .stc-card,
  .stc-empty {
    position: relative;
    overflow: hidden;
    height: 100%;
    min-height: 340px;
    border-radius: 24px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"};
    padding: 24px;
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    backdrop-filter: blur(22px);
    box-shadow: ${darkMode ? "0 22px 55px rgba(0,0,0,0.28)" : "0 22px 55px rgba(15,23,42,0.08)"};
    box-sizing: border-box;
  }

  .stc-card {
    display: flex;
    flex-direction: column;
  }

  .stc-glow {
    position: absolute;
    right: -90px;
    top: -90px;
    width: 240px;
    height: 240px;
    background: radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .stc-header {
    position: relative;
    z-index: 1;
    margin-bottom: 12px;
  }

  .stc-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 6px;
  }

  .stc-title {
    font-size: 20px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.94)" : "#0f172a"};
    margin-bottom: 4px;
  }

  .stc-sub {
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
  }

  .stc-chart-area {
    position: relative;
    z-index: 1;
    flex: 1;
    min-height: 250px;
  }

  .stc-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .stc-empty-icon {
    width: 58px;
    height: 58px;
    border-radius: 18px;
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.055)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin-bottom: 14px;
  }

  .stc-empty-title {
    font-size: 15px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.72)" : "#0f172a"};
    margin-bottom: 6px;
  }

  .stc-empty-sub {
    font-size: 12.5px;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.48)"};
    line-height: 1.6;
  }
`;

export default SentimentTrendChart;