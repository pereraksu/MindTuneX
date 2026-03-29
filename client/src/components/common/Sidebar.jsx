import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// 🚀 අලුත් Logo Component එක Import කරගන්නවා
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
      <aside className="hidden min-h-screen w-72 flex-col border-r border-white/60 bg-white/75 backdrop-blur-2xl lg:flex dark:border-slate-700 dark:bg-slate-900 transition-colors duration-300">
        <div className="flex h-24 items-center border-b border-white/60 px-6 dark:border-slate-700">
          <div className="h-12 w-12 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-700" />
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
    <aside className="hidden min-h-screen w-72 flex-col border-r border-white/60 bg-white/75 backdrop-blur-2xl lg:flex dark:border-slate-700 dark:bg-slate-900 transition-colors duration-300">
      
      {/* 🚀 Logo Section - අලුත් Component එක දැම්මා */}
      <div className="flex justify-center border-b border-white/60 px-6 py-8 dark:border-slate-700">
        <Logo isAdmin={isActuallyAdmin} />
      </div>

      {/* Menu Title */}
      <div className="px-6 pt-6 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {isActuallyAdmin ? "ADMIN CONTROLS" : "NAVIGATION"}
        </h3>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-3xl px-5 py-3.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white/90 text-teal-700 shadow-inner border border-teal-100 dark:bg-slate-800 dark:text-teal-300"
                  : "text-slate-600 hover:bg-white/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/60 p-6 dark:border-slate-700">
        <div className={`rounded-3xl p-4 text-center transition-colors ${
          isActuallyAdmin 
            ? "bg-amber-50/80 border border-amber-200 dark:bg-amber-900/30" 
            : "bg-slate-50/80 border border-slate-200 dark:bg-slate-800/50"
        }`}>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            MindTuneX v1.0
          </p>
          <p className={`mt-1 text-[0.65rem] font-bold uppercase tracking-tighter ${
            isActuallyAdmin ? "text-amber-700 dark:text-amber-300" : "text-slate-400"
          }`}>
            {isActuallyAdmin ? "⚠️ ADMINISTRATOR MODE" : "STANDARD USER PORTAL"}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;