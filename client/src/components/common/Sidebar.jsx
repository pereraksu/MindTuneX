import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "./MindTuneXLogo";

const Sidebar = ({ forceAdmin = false }) => {
  const { isAdmin, loading, user } = useAuth();
  const location = useLocation();

  const isActuallyAdmin =
    forceAdmin === true ||
    isAdmin === true ||
    location.pathname.startsWith("/admin") ||
    user?.role?.toLowerCase() === "admin";

  if (loading && !forceAdmin) {
    return (
      <aside className="hidden min-h-screen w-72 flex-col border-r border-white/60 bg-white/75 backdrop-blur-2xl lg:flex dark:border-slate-700 dark:bg-slate-900/95">
        <div className="flex items-center justify-center border-b border-white/60 px-6 py-8 dark:border-slate-700">
          <div className="h-16 w-44 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="px-6 pt-6">
          <div className="mb-3 h-3 w-24 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800"
              />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  const menuItems = isActuallyAdmin
    ? [
        { name: "Admin Dashboard", path: "/admin", icon: "👑" },
        { name: "Manage Users", path: "/admin/users", icon: "👥" },
        { name: "Risk Alerts", path: "/admin/alerts", icon: "⚠️" },
        { name: "System Reports", path: "/admin/reports", icon: "📑" },
      ]
    : [
        { name: "Dashboard", path: "/dashboard", icon: "📊" },
        { name: "Mood Analysis", path: "/mood-analysis", icon: "🧠" },
        { name: "Journal", path: "/journal", icon: "✍️" },
        { name: "History", path: "/mood-history", icon: "📅" },
        { name: "Insights", path: "/insights", icon: "💡" },
        { name: "Support", path: "/support", icon: "🤝" },
        { name: "Reports", path: "/reports", icon: "📈" },
      ];

  return (
    <aside className="hidden min-h-screen w-72 flex-col border-r border-white/60 bg-white/75 backdrop-blur-2xl lg:flex dark:border-slate-700 dark:bg-slate-900/95 transition-colors duration-300">
      {/* Top gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-sky-500 to-cyan-500" />

      {/* Logo */}
      <div className="relative flex justify-center border-b border-white/60 px-6 py-8 dark:border-slate-700">
        <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />
        <Logo isAdmin={isActuallyAdmin} />
      </div>

      {/* User mini card */}
      <div className="px-5 pt-5">
        <div className="rounded-[1.5rem] border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/70">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-sky-500 text-base font-bold text-white shadow-md">
              {(user?.fullName || "U").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                {user?.fullName || "MindTuneX User"}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {isActuallyAdmin ? "Administrator" : "Wellness User"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section title */}
      <div className="px-6 pt-6 pb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          {isActuallyAdmin ? "Admin Controls" : "Navigation"}
        </h3>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-[1.5rem] px-5 py-3.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border border-teal-100 bg-white/95 text-teal-700 shadow-md dark:border-teal-900/40 dark:bg-slate-800 dark:text-teal-300"
                  : "text-slate-600 hover:bg-white/70 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-2 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-teal-400 to-sky-500" />
                )}

                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl text-lg transition-all ${
                    isActive
                      ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                      : "bg-slate-50 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-700 dark:group-hover:text-sky-300"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/60 p-5 dark:border-slate-700">
        <div
          className={`rounded-[1.5rem] border p-4 text-center transition-colors ${
            isActuallyAdmin
              ? "border-amber-200 bg-amber-50/90 dark:border-amber-900/40 dark:bg-amber-900/20"
              : "border-slate-200 bg-slate-50/90 dark:border-slate-700 dark:bg-slate-800/60"
          }`}
        >
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            MindTuneX v1.0
          </p>
          <p
            className={`mt-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
              isActuallyAdmin
                ? "text-amber-700 dark:text-amber-300"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {isActuallyAdmin ? "Administrator Mode" : "Standard User Portal"}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;