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
      ? "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50"
      : totalHighRiskEntries >= 5
      ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50"
      : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50";

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        title="Total Users"
        value={totalUsers}
        subtitle="Registered users on the platform"
        icon="👥"
        tag="Users"
        gradient="from-blue-500 to-cyan-500"
        iconBg="bg-blue-100 dark:bg-blue-900/40"
        tagStyle="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      />

      <AdminStatCard
        title="Mood Entries"
        value={totalMoodEntries}
        subtitle="Emotional records submitted"
        icon="📝"
        tag="Entries"
        gradient="from-sky-500 to-teal-500"
        iconBg="bg-sky-100 dark:bg-sky-900/40"
        tagStyle="bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
      />

      <AdminStatCard
        title="High Risk Entries"
        value={totalHighRiskEntries}
        subtitle="Urgent intervention alerts"
        icon="⚠️"
        tag="Risk"
        gradient="from-rose-500 to-red-500"
        iconBg="bg-rose-100 dark:bg-rose-900/40"
        tagStyle="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400"
        danger
        valueClassName="text-red-600 dark:text-rose-400"
        titleClassName="text-red-400 dark:text-rose-500/80"
        subtitleClassName="text-red-500 dark:text-rose-500/70"
      />

      <div className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-violet-500 to-indigo-500" />
        <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-violet-100/40 blur-2xl dark:bg-violet-900/20" />

        <div className="relative">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl dark:bg-violet-900/40">
              🛡️
            </div>

            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle}`}>
              {platformStatus}
            </span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
            Platform Status
          </p>

          <p className="mt-3 text-3xl font-semibold text-slate-800 dark:text-white">
            {platformStatus}
          </p>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            System health overview
          </p>
        </div>
      </div>
    </div>
  );
};

const AdminStatCard = ({
  title,
  value,
  subtitle,
  icon,
  tag,
  gradient,
  iconBg,
  tagStyle,
  danger = false,
  valueClassName = "text-slate-800 dark:text-white",
  titleClassName = "text-slate-400 dark:text-slate-500",
  subtitleClassName = "text-slate-500 dark:text-slate-400",
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 dark:shadow-none ${
        danger
          ? "border border-red-100 bg-red-50/80 dark:border-rose-900/50 dark:bg-rose-950/30"
          : "border border-white/60 bg-white/75 shadow-sky-100/40 dark:border-slate-800 dark:bg-slate-900/70"
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${gradient}`} />
      <div
        className={`absolute -right-8 -top-8 h-20 w-20 rounded-full blur-2xl ${
          danger ? "bg-rose-200/30 dark:bg-rose-900/20" : "bg-sky-100/40 dark:bg-slate-700/20"
        }`}
      />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${iconBg}`}>
            {icon}
          </div>

          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tagStyle}`}>
            {tag}
          </span>
        </div>

        <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${titleClassName}`}>
          {title}
        </p>

        <p className={`mt-3 text-4xl font-semibold ${valueClassName}`}>
          {value}
        </p>

        <p className={`mt-2 text-sm ${subtitleClassName}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AdminStatsCards;