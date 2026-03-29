const AdminUserTable = ({ users = [] }) => {
  const getMoodEmoji = (mood) => {
    const moodMap = {
      joy: "😄", calm: "😌", stress: "😤", anxiety: "😰",
      sadness: "😢", anger: "😡", fatigue: "😴", love: "🥰",
      fear: "😨", disgust: "🤢", surprise: "😲", neutral: "😐",
    };
    return moodMap[mood?.toLowerCase()] || "😐";
  };

  const getRiskBadge = (count) => {
    if (count >= 5) {
      return "bg-red-100 text-red-700 border-red-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800";
    }
    if (count >= 1) {
      return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
    }
    return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
  };

  const getRiskLabel = (count) => {
    if (count >= 5) return "High";
    if (count >= 1) return "Moderate";
    return "Low";
  };

  return (
    <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            User Management
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-800 dark:text-white">
            Users Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review user roles, activity, emotions, and risk alerts.
          </p>
        </div>

        <div className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 dark:border-sky-900/50 dark:bg-sky-900/20 dark:text-sky-400">
          {users.length} User{users.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table Section */}
      {!users.length ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
            👥
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">No users found</h3>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                <th className="px-3 py-4 font-semibold">User</th>
                <th className="px-3 py-4 font-semibold">Role</th>
                <th className="px-3 py-4 text-center font-semibold">Mood Entries</th>
                <th className="px-3 py-4 text-center font-semibold">Risk Alerts</th>
                <th className="px-3 py-4 font-semibold">Latest Mood</th>
                <th className="px-3 py-4 font-semibold">Risk Level</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((user, index) => {
                const riskCount = user.highSupportCount || 0;
                const latestMood = user.latestMood || "N/A";
                const role = user.role || "user";

                return (
                  <tr
                    key={user._id || index}
                    className="transition-colors hover:bg-sky-50/40 dark:hover:bg-slate-800/40"
                  >
                    {/* User Info */}
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-base font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          {(user.fullName || user.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {user.fullName || user.name || "Unknown User"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-3 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        role === "admin"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                      }`}>
                        {role}
                      </span>
                    </td>

                    {/* Mood Entries Count */}
                    <td className="px-3 py-4 text-center">
                      <div className="inline-flex min-w-[50px] justify-center rounded-xl bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {user.moodCount || 0}
                      </div>
                    </td>

                    {/* Risk Alerts Count */}
                    <td className="px-3 py-4 text-center">
                      <div className={`inline-flex min-w-[50px] justify-center rounded-xl px-3 py-1.5 font-semibold ${
                        riskCount > 0
                          ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                      }`}>
                        {riskCount}
                      </div>
                    </td>

                    {/* Latest Mood */}
                    <td className="px-3 py-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:bg-sky-900/20 dark:text-sky-400">
                        <span>{getMoodEmoji(latestMood)}</span>
                        <span className="capitalize">{latestMood}</span>
                      </div>
                    </td>

                    {/* Risk Level Badge */}
                    <td className="px-3 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getRiskBadge(riskCount)}`}>
                        {getRiskLabel(riskCount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserTable;