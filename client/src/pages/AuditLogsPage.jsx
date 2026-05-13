import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Search,
  Trash2,
  UserCog,
  AlertTriangle,
  RefreshCcw,
  Clock,
  Activity,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import { getAuditLogsApi } from "../api/adminApi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";

export default function AuditLogsPage() {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode } = useTheme();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAuditLogsApi();
      setLogs(res?.data || []);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Audit logs load failed:", err);
      setError("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const keyword = search.toLowerCase();

      const adminName =
        log.adminId?.fullName || log.adminId?.name || log.adminId?.email || "";

      const targetName =
        log.targetUserId?.fullName ||
        log.targetUserId?.name ||
        log.targetUserId?.email ||
        "";

      const actionMatch =
        actionFilter === "all" || log.action === actionFilter;

      const searchMatch =
        log.action?.toLowerCase().includes(keyword) ||
        adminName.toLowerCase().includes(keyword) ||
        targetName.toLowerCase().includes(keyword) ||
        JSON.stringify(log.details || {}).toLowerCase().includes(keyword);

      return actionMatch && searchMatch;
    });
  }, [logs, search, actionFilter]);

  const formatAction = (action) =>
    String(action || "")
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-LK", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionIcon = (action) => {
    if (action === "DELETE_USER") return <Trash2 size={16} />;
    if (action === "CHANGE_USER_ROLE") return <UserCog size={16} />;
    if (action === "REVIEW_ALERT_ACTION") return <AlertTriangle size={16} />;
    return <ShieldCheck size={16} />;
  };

  const deleteCount = logs.filter((l) => l.action === "DELETE_USER").length;
  const roleCount = logs.filter((l) => l.action === "CHANGE_USER_ROLE").length;
  const alertCount = logs.filter(
    (l) => l.action === "REVIEW_ALERT_ACTION"
  ).length;

  return (
    <>
      <style>{AUDIT_STYLES(darkMode)}</style>

      <div className="audit-root">
        <div className="audit-glow audit-glow-1" />
        <div className="audit-glow audit-glow-2" />
        <div className="audit-glow audit-glow-3" />

        <Sidebar forceAdmin />

        <div className="audit-body">
          <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

          <main className="audit-main">
            <div className="audit-container">
              <section className="audit-hero">
                <div className="audit-hero-bar" />

                <div className="audit-hero-inner">
                  <div>
                    <p className="audit-eyebrow admin">
                      Administrative Accountability
                    </p>

                    <h1 className="audit-title">
                      Audit <span>Logs</span>
                    </h1>

                    <p className="audit-sub">
                      Track sensitive admin actions such as user deletion, role
                      changes, alert reviews, and other privileged activities.
                    </p>

                    <div className="audit-pills">
                      <span className="audit-pill">
                        <span className="audit-pill-dot" />
                        {user?.fullName || "Administrator"}
                      </span>

                      <span className="audit-pill">
                        🕐 {lastRefresh.toLocaleTimeString()}
                      </span>

                      <span className="audit-pill secure">
                        <ShieldCheck size={13} />
                        Security Trail Enabled
                      </span>
                    </div>
                  </div>

                  <button onClick={fetchLogs} className="audit-refresh-btn">
                    <RefreshCcw size={16} />
                    Refresh
                  </button>
                </div>
              </section>

              <section className="audit-summary-grid">
                <div className="audit-stat-card">
                  <Activity size={22} />
                  <span>Total Logs</span>
                  <strong>{logs.length}</strong>
                </div>

                <div className="audit-stat-card">
                  <Search size={22} />
                  <span>Shown Results</span>
                  <strong>{filteredLogs.length}</strong>
                </div>

                <div className="audit-stat-card danger">
                  <Trash2 size={22} />
                  <span>Delete Actions</span>
                  <strong>{deleteCount}</strong>
                </div>

                <div className="audit-stat-card purple">
                  <UserCog size={22} />
                  <span>Role Changes</span>
                  <strong>{roleCount}</strong>
                </div>

                <div className="audit-stat-card warning">
                  <AlertTriangle size={22} />
                  <span>Alert Reviews</span>
                  <strong>{alertCount}</strong>
                </div>
              </section>

              <section className="audit-panel">
                <div className="audit-controls">
                  <div className="audit-search">
                    <Search size={17} />
                    <input
                      type="text"
                      placeholder="Search logs, admin, user, action..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                  >
                    <option value="all">All Actions</option>
                    <option value="DELETE_USER">Delete User</option>
                    <option value="CHANGE_USER_ROLE">Change User Role</option>
                    <option value="REVIEW_ALERT_ACTION">
                      Review Alert Action
                    </option>
                    <option value="SUSPEND_USER">Suspend User</option>
                    <option value="RESTORE_USER">Restore User</option>
                  </select>
                </div>

                {error && <div className="audit-error">{error}</div>}

                {loading ? (
                  <div className="audit-empty">Loading audit logs...</div>
                ) : filteredLogs.length === 0 ? (
                  <div className="audit-empty">No audit logs found.</div>
                ) : (
                  <div className="audit-table-wrap">
                    <table className="audit-table">
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>Admin</th>
                          <th>Target User</th>
                          <th>Details</th>
                          <th>Time</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredLogs.map((log) => (
                          <tr key={log._id}>
                            <td>
                              <div className={`audit-action ${log.action}`}>
                                {getActionIcon(log.action)}
                                {formatAction(log.action)}
                              </div>
                            </td>

                            <td>
                              <div className="audit-user">
                                <strong>
                                  {log.adminId?.fullName ||
                                    log.adminId?.name ||
                                    "Unknown Admin"}
                                </strong>
                                <span>{log.adminId?.email || "No email"}</span>
                              </div>
                            </td>

                            <td>
                              <div className="audit-user">
                                <strong>
                                  {log.targetUserId?.fullName ||
                                    log.targetUserId?.name ||
                                    "N/A"}
                                </strong>
                                <span>
                                  {log.targetUserId?.email || "No target user"}
                                </span>
                              </div>
                            </td>

                            <td>
                              <pre className="audit-details">
                                {JSON.stringify(log.details || {}, null, 2)}
                              </pre>
                            </td>

                            <td>
                              <div className="audit-time">
                                <Clock size={14} />
                                {formatDate(log.createdAt)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>

            <div className="audit-footer-wrap">
              <Footer admin />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

const AUDIT_STYLES = (darkMode) => `
  .audit-root {
    display: flex;
    min-height: 100svh;
    position: relative;
    overflow-x: hidden;
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    background: ${
      darkMode
        ? "radial-gradient(circle at top left, rgba(245,158,11,0.1), transparent 34%), #080c14"
        : "linear-gradient(135deg, #fff7ed 0%, #f8fafc 48%, #eef9ff 100%)"
    };
    color: ${darkMode ? "rgba(255,255,255,0.92)" : "#0f172a"};
  }

  .audit-glow {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .audit-glow-1 {
    top: -120px;
    left: -100px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(245,158,11,0.14), transparent 65%);
  }

  .audit-glow-2 {
    top: 30%;
    right: -120px;
    width: 440px;
    height: 440px;
    background: radial-gradient(circle, rgba(249,115,22,0.1), transparent 65%);
  }

  .audit-glow-3 {
    bottom: -80px;
    left: 20%;
    width: 380px;
    height: 380px;
    background: radial-gradient(circle, rgba(245,158,11,0.07), transparent 65%);
  }

  .audit-body {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .audit-main {
    flex: 1;
    padding: 36px 40px;
    overflow-y: auto;
  }

  .audit-container {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .audit-hero,
  .audit-panel,
  .audit-stat-card {
    position: relative;
    overflow: hidden;
    border-radius: 26px;
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"
    };
    background: ${
      darkMode ? "rgba(15,23,42,0.74)" : "rgba(255,255,255,0.78)"
    };
    backdrop-filter: blur(22px);
    box-shadow: ${
      darkMode
        ? "0 24px 60px rgba(0,0,0,0.3)"
        : "0 24px 60px rgba(15,23,42,0.08)"
    };
  }

  .audit-hero {
    padding: 32px;
  }

  .audit-hero-bar {
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, #f59e0b, #f97316, #fbbf24);
  }

  .audit-hero-inner {
    display: flex;
    justify-content: space-between;
    gap: 22px;
    align-items: center;
  }

  .audit-eyebrow {
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    margin-bottom: 9px;
  }

  .audit-eyebrow.admin {
    color: #f59e0b;
  }

  .audit-title {
    font-size: clamp(34px, 4vw, 50px);
    font-weight: 950;
    line-height: 1.02;
    letter-spacing: -0.045em;
    color: ${darkMode ? "rgba(255,255,255,0.96)" : "#0f172a"};
    margin: 0 0 13px;
  }

  .audit-title span {
    background: linear-gradient(135deg, #f59e0b, #fbbf24);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .audit-sub {
    max-width: 690px;
    font-size: 13.5px;
    line-height: 1.75;
    color: ${darkMode ? "rgba(255,255,255,0.44)" : "rgba(15,23,42,0.56)"};
    margin-bottom: 18px;
  }

  .audit-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }

  .audit-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 15px;
    border-radius: 999px;
    background: ${
      darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"
    };
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"
    };
    font-size: 11.5px;
    font-weight: 850;
    color: ${darkMode ? "rgba(255,255,255,0.52)" : "rgba(15,23,42,0.58)"};
  }

  .audit-pill.secure {
    color: #34d399;
    background: rgba(52,211,153,0.1);
    border-color: rgba(52,211,153,0.25);
  }

  .audit-pill-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #f59e0b;
    animation: audit-pulse 1.9s ease-in-out infinite;
  }

  @keyframes audit-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.38; transform: scale(0.78); }
  }

  .audit-refresh-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 42px;
    padding: 11px 22px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
    font-weight: 950;
    color: #fff;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    box-shadow: 0 15px 30px rgba(245,158,11,0.26);
  }

  .audit-summary-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
  }

  .audit-stat-card {
    padding: 22px;
  }

  .audit-stat-card svg {
    color: #f59e0b;
    margin-bottom: 14px;
  }

  .audit-stat-card span {
    display: block;
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 8px;
  }

  .audit-stat-card strong {
    font-size: 34px;
    font-weight: 950;
    line-height: 1;
    color: ${darkMode ? "rgba(255,255,255,0.92)" : "#0f172a"};
  }

  .audit-stat-card.danger svg {
    color: #fb7185;
  }

  .audit-stat-card.purple svg {
    color: #a78bfa;
  }

  .audit-stat-card.warning svg {
    color: #f59e0b;
  }

  .audit-panel {
    padding: 22px;
  }

  .audit-controls {
    display: grid;
    grid-template-columns: 1fr 240px;
    gap: 14px;
    margin-bottom: 18px;
  }

  .audit-search {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 52px;
    padding: 0 16px;
    border-radius: 18px;
    background: ${
      darkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.8)"
    };
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"
    };
  }

  .audit-search input,
  .audit-controls select {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.86)" : "#0f172a"};
  }

  .audit-controls select {
    border-radius: 18px;
    padding: 0 14px;
    min-height: 52px;
    background: ${
      darkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.8)"
    };
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"
    };
  }

  .audit-error {
    margin-bottom: 16px;
    padding: 14px 16px;
    border-radius: 18px;
    background: rgba(244,63,94,0.1);
    border: 1px solid rgba(244,63,94,0.22);
    color: #fb7185;
    font-weight: 900;
  }

  .audit-table-wrap {
    overflow-x: auto;
  }

  .audit-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 1050px;
  }

  .audit-table th {
    text-align: left;
    padding: 16px;
    font-size: 10px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.45)"};
    border-bottom: 1px solid ${
      darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"
    };
  }

  .audit-table td {
    padding: 16px;
    vertical-align: top;
    border-bottom: 1px solid ${
      darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"
    };
  }

  .audit-action {
    width: fit-content;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 11px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 950;
    white-space: nowrap;
    background: rgba(14,165,233,0.1);
    color: #38bdf8;
  }

  .audit-action.DELETE_USER {
    background: rgba(244,63,94,0.1);
    color: #fb7185;
  }

  .audit-action.CHANGE_USER_ROLE {
    background: rgba(139,92,246,0.12);
    color: #a78bfa;
  }

  .audit-action.REVIEW_ALERT_ACTION {
    background: rgba(245,158,11,0.12);
    color: #f59e0b;
  }

  .audit-user strong {
    display: block;
    font-size: 13px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.9)" : "#0f172a"};
  }

  .audit-user span {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    font-weight: 750;
    color: ${darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.52)"};
  }

  .audit-details {
    max-width: 320px;
    max-height: 120px;
    overflow: auto;
    margin: 0;
    padding: 12px;
    border-radius: 14px;
    background: ${
      darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.04)"
    };
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)"
    };
    font-size: 12px;
    line-height: 1.5;
    color: ${darkMode ? "rgba(255,255,255,0.62)" : "rgba(15,23,42,0.72)"};
    white-space: pre-wrap;
  }

  .audit-time {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 850;
    color: ${darkMode ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.58)"};
    white-space: nowrap;
  }

  .audit-empty {
    padding: 54px 20px;
    text-align: center;
    font-size: 14px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.52)"};
  }

  .audit-footer-wrap {
    width: 100%;
    max-width: 1280px;
    margin: 64px auto 24px;
  }

  @media (max-width: 1100px) {
    .audit-summary-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .audit-hero-inner {
      flex-direction: column;
      align-items: flex-start;
    }

    .audit-controls {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .audit-main {
      padding: 24px 18px;
    }

    .audit-summary-grid {
      grid-template-columns: 1fr;
    }

    .audit-hero {
      padding: 26px;
    }
  }
`;