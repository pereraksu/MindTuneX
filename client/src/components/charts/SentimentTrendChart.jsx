import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const EMOTION_EMOJI = {
  joy: "😄",
  calm: "😌",
  stress: "😤",
  anxiety: "😰",
  sadness: "😢",
  anger: "😡",
  fatigue: "😴",
  love: "🥰",
  fear: "😨",
  disgust: "🤢",
  surprise: "😲",
  neutral: "😐",
};

const SentimentTrendChart = ({ moods = [] }) => {
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
        time: `${date.getHours()}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
        score,
        emotion: mood.predictedEmotion || "neutral",
      };
    });

  // 🚨 Empty state
  if (!moods || moods.length === 0) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-[2rem] border border-white/60 bg-white/75 p-8 text-center shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl dark:bg-slate-800">
          📈
        </div>
        <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
          No mood data yet
        </p>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
          Start logging moods to see your emotional trend
        </p>
      </div>
    );
  }

  return (
    <div className="h-full rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          Sentiment Trend
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Your emotional fluctuation over recent entries
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700"
              opacity={0.5}
            />

            {/* Zero baseline */}
            <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />

            {/* X Axis */}
            <XAxis
              dataKey="time"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="currentColor"
              className="text-slate-400 dark:text-slate-500"
            />

            {/* Y Axis */}
            <YAxis
              domain={[-1, 1]}
              ticks={[-1, 0, 1]}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="currentColor"
              className="text-slate-400 dark:text-slate-500"
            />

            {/* Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl bg-slate-900/90 px-4 py-3 text-sm text-white shadow-xl backdrop-blur">
                      <p className="font-semibold">
                        {EMOTION_EMOJI[item.emotion]} {item.emotion}
                      </p>
                      <p className="mt-1 text-slate-300">
                        Score: {item.score}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="score"
              stroke="url(#gradient)"
              strokeWidth={4}
              dot={{
                r: 4,
                fill: "#14b8a6",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: "#0f766e",
              }}
            />

            {/* Gradient */}
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={1} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.3} />
              </linearGradient>
            </defs>

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentTrendChart;