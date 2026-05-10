import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useTheme } from "../../context/useTheme";

const MOOD_SCALE = {
  joy: "color-joy",
  love: "color-joy",
  calm: "color-calm",
  surprise: "color-calm",
  neutral: "color-neutral",
  fatigue: "color-neutral",
  stress: "color-stress",
  anxiety: "color-stress",
  sadness: "color-sad",
  fear: "color-sad",
  anger: "color-anger",
  disgust: "color-anger",
};

const getMoodScale = (emotion) =>
  MOOD_SCALE[emotion?.toLowerCase()] || "color-empty";

const LEGEND = [
  { label: "Positive", hex: "#f59e0b" },
  { label: "Calm", hex: "#14b8a6" },
  { label: "Stress", hex: "#f43f5e" },
  { label: "Sad", hex: "#8b5cf6" },
  { label: "Anger", hex: "#f97316" },
  { label: "Neutral", hex: "#64748b" },
];

const MoodCalendar = ({ moods = [] }) => {
  const { darkMode } = useTheme();

  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 100);

  const values = moods.map((m) => ({
    date: new Date(m.createdAt).toISOString().split("T")[0],
    emotion: m.predictedEmotion,
  }));

  if (!moods.length) {
    return (
      <>
        <style>{STYLES(darkMode)}</style>

        <div className="mc-empty">
          <div className="mc-empty-icon">📅</div>
          <p className="mc-empty-title">No activity yet</p>
          <p className="mc-empty-sub">
            Your mood calendar will appear here once you start logging.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="mc-card">
        <div className="mc-glow" />

        <div className="mc-header">
          <div>
            <p className="mc-eyebrow">Mood Activity</p>
            <h2 className="mc-title">Mood Calendar</h2>
            <p className="mc-sub">
              Your emotional activity over the last 100 days
            </p>
          </div>

          <span className="mc-count-badge">
            {moods.length} Log{moods.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="mc-heatmap-wrap">
          <CalendarHeatmap
            startDate={startDate}
            endDate={today}
            values={values}
            classForValue={(value) => {
              if (!value) return "color-empty";
              return getMoodScale(value.emotion);
            }}
            tooltipDataAttrs={(value) => {
              if (!value || !value.date) return {};
              return {
                title: `${value.date} • ${value.emotion || "neutral"}`,
              };
            }}
          />
        </div>

        <div className="mc-legend">
          {LEGEND.map((l) => (
            <div key={l.label} className="mc-legend-item">
              <span
                className="mc-legend-dot"
                style={{
                  background: l.hex,
                  boxShadow: `0 0 8px ${l.hex}88`,
                }}
              />
              <span className="mc-legend-label">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  .mc-card,
  .mc-empty {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"};
    padding: 24px;
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    backdrop-filter: blur(22px);
    box-shadow: ${darkMode ? "0 22px 55px rgba(0,0,0,0.28)" : "0 22px 55px rgba(15,23,42,0.08)"};
  }

  .mc-glow {
    position: absolute;
    right: -90px;
    top: -90px;
    width: 240px;
    height: 240px;
    background: radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .mc-header {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 22px;
  }

  .mc-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 6px;
  }

  .mc-title {
    font-size: 20px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.94)" : "#0f172a"};
    margin-bottom: 4px;
  }

  .mc-sub {
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
  }

  .mc-count-badge {
    display: inline-flex;
    align-items: center;
    padding: 7px 15px;
    border-radius: 999px;
    background: rgba(20,184,166,0.12);
    border: 1px solid rgba(20,184,166,0.28);
    color: #14b8a6;
    font-size: 12px;
    font-weight: 800;
  }

  .mc-heatmap-wrap {
    position: relative;
    z-index: 1;
    overflow-x: auto;
    padding-bottom: 6px;
    scrollbar-width: thin;
    scrollbar-color: ${darkMode ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.16)"} transparent;
  }

  .mc-heatmap-wrap::-webkit-scrollbar {
    height: 5px;
  }

  .mc-heatmap-wrap::-webkit-scrollbar-thumb {
    background: ${darkMode ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.16)"};
    border-radius: 999px;
  }

  .react-calendar-heatmap text {
    font-size: 7px;
    fill: ${darkMode ? "rgba(255,255,255,0.26)" : "rgba(15,23,42,0.36)"} !important;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-weight: 700;
  }

  .react-calendar-heatmap .react-calendar-heatmap-small-text {
    font-size: 6px;
  }

  .react-calendar-heatmap rect {
    rx: 3;
    transition: all 1min ease;
  }

  .react-calendar-heatmap rect:hover {
    stroke: ${darkMode ? "rgba(255,255,255,0.55)" : "rgba(15,23,42,0.45)"} !important;
    stroke-width: 1.2px;
  }

  .react-calendar-heatmap .color-empty {
    fill: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.06)"};
  }

  .react-calendar-heatmap .color-joy {
    fill: #f59e0b;
    opacity: 0.9;
  }

  .react-calendar-heatmap .color-calm {
    fill: #14b8a6;
    opacity: 0.9;
  }

  .react-calendar-heatmap .color-stress {
    fill: #f43f5e;
    opacity: 0.9;
  }

  .react-calendar-heatmap .color-sad {
    fill: #8b5cf6;
    opacity: 0.9;
  }

  .react-calendar-heatmap .color-anger {
    fill: #f97316;
    opacity: 0.9;
  }

  .react-calendar-heatmap .color-neutral {
    fill: #64748b;
    opacity: 0.9;
  }

  .mc-legend {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 11px 18px;
    margin-top: 20px;
  }

  .mc-legend-item {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .mc-legend-dot {
    width: 9px;
    height: 9px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .mc-legend-label {
    font-size: 11.5px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
    letter-spacing: 0.04em;
  }

  .mc-empty {
    min-height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .mc-empty-icon {
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

  .mc-empty-title {
    font-size: 15px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.72)" : "#0f172a"};
    margin-bottom: 6px;
  }

  .mc-empty-sub {
    font-size: 12.5px;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.48)"};
    line-height: 1.6;
    max-width: 260px;
  }
`;

export default MoodCalendar;