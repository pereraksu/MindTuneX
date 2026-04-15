const StatCard = ({ title, value, subtitle, icon, gradient }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
      
      {/* Top Gradient Line */}
      <div className={`absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r ${gradient || "from-teal-400 to-sky-500"}`} />

      {/* Content */}
      <div className="flex items-center justify-between">
        
        {/* Text */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-light text-slate-800 dark:text-white capitalize">
            {value}
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        {/* Icon */}
        {icon && (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl shadow-inner dark:bg-slate-800">
            {icon}
          </div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent dark:from-white/5" />
      </div>
    </div>
  );
};

export default StatCard;