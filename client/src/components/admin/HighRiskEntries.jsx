const HighRiskEntries = ({ entries = [] }) => {
  const getRiskTone = (supportLevel) => {
    const level = supportLevel?.toLowerCase();

    if (level === "high") {
      return {
        badge: "bg-red-100 text-red-700 border-red-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800",
        dot: "bg-red-500 dark:bg-rose-500",
        label: "High Priority",
      };
    }

    if (level === "moderate") {
      return {
        badge: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800",
        dot: "bg-amber-500 dark:bg-amber-500",
        label: "Moderate Priority",
      };
    }

    return {
      badge: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      dot: "bg-slate-400 dark:bg-slate-600",
      label: "Needs Review",
    };
  };

  return (
    <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Risk Monitoring
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-800 dark:text-white">
            High-Risk Alerts
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Entries that may need quick review and emotional support.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
          {entries.length} Alert{entries.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Content */}
      {!entries.length ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
            ✅
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
            No high-risk entries found
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Everything looks stable right now.
          </p>
        </div>
      ) : (
        <div className="max-h-[650px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {entries.map((entry) => {
            const tone = getRiskTone(entry.supportLevel);

            return (
              <div
                key={entry._id}
                className="group rounded-3xl border border-red-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-800/60"
              >
                {/* User Row */}
                <div className="mb-4 flex flex-col gap-3 border-b border-red-50 pb-4 dark:border-slate-800 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-lg dark:bg-rose-900/20">
                      ⚠️
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-slate-800 dark:text-white">
                          {entry.user?.fullName || "Unknown User"}
                        </p>
                        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${tone.badge}`}>
                          {tone.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {entry.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Detected At
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Entry Text Box */}
                <div className="rounded-2xl border border-red-50 bg-red-50/30 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 dark:text-rose-500/60">
                    Journal Text Analysis
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700 italic dark:text-slate-300">
                    “{entry.inputText || "No journal text available"}”
                  </p>
                </div>

                {/* Tags Metadata */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold capitalize text-red-600 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400">
                    Emotion: {entry.predictedEmotion}
                  </span>
                  <span className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold capitalize text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    Trigger: {entry.triggerCategory || "general"}
                  </span>
                  {entry.confidence && (
                    <span className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600 dark:border-sky-900/50 dark:bg-sky-900/20 dark:text-sky-400">
                      Confidence: {Math.round(entry.confidence * 100)}%
                    </span>
                  )}
                </div>

                {/* Status Indicator Footer */}
                <div className="mt-4 flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                  <span className={`h-2 w-2 rounded-full ${tone.dot} shadow-[0_0_8px_rgba(244,63,94,0.4)]`} />
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    Review required for emotional wellness follow-up.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HighRiskEntries;