import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#14b8a6", // teal
  "#0ea5e9", // sky
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#10b981", // emerald
  "#ef4444", // red
  "#6366f1", // indigo
  "#f97316", // orange
  "#84cc16", // lime
  "#06b6d4", // cyan
  "#a855f7", // purple
];

const EmotionPieChart = ({ insight }) => {
  const distribution = insight?.emotionDistribution || insight?.emotionCounts || {};

  const data = Object.keys(distribution).map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: distribution[key],
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-[2rem] border border-white/60 bg-white/75 p-8 text-center shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none transition-colors">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl dark:bg-slate-800">
          🥧
        </div>
        <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
          No emotion data yet
        </p>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
          Log a few moods to view your emotional distribution.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none transition-colors">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          Emotion Distribution
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Overview of the emotional states recorded in your recent activity
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="47%"
              innerRadius={68}
              outerRadius={108}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.92)",
                color: "#f8fafc",
                border: "1px solid rgba(148, 163, 184, 0.15)",
                borderRadius: "16px",
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.35)",
                padding: "12px 14px",
                backdropFilter: "blur(10px)",
              }}
              labelStyle={{
                color: "#e2e8f0",
                fontWeight: 600,
                marginBottom: "4px",
              }}
              itemStyle={{
                color: "#7dd3fc",
                fontSize: "13px",
              }}
              formatter={(value, name) => [`${value} entries`, name]}
            />

            <Legend
              verticalAlign="bottom"
              height={60}
              iconType="circle"
              wrapperStyle={{
                fontSize: "13px",
                paddingTop: "12px",
              }}
              formatter={(value) => (
                <span className="text-slate-500 dark:text-slate-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-center">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Total logged emotions: <span className="font-bold">{total}</span>
        </div>
      </div>
    </div>
  );
};

export default EmotionPieChart;