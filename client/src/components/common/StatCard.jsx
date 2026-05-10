const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  gradient = "from-teal-400 via-cyan-500 to-sky-500",
}) => {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_rgba(14,165,233,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(14,165,233,0.16)] dark:border-white/10 dark:bg-[#0f172acc] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

      {/* Animated Background Glow */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-500 group-hover:scale-125 dark:bg-cyan-500/10" />

      {/* Top Accent Line */}
      <div
        className={`absolute inset-x-0 top-0 h-1.5 rounded-t-[28px] bg-gradient-to-r ${gradient}`}
      />

      {/* Floating Border Glow */}
      <div className="absolute inset-0 rounded-[28px] border border-transparent transition-all duration-300 group-hover:border-cyan-400/20 dark:group-hover:border-cyan-300/10" />

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between gap-4">

        {/* Left Content */}
        <div className="min-w-0">
          {/* Title */}
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
            {title}
          </p>

          {/* Value */}
          <h3 className="mt-3 text-3xl font-[700] tracking-tight text-slate-800 dark:text-white">
            {value}
          </h3>

          {/* Subtitle */}
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        {/* Icon */}
        {icon && (
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/50 bg-white/70 text-2xl shadow-inner backdrop-blur-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 dark:border-white/10 dark:bg-slate-800/80">

            {/* Icon Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent dark:from-white/5" />

            <div className="relative z-10 text-slate-700 dark:text-white">
              {icon}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Shine Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5" />
      </div>

      {/* Bottom Blur Line */}
      <div className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 opacity-0 blur-sm transition-all duration-500 group-hover:w-3/4 group-hover:opacity-100" />
    </div>
  );
};

export default StatCard;