const AdminStatsCards = ({ summary }) => {
  const totalUsers = summary?.totalUsers || 0;
  const totalMoodEntries = summary?.totalMoodEntries || 0;
  const totalHighRiskEntries = summary?.totalHighRiskEntries || 0;

  const platformStatus =
    totalHighRiskEntries >= 10
      ? "Critical"
      : totalHighRiskEntries >= 5
      ? "Moderate"
      : "Stable";

  const statusStyle =
    totalHighRiskEntries >= 10
      ? "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"
      : totalHighRiskEntries >= 5
      ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
      : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      
      {/* Total Users */}
      <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl dark:bg-blue-900/40">
            👥
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            Users
          </span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Total Users</p>
        <p className="mt-3 text-4xl font-semibold text-slate-800 dark:text-white">{totalUsers}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Registered users on the platform</p>
      </div>

      {/* Total Mood Entries */}
      <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-500 to-teal-500" />
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl dark:bg-sky-900/40">
            📝
          </div>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
            Entries
          </span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Mood Entries</p>
        <p className="mt-3 text-4xl font-semibold text-slate-800 dark:text-white">{totalMoodEntries}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Emotional records submitted</p>
      </div>

      {/* High Risk Entries - Special styling for Risk in Dark Mode */}
      <div className="group relative overflow-hidden rounded-3xl border border-red-100 bg-red-50/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 dark:border-rose-900/50 dark:bg-rose-950/30 dark:shadow-none">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-rose-500 to-red-500" />
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-2xl dark:bg-rose-900/40">
            ⚠️
          </div>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-900/50 dark:text-rose-400">
            Risk
          </span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-red-400 dark:text-rose-500/80">High Risk Entries</p>
        <p className="mt-3 text-4xl font-semibold text-red-600 dark:text-rose-400">{totalHighRiskEntries}</p>
        <p className="mt-2 text-sm text-red-500 dark:text-rose-500/70">Urgent intervention alerts</p>
      </div>

      {/* Platform Status */}
      <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-violet-500 to-indigo-500" />
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl dark:bg-violet-900/40">
            🛡️
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle}`}>
            {platformStatus}
          </span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Platform Status</p>
        <p className="mt-3 text-3xl font-semibold text-slate-800 dark:text-white">{platformStatus}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">System health overview</p>
      </div>

    </div>
  );
};

export default AdminStatsCards;