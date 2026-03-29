import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = [
  "#14b8a6", // teal
  "#0ea5e9", // sky
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#10b981", // emerald
  "#ef4444", // red
];

const EmotionPieChart = ({ insight }) => {
  const distribution = insight?.emotionDistribution || insight?.emotionCounts || {};

  const data = Object.keys(distribution).map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: distribution[key],
  }));

  // Empty state
  if (data.length === 0) {
    return (
      <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl shadow-sky-100/50 p-8 flex h-80 flex-col items-center justify-center text-slate-400">
        <span className="mb-4 text-6xl opacity-30">🥧</span>
        <p className="text-sm font-medium">No emotion data yet</p>
        <p className="mt-1 text-xs text-slate-400">Log a few moods to see the distribution</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl shadow-sky-100/50 p-6 lg:p-8">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
        Emotion Distribution
      </h2>

      <div className="h-85 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={110}
              paddingAngle={4}
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
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "none",
                borderRadius: "16px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                padding: "12px 16px",
              }}
            />

            <Legend
              verticalAlign="bottom"
              height={50}
              iconType="circle"
              wrapperStyle={{
                fontSize: "13px",
                paddingTop: "15px",
                color: "#475569",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmotionPieChart;