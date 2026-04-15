const SupportUserList = ({ users = [] }) => {
  const getSupportTone = (user) => {
    const highSupport = user.highSupportEntries || 0;
    const negative = user.negativeEntries || 0;

    if (highSupport >= 5 || negative >= 8) {
      return {
        badge:
          "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800/50",
        dot: "bg-rose-500",
        label: "Priority Support",
        card: "border-rose-100 dark:border-rose-900/40",
      };
    }

    if (highSupport >= 2 || negative >= 4) {
      return {
        badge:
          "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800/50",
        dot: "bg-amber-500",
        label: "Monitor Closely",
        card: "border-amber-100 dark:border-amber-900/40",
      };
    }

    return {
      badge:
        "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-400 dark:border-sky-800/50",
      dot: "bg-sky-500",
      label: "Needs Follow-up",
      card: "border-sky-100 dark:border-sky-800/40",
    };
  };

  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
      
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
            Support Monitoring
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-800 dark:text-white">
            Users Needing Support
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Identified through emotional trends and risk indicators.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
          {users.length} User{users.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Empty */}
      {!users.length ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
            🤝
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
            No users currently flagged
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            All users appear emotionally stable at the moment.
          </p>
        </div>
      ) : (
        <div className="max-h-[650px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {users.map((user) => {
            const tone = getSupportTone(user);

            return (
              <div
                key={user._id}
                className={`group rounded-[1.75rem] border bg-white/70 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900/50 ${tone.card}`}
              >
                
                {/* Top Row */}
                <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 dark:border-slate-800 md:flex-row md:items-start md:justify-between">
                  
                  {/* User Info */}
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 text-lg dark:from-blue-900/40 dark:to-cyan-900/30">
                      👤
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-slate-800 dark:text-white">
                          {user.fullName || user.name || "Unknown"}
                        </p>

                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${tone.badge}`}
                        >
                          {tone.label}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {user.email || "No email"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      Status
                    </p>
                    <div className="mt-2 flex items-center gap-2 md:justify-end">
                      <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        Active Monitoring
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid gap-3 sm:grid-cols-3">
                  
                  <StatBox
                    title="Total Entries"
                    value={user.totalEntries || 0}
                    color="neutral"
                  />

                  <StatBox
                    title="High Support"
                    value={user.highSupportEntries || 0}
                    color="danger"
                  />

                  <StatBox
                    title="Negative Signals"
                    value={user.negativeEntries || 0}
                    color="warning"
                  />
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
                  <p className="text-[11px] text-slate-500 dark:text-slate-500">
                    Recommended for follow-up and emotional support review.
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

/* 🔹 Small reusable stat box */
const StatBox = ({ title, value, color }) => {
  const styles = {
    neutral:
      "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40",
    danger:
      "border-rose-100 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-900/10",
    warning:
      "border-amber-100 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/10",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[color]}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>
      <p className="mt-1 text-2xl font-semibold text-slate-800 dark:text-white">
        {value}
      </p>
    </div>
  );
};

export default SupportUserList;