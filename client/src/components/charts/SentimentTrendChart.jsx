import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SentimentTrendChart = ({ moods = [] }) => {
  // Prepare data (last 10 entries)
  const data = [...moods]
    .reverse()
    .slice(-10)
    .map((mood) => {
      const date = new Date(mood.createdAt);
      return {
        time: `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`,
        score: mood.sentimentScore || 0,
        emotion: mood.predictedEmotion || "neutral",
      };
    });

  // Empty state
  if (!moods || moods.length === 0) {
    return (
      <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl shadow-sky-100/50 p-8 flex h-80 flex-col items-center justify-center text-slate-400">
        <span className="mb-4 text-6xl opacity-30">📈</span>
        <p className="text-sm font-medium">No mood data yet</p>
        <p className="text-xs text-slate-400 mt-1">Start logging your moods to see the trend</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl shadow-sky-100/50 p-6 lg:p-8">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
        Sentiment Trend
      </h2>

      <div className="h-85 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#e2e8f0" 
            />
            
            <XAxis 
              dataKey="time" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: "#64748b" }}
            />
            
            <YAxis 
              domain={[-1, 1]} 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: "#64748b" }}
            />
            
            <Tooltip 
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "none",
                borderRadius: "16px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                padding: "12px 16px",
              }}
              labelStyle={{ fontWeight: 600, color: "#0f766e" }}
            />
            
            {/* Beautiful gradient line */}
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="url(#colorGradient)" 
              strokeWidth={5} 
              dot={{ r: 4, fill: "#14b8a6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7, strokeWidth: 0, fill: "#0f766e" }}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.9} />
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