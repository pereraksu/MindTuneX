import React from "react";

const EMOTION_EMOJI = {
  joy: "😄", calm: "😌", stress: "😤", anxiety: "😰",
  sadness: "😢", anger: "😡", fatigue: "😴", love: "🥰",
  fear: "😨", disgust: "🤢", surprise: "😲", neutral: "😐",
};

// Dark mode colors added
const EMOTION_COLORS = {
  stress:  "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50",
  anxiety: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50",
  calm:    "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800/50",
  joy:     "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50",
  fatigue: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  sadness: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800/50",
  anger:   "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800/50",
  love:    "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800/50",
  fear:    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50",
  neutral: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50",
  surprise:"bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800/50",
  disgust: "bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-900/30 dark:text-lime-400 dark:border-lime-800/50",
};

const SENTIMENT_COLORS = {
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-rose-600 dark:text-rose-400",
  neutral:  "text-slate-500 dark:text-slate-400",
};

const WeeklyInsightCard = ({ insight }) => {
  return (
    // Background updated for Dark Mode
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 p-6 lg:p-8 transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white transition-colors">
            Weekly <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-600 dark:from-teal-400 dark:to-sky-400">Insights</span>
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400 transition-colors">
            Your emotional landscape for the past 7 days
          </p>
        </div>

        {!insight ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl py-20 text-center shadow-xl dark:shadow-none transition-colors">
            <span className="mb-4 text-6xl opacity-80">📊</span>
            <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200">Not enough data yet</h3>
            <p className="mt-2 max-w-xs text-slate-400 dark:text-slate-500">
              Keep logging your moods daily to unlock beautiful weekly insights and trends.
            </p>
          </div>
        ) : (
          /* Main Content - Glass Style */
          <div className="space-y-8">
            
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Total Entries */}
              <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none p-6 transition-colors">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">Total Entries</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-5xl font-light text-slate-800 dark:text-white transition-colors">{insight.totalEntries}</span>
                  <span className="text-slate-400 dark:text-slate-500">this week</span>
                </div>
              </div>

              {/* Avg Sentiment */}
              <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none p-6 transition-colors">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">Average Sentiment</p>
                <p className={`mt-3 text-4xl font-light capitalize ${SENTIMENT_COLORS[insight.avgSentiment?.toLowerCase()] || "text-slate-700 dark:text-slate-300"}`}>
                  {insight.avgSentiment || "Neutral"}
                </p>
              </div>

              {/* Top Emotion */}
              <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none p-6 transition-colors">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">Top Emotion</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-5xl">
                    {EMOTION_EMOJI[insight.topEmotion?.toLowerCase()] || "😐"}
                  </span>
                  <span className="text-3xl font-light capitalize text-slate-800 dark:text-white transition-colors">
                    {insight.topEmotion || "None"}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Summary Box */}
            {insight.summaryText && (
              <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-2xl shadow-sky-100/50 dark:shadow-none p-8 relative transition-colors">
                <div className="absolute -left-1 -top-1 text-7xl opacity-10 dark:opacity-5 text-slate-800 dark:text-white">❞</div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                  <span className="text-xl">✦</span> AI Insight Summary
                </h3>
                <p className="text-[0.98rem] leading-relaxed text-slate-700 dark:text-slate-300 transition-colors">
                  {insight.summaryText}
                </p>
              </div>
            )}

            {/* Emotion Breakdown */}
            <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none p-8 transition-colors">
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Emotion Breakdown
              </h3>
              
              <div className="flex flex-wrap gap-3">
                {Object.entries(insight.emotionCounts || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([key, count]) => {
                    const emoKey = key.toLowerCase();
                    const emoji = EMOTION_EMOJI[emoKey] || "😐";
                    const emoClass = EMOTION_COLORS[emoKey] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-2 rounded-3xl border px-4 py-2 shadow-sm transition hover:-translate-y-0.5 ${emoClass}`}
                      >
                        <span className="text-xl">{emoji}</span>
                        <span className="font-medium capitalize">{key}</span>
                        <span className="ml-auto rounded-3xl bg-white dark:bg-slate-700 px-3 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors">
                          {count}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyInsightCard;