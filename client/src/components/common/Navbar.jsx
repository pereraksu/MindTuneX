import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../../context/useTheme";
import MindTuneXLogo from "./MindTuneXLogo"; // 🚀 ඔයාගේ ලෝගෝ ෆයිල් එකේ නම

const Navbar = ({ user, onLogout, isAdmin }) => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-2xl shadow-sm dark:border-slate-700 dark:bg-slate-900/80 transition-colors duration-300">
      <div className="mx-auto max-w-screen-2xl px-6 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to={isAdmin ? "/admin" : "/dashboard"} className="outline-none">
            {/* 🚀 වෙනස: darkMode={darkMode} කෑල්ල අයින් කළා. දැන් Tailwind බලාගන්නවා */}
            <MindTuneXLogo />
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-2 shadow-sm md:flex dark:border-slate-700 dark:bg-slate-800/70 transition-colors duration-300">
            <NavItem
              to={isAdmin ? "/admin" : "/dashboard"}
              label={isAdmin ? "Admin Dashboard" : "Dashboard"}
            />

            {!isAdmin && (
              <>
                <NavItem to="/journal" label="Journal" />
                <NavItem to="/support" label="Support" />
                <NavItem to="/reports" label="Reports" />
              </>
            )}

            {isAdmin && (
              <>
                <NavItem to="/admin/users" label="Users" />
                <NavItem to="/admin/reports" label="Reports" />
              </>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-3xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            {/* User Info */}
            <div className="hidden items-center gap-3 rounded-3xl border border-white/60 bg-white/70 px-3 py-2 shadow-sm sm:flex dark:border-slate-700 dark:bg-slate-800/70 transition-colors duration-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-teal-100 text-sm font-bold text-sky-700 dark:from-slate-700 dark:to-slate-600 dark:text-white transition-colors duration-300">
                {(user?.fullName || "U").charAt(0).toUpperCase()}
              </div>

              <div className="text-right leading-tight">
                <p className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-700 dark:text-white transition-colors duration-300">
                  {user?.fullName || "User"}
                  {isAdmin && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                      Admin
                    </span>
                  )}
                </p>
                <p className="max-w-[140px] truncate text-xs text-slate-400 dark:text-slate-300 transition-colors duration-300">
                  {user?.email || ""}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="rounded-3xl border border-rose-100 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 backdrop-blur-xl transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:shadow-md active:scale-95 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-rose-500 dark:hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavItem = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-teal-500 to-sky-500 text-white shadow-md"
            : "text-slate-600 hover:bg-slate-50 hover:text-teal-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
};

export default Navbar;