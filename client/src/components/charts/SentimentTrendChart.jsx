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
        // 🚨 සමහර වෙලාවට AI එකෙන් sentimentScore එක එන්නේ නැහැ. ඒ නිසා අපි Label එකෙන් Score එකක් හදමු.
        score: mood.sentimentScore !== undefined ? mood.sentimentScore : 
               (mood.sentimentLabel === 'positive' ? 1 : mood.sentimentLabel === 'negative' ? -1 : 0),
        emotion: mood.predictedEmotion || "neutral",
      };
    });

  // Empty state
  if (!moods || moods.length === 0) {
    return (
      // 🚨 Dark Mode Background එකතු කළා
      <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none p-8 flex h-80 flex-col items-center justify-center text-slate-400 transition-colors">
        <span className="mb-4 text-6xl opacity-30">📈</span>
        <p className="text-sm font-medium dark:text-slate-300">No mood data yet</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Start logging your moods to see the trend</p>
      </div>
    );
  }

  return (
    // 🚨 Dark Mode Background එකතු කළා
    <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none p-6 lg:p-8 transition-colors">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Sentiment Trend
      </h2>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            
            {/* 🚨 Grid එකේ පාට CurrentColor වලට මාරු කළා Dark Mode Support එකට */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="currentColor" 
              className="text-slate-200 dark:text-slate-700"
              opacity={0.5}
            />
            
            {/* 🚨 X Axis අකුරු වල පාට හැදුවා */}
            <XAxis 
              dataKey="time" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              stroke="currentColor"
              className="text-slate-400 dark:text-slate-500"
            />
            
            {/* 🚨 Y Axis අකුරු වල පාට හැදුවා */}
            <YAxis 
              domain={[-1, 1]} 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              stroke="currentColor"
              className="text-slate-400 dark:text-slate-500"
            />
            
            {/* 🚨 Tooltip එක Dark Theme එකට ගැලපෙන්න හැදුවා */}
            <Tooltip 
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)", // Dark Slate
                border: "none",
                borderRadius: "16px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.5)",
                padding: "12px 16px",
                backdropFilter: "blur(8px)",
                color: "#f8fafc" // White text
              }}
              itemStyle={{ color: "#38bdf8" }} // Sky blue
              labelStyle={{ fontWeight: 600, color: "#94a3b8", marginBottom: "4px" }}
            />
            
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="url(#colorGradient)" 
              strokeWidth={5} 
              dot={{ r: 4, fill: "#14b8a6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7, strokeWidth: 0, fill: "#0f766e" }}
            />

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