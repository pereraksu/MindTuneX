import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/useTheme";
import Logo from "./MindTuneXLogo";

const Sidebar = ({ forceAdmin = false }) => {
  const { isAdmin, loading, user } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();

  const isActuallyAdmin =
    forceAdmin === true ||
    isAdmin === true ||
    location.pathname.startsWith("/admin") ||
    user?.role?.toLowerCase() === "admin";

  const accentStart = isActuallyAdmin ? "#f59e0b" : "#14b8a6";
  const accentEnd = isActuallyAdmin ? "#f97316" : "#0ea5e9";

  if (loading && !forceAdmin) {
    return (
      <aside className="sidebar-shell">
        <div className="sidebar-logo-area animate-pulse">
          <div className="h-10 w-36 rounded-xl bg-white/10" />
        </div>
        <div className="px-5 pt-5 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-2xl bg-white/10 animate-pulse" />
          ))}
        </div>
      </aside>
    );
  }

  const userMenuItems = [
    { name: "Dashboard", path: "/dashboard", icon: DashboardIcon },
    { name: "Mood Analysis", path: "/mood-analysis", icon: MoodIcon },
    { name: "Journal", path: "/journal", icon: JournalIcon },
    { name: "History", path: "/mood-history", icon: HistoryIcon },
    { name: "Insights", path: "/insights", icon: InsightsIcon },
    { name: "Support", path: "/support", icon: SupportIcon },
    { name: "Reports", path: "/reports", icon: ReportsIcon },
    { name: "Chatbot", path: "/chatbot", icon: ChatIcon },
  ];

  const adminMenuItems = [
    { name: "Admin Dashboard", path: "/admin", icon: AdminIcon },
    { name: "Manage Users", path: "/admin/users", icon: UsersIcon },
    { name: "Risk Alerts", path: "/admin/alerts", icon: AlertIcon },
    { name: "System Reports", path: "/admin/reports", icon: ReportsIcon },
  ];

  const menuItems = isActuallyAdmin ? adminMenuItems : userMenuItems;

  const initials = (user?.fullName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <style>{`
        .sidebar-shell {
          display: none;
          flex-direction: column;
          min-height: 100svh;
          width: 276px;
          flex-shrink: 0;
          font-family: 'DM Sans', 'Inter', 'Segoe UI', system-ui, sans-serif;
          position: relative;
          overflow: hidden;
          background: ${
            darkMode
              ? "linear-gradient(180deg, #08111f 0%, #0b0f1a 100%)"
              : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"
          };
          border-right: 1px solid ${
            darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"
          };
          box-shadow: ${
            darkMode
              ? "18px 0 45px rgba(0,0,0,0.26)"
              : "18px 0 45px rgba(15,23,42,0.08)"
          };
        }

        @media (min-width: 1024px) {
          .sidebar-shell {
            display: flex;
          }
        }

        .sidebar-shell::before {
          content: '';
          position: absolute;
          top: -90px;
          left: -90px;
          width: 330px;
          height: 330px;
          background: radial-gradient(circle, ${accentStart}22 0%, transparent 68%);
          pointer-events: none;
          z-index: 0;
        }

        .sidebar-shell::after {
          content: '';
          position: absolute;
          bottom: -120px;
          right: -110px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, ${accentEnd}18 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .sidebar-shell > * {
          position: relative;
          z-index: 1;
        }

        .sidebar-logo-area {
          padding: 28px 24px 24px;
          border-bottom: 1px solid ${
            darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"
          };
        }

        .sidebar-user-card {
          margin: 18px 16px 0;
          padding: 13px 14px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: ${
            darkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.78)"
          };
          border: 1px solid ${
            darkMode ? "rgba(255,255,255,0.085)" : "rgba(15,23,42,0.08)"
          };
          box-shadow: ${
            darkMode
              ? "0 14px 32px rgba(0,0,0,0.22)"
              : "0 14px 30px rgba(15,23,42,0.075)"
          };
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .sidebar-avatar {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: linear-gradient(135deg, ${accentStart}, ${accentEnd});
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          color: #fff;
          flex-shrink: 0;
          letter-spacing: 0.04em;
          box-shadow: 0 10px 24px ${accentStart}45;
        }

        .sidebar-user-name {
          font-size: 13.5px;
          font-weight: 800;
          color: ${darkMode ? "rgba(255,255,255,0.92)" : "#0f172a"};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sidebar-user-role {
          font-size: 11px;
          color: ${isActuallyAdmin ? "#f59e0b" : "#0d9488"};
          letter-spacing: 0.05em;
          margin-top: 2px;
          font-weight: 700;
        }

        .sidebar-section-label {
          padding: 24px 22px 9px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${
            darkMode ? "rgba(255,255,255,0.28)" : "rgba(15,23,42,0.36)"
          };
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 11px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          font-size: 13.5px;
          font-weight: 700;
          color: ${
            darkMode ? "rgba(255,255,255,0.48)" : "rgba(15,23,42,0.56)"
          };
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          cursor: pointer;
        }

        .sidebar-link:hover {
          transform: translateX(2px);
          background: ${
            darkMode ? "rgba(255,255,255,0.065)" : "rgba(15,23,42,0.055)"
          };
          color: ${darkMode ? "#ffffff" : "#0f172a"};
        }

        .sidebar-link.active {
          background: ${
            darkMode
              ? `linear-gradient(135deg, ${accentStart}22, ${accentEnd}18)`
              : `linear-gradient(135deg, ${accentStart}16, ${accentEnd}12)`
          };
          color: ${isActuallyAdmin ? "#f59e0b" : "#0d9488"};
          box-shadow: inset 0 0 0 1px ${accentStart}24;
        }

        .sidebar-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 24px;
          border-radius: 0 999px 999px 0;
          background: linear-gradient(180deg, ${accentStart}, ${accentEnd});
          box-shadow: 0 0 14px ${accentStart}66;
        }

        .sidebar-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: ${
            darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.055)"
          };
          transition: all 0.2s ease;
        }

        .sidebar-link:hover .sidebar-icon-wrap {
          background: ${
            darkMode ? "rgba(255,255,255,0.095)" : "rgba(15,23,42,0.08)"
          };
        }

        .sidebar-link.active .sidebar-icon-wrap {
          background: linear-gradient(135deg, ${accentStart}, ${accentEnd});
          color: #ffffff;
          box-shadow: 0 10px 22px ${accentStart}35;
        }

        .sidebar-footer {
          margin: 10px 16px 22px;
          padding: 13px 14px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 11px;
          border: 1px solid ${
            darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"
          };
          background: ${
            darkMode ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.7)"
          };
          box-shadow: ${
            darkMode
              ? "0 12px 26px rgba(0,0,0,0.18)"
              : "0 12px 26px rgba(15,23,42,0.06)"
          };
        }

        .sidebar-footer-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${accentStart};
          flex-shrink: 0;
          box-shadow: 0 0 10px ${accentStart}aa;
        }

        .sidebar-footer-text {
          font-size: 11.2px;
          color: ${
            darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.48)"
          };
          letter-spacing: 0.03em;
        }

        .sidebar-footer-text strong {
          font-weight: 800;
          color: ${darkMode ? "rgba(255,255,255,0.7)" : "#0f172a"};
        }
      `}</style>

      <aside className="sidebar-shell">
        <div className="sidebar-logo-area">
          <Logo isAdmin={isActuallyAdmin} />
        </div>

        <div className="sidebar-user-card">
          <div className="sidebar-avatar">{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div className="sidebar-user-name">
              {user?.fullName || "MindTuneX User"}
            </div>
            <div className="sidebar-user-role">
              {isActuallyAdmin ? "Administrator" : "Wellness User"}
            </div>
          </div>
        </div>

        <div className="sidebar-section-label">
          {isActuallyAdmin ? "Admin Controls" : "Navigation"}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/admin" || item.path === "/dashboard"}
                className={({ isActive }) =>
                  `sidebar-link${isActive ? " active" : ""}`
                }
              >
                <span className="sidebar-icon-wrap">
                  <Icon />
                </span>
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-dot" />
          <div className="sidebar-footer-text">
            <strong>MindTuneX v1.0</strong> &nbsp;·&nbsp;
            {isActuallyAdmin ? "Admin Mode" : "Standard Portal"}
          </div>
        </div>
      </aside>
    </>
  );
};

/* ─── Icon components ─── */

const s = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const DashboardIcon = () => (
  <svg {...s}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const MoodIcon = () => (
  <svg {...s}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M8.5 14.5s1.5 2 3.5 2 3.5-2 3.5-2" />
    <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const JournalIcon = () => (
  <svg {...s}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="13" y2="11" />
  </svg>
);

const HistoryIcon = () => (
  <svg {...s}>
    <polyline points="12 8 12 12 14 14" />
    <path d="M3.05 11a9 9 0 1 0 .5-4.4" />
    <polyline points="3 3 3 11 11 11" />
  </svg>
);

const InsightsIcon = () => (
  <svg {...s}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const SupportIcon = () => (
  <svg {...s}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ReportsIcon = () => (
  <svg {...s}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ChatIcon = () => (
  <svg {...s}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const AdminIcon = () => (
  <svg {...s}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const UsersIcon = () => (
  <svg {...s}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const AlertIcon = () => (
  <svg {...s}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default Sidebar;