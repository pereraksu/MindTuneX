import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

// 🎯 Emotion → Color class mapping
const getMoodScale = (emotion) => {
  const map = {
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

  return map[emotion] || "color-empty";
};

const MoodCalendar = ({ moods = [] }) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 100);

  const values = moods.map((m) => ({
    date: new Date(m.createdAt).toISOString().split("T")[0],
    emotion: m.predictedEmotion,
  }));

  if (!moods.length) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white/40 text-center dark:border-slate-700 dark:bg-slate-900/30">
        <div>
          <div className="mb-3 text-3xl">📅</div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            No activity yet
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Your mood calendar will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none transition-all">
      
      {/* Header */}
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          Mood Activity
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Your emotional activity over the last 100 days
        </p>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={values}
          classForValue={(value) => {
            if (!value) return "color-empty";
            return getMoodScale(value.emotion);
          }}
          tooltipDataAttrs={(value) => {
            if (!value || !value.date) return null;
            return {
              "data-tip": `${value.date} • ${value.emotion}`,
            };
          }}
        />
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap justify-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        
        <LegendItem color="bg-yellow-400" label="Positive" />
        <LegendItem color="bg-sky-400" label="Calm" />
        <LegendItem color="bg-rose-500" label="Stress" />
        <LegendItem color="bg-indigo-500" label="Sad" />
        <LegendItem color="bg-orange-500" label="Anger" />
        <LegendItem color="bg-slate-300" label="Neutral" />

      </div>
    </div>
  );
};

// 🎯 Reusable Legend Item
const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <span className={`h-3 w-3 rounded-sm ${color}`} />
    <span>{label}</span>
  </div>
);

export default MoodCalendar;