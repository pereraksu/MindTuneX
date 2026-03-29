const MoodChart = ({ insight }) => {
  const emotionCounts = insight?.emotionCounts || {};
  const entries = Object.entries(emotionCounts);
  const maxValue = entries.length
    ? Math.max(...entries.map(([, value]) => value))
    : 1;

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-slate-800">Emotion Summary</h2>

      {!entries.length ? (
        <p className="text-sm text-slate-500">No chart data available.</p>
      ) : (
        <div className="space-y-4">
          {entries.map(([emotion, value]) => (
            <div key={emotion}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium capitalize text-slate-700">{emotion}</span>
                <span className="text-slate-500">{value}</span>
              </div>

              <div className="h-3 w-full rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-blue-600"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodChart;