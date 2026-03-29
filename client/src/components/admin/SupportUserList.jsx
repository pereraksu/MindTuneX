const SupportUserList = ({ users = [] }) => {
  const getSupportTone = (user) => {
    const highSupport = user.highSupportEntries || 0;
    const negative = user.negativeEntries || 0;

    if (highSupport >= 5 || negative >= 8) {
      return {
        badge: "bg-red-100 text-red-700 border-red-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800",
        dot: "bg-red-500 dark:bg-rose-500",
        label: "Priority Support",
        // Dark mode එකේදී gradient එක අඳුරු වර්ණවලට මාරු වේ
        card: "from-red-50 via-white to-white border-red-100 dark:from-rose-900/20 dark:via-slate-900 dark:to-slate-900 dark:border-slate-800",
      };
    }

    if (highSupport >= 2 || negative >= 4) {
      return {
        badge: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800",
        dot: "bg-amber-500 dark:bg-amber-500",
        label: "Monitor Closely",
        card: "from-amber-50 via-white to-white border-amber-100 dark:from-amber-900/20 dark:via-slate-900 dark:to-slate-900 dark:border-slate-800",
      };
    }

    return {
      badge: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-400 dark:border-sky-800",
      dot: "bg-sky-500 dark:bg-sky-500",
      label: "Needs Follow-up",
      card: "from-sky-50 via-white to-white border-sky-100 dark:from-sky-900/20 dark:via-slate-900 dark:to-slate-900 dark:border-slate-800",
    };
  };

  return (
    <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Support Monitoring
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-800 dark:text-white">
            Users Needing Support
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Based on recent emotional patterns and support signals.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
          {users.length} User{users.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Content */}
      {!users.length ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
            🤝
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
            No users currently flagged
          </h3>
        </div>
      ) : (
        <div className="max-h-[650px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {users.map((user) => {
            const tone = getSupportTone(user);

            return (
              <div
                key={user._id}
                className={`group rounded-3xl border bg-gradient-to-r p-5 shadow-sm transition-all duration-300 hover:shadow-lg ${tone.card}`}
              >
                {/* User Info Row */}
                <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 dark:border-slate-800 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-lg dark:bg-blue-900/30">
                      👤
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-slate-800 dark:text-white">
                          {user.fullName || user.name}
                        </p>
                        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${tone.badge}`}>
                          {tone.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Support Status
                    </p>
                    <div className="mt-2 flex items-center gap-2 md:justify-end">
                      <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        Active monitoring
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Entries</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-800 dark:text-white">{user.totalEntries || 0}</p>
                  </div>

                  <div className="rounded-2xl border border-red-100 bg-red-50/80 p-4 dark:border-rose-900/40 dark:bg-rose-900/10">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">High Support</p>
                    <p className="mt-1 text-2xl font-semibold text-red-600 dark:text-rose-400">{user.highSupportEntries || 0}</p>
                  </div>

                  <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Negatives</p>
                    <p className="mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-400">{user.negativeEntries || 0}</p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${tone.dot} shadow-sm`} />
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-500">
                    Recommended for admin review and intervention follow-up.
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

export default SupportUserList;