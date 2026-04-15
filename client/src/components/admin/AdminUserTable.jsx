const AdminUserTable = ({ users = [] }) => {
  const getMoodEmoji = (mood) => {
    const moodMap = {
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
    return moodMap[mood?.toLowerCase()] || "😐";
  };

  const getRiskBadge = (count) => {
    if (count >= 5) {
      return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50";
    }
    if (count >= 1) {
      return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50";
    }
    return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50";
  };

  const getRiskLabel = (count) => {
    if (count >= 5) return "High";
    if (count >= 1) return "Moderate";
    return "Low";
  };

  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
            User Management
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-800 dark:text-white">
            Users Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review user roles, emotional activity, and risk alerts.
          </p>
        </div>

        <div className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 dark:border-sky-900/50 dark:bg-sky-900/20 dark:text-sky-400">
          {users.length} User{users.length !== 1 ? "s" : ""}
        </div>
      </div>

      {!users.length ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
            👥
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
            No users found
          </h3>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            User records will appear here once accounts are available.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-800/70">
                <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  <th className="px-4 py-4 font-semibold">User</th>
                  <th className="px-4 py-4 font-semibold">Role</th>
                  <th className="px-4 py-4 text-center font-semibold">Entries</th>
                  <th className="px-4 py-4 text-center font-semibold">Alerts</th>
                  <th className="px-4 py-4 font-semibold">Latest Mood</th>
                  <th className="px-4 py-4 font-semibold">Risk Level</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white/70 dark:divide-slate-800 dark:bg-slate-900/30">
                {users.map((user, index) => {
                  const riskCount = user.highSupportCount || 0;
                  const latestMood = user.latestMood || "N/A";
                  const role = user.role || "user";
                  const moodCount = user.moodCount || 0;

                  return (
                    <tr
                      key={user._id || index}
                      className="transition-colors hover:bg-sky-50/40 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 text-base font-semibold text-blue-700 dark:from-blue-900/40 dark:to-cyan-900/30 dark:text-blue-300">
                            {(user.fullName || user.name || "U").charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800 dark:text-white">
                              {user.fullName || user.name || "Unknown User"}
                            </p>
                            <p className="max-w-[180px] truncate text-xs text-slate-500 dark:text-slate-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            role === "admin"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {role}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex min-w-[56px] justify-center rounded-xl bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {moodCount}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <div
                          className={`inline-flex min-w-[56px] justify-center rounded-xl px-3 py-1.5 font-semibold ${
                            riskCount > 0
                              ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                              : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                          }`}
                        >
                          {riskCount}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:bg-sky-900/20 dark:text-sky-400">
                          <span>{getMoodEmoji(latestMood)}</span>
                          <span className="capitalize">{latestMood}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getRiskBadge(
                            riskCount
                          )}`}
                        >
                          {getRiskLabel(riskCount)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserTable;