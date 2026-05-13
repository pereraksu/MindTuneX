import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../../context/useTheme";
import MindTuneXLogo from "./MindTuneXLogo";

const Navbar = ({ user, onLogout, isAdmin }) => {
  const { darkMode, toggleTheme } = useTheme();

  const initials = (user?.fullName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const accentStart = isAdmin ? "#f59e0b" : "#14b8a6";
  const accentEnd = isAdmin ? "#f97316" : "#0ea5e9";

  return (
    <>
      <style>{`
        .navbar-root {
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'DM Sans', 'Inter', 'Segoe UI', system-ui, sans-serif;
          background: ${
            darkMode
              ? "rgba(8, 13, 24, 0.88)"
              : "rgba(255, 255, 255, 0.82)"
          };
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border-bottom: 1px solid ${
            darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"
          };
          box-shadow: ${
            darkMode
              ? "0 18px 45px rgba(0,0,0,0.28)"
              : "0 14px 35px rgba(15,23,42,0.08)"
          };
        }

        .navbar-accent-line {
          height: 2px;
          width: 100%;
          background: linear-gradient(90deg, transparent, ${accentStart}, ${accentEnd}, transparent);
          opacity: ${darkMode ? "0.75" : "0.9"};
        }

        .navbar-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 28px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .nav-pill {
          display: none;
          align-items: center;
          gap: 4px;
          padding: 5px;
          border-radius: 999px;
          background: ${
            darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"
          };
          border: 1px solid ${
            darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"
          };
        }

        @media (min-width: 768px) {
          .nav-pill {
            display: flex;
          }
        }

        .nav-link {
          padding: 8px 17px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s ease;
          color: ${
            darkMode ? "rgba(255,255,255,0.58)" : "rgba(15,23,42,0.58)"
          };
        }

        .nav-link:hover {
          transform: translateY(-1px);
          background: ${
            darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)"
          };
          color: ${darkMode ? "#ffffff" : "#0f172a"};
        }

        .nav-link.active {
          color: #ffffff;
          background: linear-gradient(135deg, ${accentStart}, ${accentEnd});
          box-shadow: 0 10px 24px ${accentStart}40;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .theme-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 12.5px;
          font-weight: 700;
          font-family: inherit;
          transition: all 0.2s ease;
          border: 1px solid ${
            darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)"
          };
          background: ${
            darkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.75)"
          };
          color: ${
            darkMode ? "rgba(255,255,255,0.78)" : "rgba(15,23,42,0.72)"
          };
        }

        .theme-btn:hover {
          transform: translateY(-1px);
          background: ${
            darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.055)"
          };
          color: ${darkMode ? "#ffffff" : "#0f172a"};
        }

        .theme-btn-icon {
          width: 18px;
          height: 18px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.9;
          stroke-linecap: round;
          stroke-linejoin: round;
          flex-shrink: 0;
        }

        .theme-btn span {
          display: none;
        }

        @media (min-width: 640px) {
          .theme-btn span {
            display: block;
          }
        }

        .user-chip {
          display: none;
          align-items: center;
          gap: 10px;
          padding: 5px 14px 5px 5px;
          border-radius: 999px;
          background: ${
            darkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.78)"
          };
          border: 1px solid ${
            darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"
          };
          box-shadow: ${
            darkMode
              ? "0 10px 24px rgba(0,0,0,0.22)"
              : "0 10px 24px rgba(15,23,42,0.07)"
          };
        }

        @media (min-width: 640px) {
          .user-chip {
            display: flex;
          }
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${accentStart}, ${accentEnd});
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
          box-shadow: 0 8px 20px ${accentStart}45;
        }

        .user-name {
          font-size: 13px;
          font-weight: 800;
          color: ${darkMode ? "rgba(255,255,255,0.9)" : "#0f172a"};
          max-width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-email {
          font-size: 11px;
          color: ${
            darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.45)"
          };
          max-width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-badge {
          display: inline-flex;
          margin-left: 6px;
          padding: 2px 7px;
          border-radius: 999px;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.06em;
          background: rgba(251,191,36,0.15);
          color: #f59e0b;
          border: 1px solid rgba(251,191,36,0.28);
          vertical-align: middle;
        }

        .logout-btn {
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid rgba(244,63,94,0.26);
          background: ${
            darkMode ? "rgba(244,63,94,0.08)" : "rgba(244,63,94,0.06)"
          };
          color: #f43f5e;
          font-size: 12.5px;
          font-weight: 800;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .logout-btn:hover {
          transform: translateY(-1px);
          background: rgba(244,63,94,0.16);
          border-color: rgba(244,63,94,0.45);
          box-shadow: 0 10px 22px rgba(244,63,94,0.18);
        }

        @media (max-width: 480px) {
          .navbar-inner {
            padding: 0 14px;
            height: 64px;
          }

          .logout-btn {
            padding: 8px 12px;
          }
        }
      `}</style>

      <header className="navbar-root">
        <div className="navbar-accent-line" />

        <div className="navbar-inner">
          <Link
            to={user ? (isAdmin ? "/admin" : "/dashboard") : "/"}
            style={{ flexShrink: 0, textDecoration: "none" }}
          >
            <MindTuneXLogo isAdmin={isAdmin} />
          </Link>

          <nav className="nav-pill">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              Home
            </NavLink>

            {user && (
              <>
                <NavLink
                  to={isAdmin ? "/admin" : "/dashboard"}
                  end
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                >
                  Dashboard
                </NavLink>

                {!isAdmin && (
                  <>
                    <NavLink
                      to="/journal"
                      className={({ isActive }) =>
                        `nav-link${isActive ? " active" : ""}`
                      }
                    >
                      Journal
                    </NavLink>

                    <NavLink
                      to="/support"
                      className={({ isActive }) =>
                        `nav-link${isActive ? " active" : ""}`
                      }
                    >
                      Support
                    </NavLink>

                    <NavLink
                      to="/reports"
                      className={({ isActive }) =>
                        `nav-link${isActive ? " active" : ""}`
                      }
                    >
                      Reports
                    </NavLink>
                  </>
                )}

                {isAdmin && (
                  <>
                    <NavLink
                      to="/admin/users"
                      className={({ isActive }) =>
                        `nav-link${isActive ? " active" : ""}`
                      }
                    >
                      Users
                    </NavLink>

                    <NavLink
                      to="/admin/reports"
                      className={({ isActive }) =>
                        `nav-link${isActive ? " active" : ""}`
                      }
                    >
                      Reports
                    </NavLink>

                    <NavLink
                      to="/admin/audit-logs"
                      className={({ isActive }) =>
                        `nav-link${isActive ? " active" : ""}`
                      }
                    >
                      Audit Logs
                    </NavLink>
                  </>
                )}
              </>
            )}

            {!user && (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </nav>

          <div className="navbar-right">
            <button
              onClick={toggleTheme}
              className="theme-btn"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg className="theme-btn-icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="theme-btn-icon" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}

              <span>{darkMode ? "Light" : "Dark"}</span>
            </button>

            {user && (
              <div className="user-chip">
                <div className="user-avatar">{initials}</div>

                <div style={{ minWidth: 0 }}>
                  <div className="user-name">
                    {user?.fullName || "User"}
                    {isAdmin && <span className="admin-badge">Admin</span>}
                  </div>

                  <div className="user-email">{user?.email}</div>
                </div>
              </div>
            )}

            {user && (
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;