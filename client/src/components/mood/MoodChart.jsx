const EMOTION_STYLES = {
  joy: "from-yellow-400 to-amber-500",
  calm: "from-sky-400 to-cyan-500",
  stress: "from-red-400 to-rose-500",
  anxiety: "from-orange-400 to-amber-500",
  sadness: "from-violet-400 to-purple-500",
  anger: "from-pink-500 to-rose-500",
  fatigue: "from-slate-400 to-slate-600",
  love: "from-rose-400 to-pink-500",
  fear: "from-purple-500 to-indigo-500",
  disgust: "from-lime-400 to-green-500",
  surprise: "from-teal-400 to-cyan-500",
  neutral: "from-emerald-400 to-green-500",
};

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

const MoodChart = ({ insight }) => {
  const emotionCounts = insight?.emotionCounts || insight?.emotionDistribution || {};
  const entries = Object.entries(emotionCounts);
  const maxValue = entries.length
    ? Math.max(...entries.map(([, value]) => value))
    : 1;

  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          Emotion Analytics
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
          Emotion Summary
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Overview of how often each emotional state appears in your records.
        </p>
      </div>

      {!entries.length ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl dark:bg-slate-800">
            📊
          </div>
          <p className="mt-4 text-base font-semibold text-slate-700 dark:text-slate-300">
            No chart data available
          </p>
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
            Log more moods to generate your emotion summary.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {entries.map(([emotion, value]) => {
            const gradient = EMOTION_STYLES[emotion] || "from-sky-400 to-cyan-500";
            const emoji = EMOTION_EMOJI[emotion] || "😐";
            const width = `${(value / maxValue) * 100}%`;

            return (
              <div key={emotion} className="rounded-[1.5rem] border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{emoji}</span>
                    <span className="text-sm font-semibold capitalize text-slate-700 dark:text-slate-200">
                      {emotion}
                    </span>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                    {value}
                  </span>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MoodChart;