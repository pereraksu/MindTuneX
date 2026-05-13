import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import {
  getAdminUsersApi,
  updateUserRoleApi,
  deleteUserApi,
} from "../api/adminApi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";

const ManageUsersPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode } = useTheme();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAdminUsersApi();

      const data = Array.isArray(res)
        ? res
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : [];

      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Unable to fetch user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (String(user?._id) === String(id)) {
      alert("You cannot delete your own admin account.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUserApi(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    try {
      await updateUserRoleApi(id, newRole);

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Role update failed:", err);
      alert("Role update failed");
    }
  };

  useEffect(() => {
    loadUsers();

    const interval = setInterval(loadUsers, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="mu-root">
        <div className="mu-glow mu-glow-1" />
        <div className="mu-glow mu-glow-2" />
        <div className="mu-grid-bg" />

        <Sidebar forceAdmin />

        <div className="mu-body">
          <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

          <main className="mu-main">
            <div className="mu-container">
              <section className="mu-hero">
                <div className="mu-hero-line" />

                <div className="mu-hero-inner">
                  <div>
                    <p className="mu-eyebrow">User Administration</p>

                    <h1 className="mu-title">
                      Manage <span>Users</span>
                    </h1>

                    <p className="mu-subtitle">
                      View registered accounts, inspect roles, and manage user
                      access through a central administrative interface.
                    </p>

                    <div className="mu-pills">
                      <span>👑 Admin: {user?.fullName || "Administrator"}</span>
                      <span>👥 Total Users: {users.length}</span>
                      <span>🔄 Auto refresh: 30s</span>
                    </div>
                  </div>

                  <button onClick={loadUsers} className="mu-refresh">
                    ↻ Refresh Users
                  </button>
                </div>
              </section>

              {loading && (
                <div className="mu-state-card">
                  <div className="mu-spinner" />
                  <p>Loading user records...</p>
                </div>
              )}

              {!loading && error && (
                <div className="mu-error-card">
                  <div className="mu-error-icon">⚠️</div>
                  <h3>Unable to load users</h3>
                  <p>{error}</p>
                  <button onClick={loadUsers}>Try Again</button>
                </div>
              )}

              {!loading && !error && users.length === 0 && (
                <div className="mu-empty-card">
                  <div className="mu-empty-icon">👥</div>
                  <h3>No users found</h3>
                  <p>Registered accounts will appear here once available.</p>
                </div>
              )}

              {!loading && !error && users.length > 0 && (
                <section className="mu-table-card">
                  <div className="mu-table-header">
                    <div>
                      <p className="mu-eyebrow">User Directory</p>
                      <h2>Registered Accounts</h2>
                    </div>

                    <span className="mu-count-badge">
                      {users.length} record{users.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="mu-table-wrap">
                    <table className="mu-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th className="mu-right">Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {users.map((u, index) => {
                          const displayName = u.fullName || u.name || "N/A";
                          const role = (u.role || "user").toLowerCase();
                          const initial = displayName.charAt(0).toUpperCase();
                          const isCurrentUser =
                            String(user?._id) === String(u._id);

                          return (
                            <tr key={u._id || index}>
                              <td>
                                <div className="mu-user-cell">
                                  <div className="mu-avatar">{initial}</div>

                                  <div>
                                    <p className="mu-user-name">
                                      {displayName}
                                      {isCurrentUser && (
                                        <span className="mu-you-badge">You</span>
                                      )}
                                    </p>
                                    <p className="mu-user-id">
                                      ID: {u._id || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <span className="mu-email">
                                  {u.email || "No email"}
                                </span>
                              </td>

                              <td>
                                <span
                                  className={`mu-role ${
                                    role === "admin"
                                      ? "mu-role-admin"
                                      : "mu-role-user"
                                  }`}
                                >
                                  {role}
                                </span>
                              </td>

                              <td className="mu-right">
                                <div className="mu-actions">
                                  <button
                                    type="button"
                                    className="mu-edit"
                                    onClick={() =>
                                      handleRoleChange(u._id, role)
                                    }
                                  >
                                    {role === "admin"
                                      ? "Make User"
                                      : "Make Admin"}
                                  </button>

                                  {!isCurrentUser && (
                                    <button
                                      type="button"
                                      className="mu-delete"
                                      onClick={() => handleDelete(u._id)}
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>

            <div className="mu-footer-wrap">
              <Footer admin />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

  .mu-root {
    display: flex;
    min-height: 100svh;
    background: ${
      darkMode
        ? "radial-gradient(circle at top left, rgba(245,158,11,0.1), transparent 34%), #080c14"
        : "linear-gradient(135deg, #fff7ed 0%, #f8fafc 48%, #eef9ff 100%)"
    };
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
    overflow-x: hidden;
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .mu-glow {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(6px);
  }

  .mu-glow-1 {
    top: -130px;
    left: -110px;
    width: 520px;
    height: 520px;
    background: radial-gradient(circle, rgba(245,158,11,0.13), transparent 68%);
  }

  .mu-glow-2 {
    bottom: -120px;
    right: -110px;
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(249,115,22,0.1), transparent 68%);
  }

  .mu-grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(${darkMode ? "rgba(255,255,255,0.018)" : "rgba(15,23,42,0.025)"} 1px, transparent 1px),
      linear-gradient(90deg, ${darkMode ? "rgba(255,255,255,0.018)" : "rgba(15,23,42,0.025)"} 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: radial-gradient(circle at center, black, transparent 75%);
  }

  .mu-body {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .mu-main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
  }

  @media (min-width: 1024px) {
    .mu-main {
      padding: 38px 42px;
    }
  }

  .mu-container {
    max-width: 1220px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .mu-hero,
  .mu-table-card,
  .mu-state-card,
  .mu-error-card,
  .mu-empty-card {
    border-radius: 28px;
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"
    };
    background: ${
      darkMode ? "rgba(15,23,42,0.74)" : "rgba(255,255,255,0.78)"
    };
    backdrop-filter: blur(24px);
    box-shadow: ${
      darkMode
        ? "0 26px 70px rgba(0,0,0,0.25)"
        : "0 24px 60px rgba(15,23,42,0.09)"
    };
    animation: muFadeUp 0.55s ease both;
  }

  @keyframes muFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .mu-hero {
    position: relative;
    overflow: hidden;
    padding: 34px;
  }

  .mu-hero::after {
    content: "";
    position: absolute;
    right: -90px;
    top: -90px;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%);
    pointer-events: none;
  }

  .mu-hero-line {
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, #f59e0b, #f97316, #fbbf24);
  }

  .mu-hero-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  @media (min-width: 1024px) {
    .mu-hero-inner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .mu-eyebrow {
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #f59e0b;
    margin-bottom: 10px;
  }

  .mu-title {
    font-size: clamp(34px, 5vw, 52px);
    font-weight: 950;
    line-height: 1.04;
    letter-spacing: -0.055em;
    color: ${darkMode ? "rgba(255,255,255,0.96)" : "#0f172a"};
    margin-bottom: 14px;
  }

  .mu-title span {
    background: linear-gradient(135deg, #f59e0b, #fbbf24);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .mu-subtitle {
    max-width: 680px;
    font-size: 14px;
    line-height: 1.75;
    color: ${darkMode ? "rgba(255,255,255,0.44)" : "rgba(15,23,42,0.56)"};
    font-weight: 550;
    margin-bottom: 20px;
  }

  .mu-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }

  .mu-pills span {
    padding: 7px 14px;
    border-radius: 999px;
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"
    };
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"};
    color: ${darkMode ? "rgba(255,255,255,0.62)" : "rgba(15,23,42,0.62)"};
    font-size: 11.5px;
    font-weight: 800;
  }

  .mu-refresh {
    flex-shrink: 0;
    padding: 13px 22px;
    border-radius: 999px;
    border: none;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    color: #fff;
    font-family: inherit;
    font-size: 13px;
    font-weight: 950;
    cursor: pointer;
    box-shadow: 0 16px 34px rgba(245,158,11,0.25);
    transition: all 0.2s ease;
  }

  .mu-refresh:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 42px rgba(245,158,11,0.36);
  }

  .mu-state-card,
  .mu-error-card,
  .mu-empty-card {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 38px 24px;
    text-align: center;
  }

  .mu-spinner {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 3px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.1)"};
    border-top-color: #f59e0b;
    animation: muSpin 0.75s linear infinite;
  }

  @keyframes muSpin {
    to { transform: rotate(360deg); }
  }

  .mu-state-card p,
  .mu-empty-card p {
    color: ${darkMode ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.55)"};
    font-weight: 700;
    font-size: 13px;
  }

  .mu-error-card {
    border-color: rgba(244,63,94,0.25);
    background: rgba(244,63,94,0.075);
  }

  .mu-error-icon,
  .mu-empty-icon {
    width: 58px;
    height: 58px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin-bottom: 4px;
  }

  .mu-error-icon {
    background: rgba(244,63,94,0.13);
    border: 1px solid rgba(244,63,94,0.28);
  }

  .mu-empty-icon {
    background: ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.045)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
  }

  .mu-error-card h3,
  .mu-empty-card h3 {
    font-size: 17px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.9)" : "#0f172a"};
  }

  .mu-error-card p {
    color: rgba(251,113,133,0.78);
    font-size: 13px;
    font-weight: 700;
  }

  .mu-error-card button {
    padding: 10px 22px;
    border-radius: 999px;
    border: 1px solid rgba(244,63,94,0.3);
    background: rgba(244,63,94,0.13);
    color: #fb7185;
    font-family: inherit;
    font-weight: 950;
    cursor: pointer;
  }

  .mu-table-card {
    padding: 24px;
  }

  .mu-table-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 20px;
  }

  .mu-table-header h2 {
    font-size: 22px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.92)" : "#0f172a"};
    letter-spacing: -0.03em;
  }

  .mu-count-badge {
    padding: 7px 15px;
    border-radius: 999px;
    background: rgba(14,165,233,0.1);
    border: 1px solid rgba(14,165,233,0.25);
    color: #38bdf8;
    font-size: 12px;
    font-weight: 950;
  }

  .mu-table-wrap {
    overflow-x: auto;
    border-radius: 18px;
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.08)"
    };
  }

  .mu-table {
    width: 100%;
    min-width: 700px;
    border-collapse: collapse;
  }

  .mu-table thead {
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"};
  }

  .mu-table th {
    padding: 14px 16px;
    text-align: left;
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.5)"};
  }

  .mu-table td {
    padding: 15px 16px;
    border-top: 1px solid ${
      darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.06)"
    };
    vertical-align: middle;
  }

  .mu-table tbody tr {
    transition: background 0.18s ease;
  }

  .mu-table tbody tr:hover {
    background: ${darkMode ? "rgba(255,255,255,0.045)" : "rgba(15,23,42,0.035)"};
  }

  .mu-right {
    text-align: right !important;
  }

  .mu-user-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mu-avatar {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 950;
    flex-shrink: 0;
  }

  .mu-user-name {
    font-size: 13.5px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.86)" : "#0f172a"};
    margin-bottom: 3px;
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mu-you-badge {
    display: inline-flex;
    margin-left: 8px;
    padding: 2px 8px;
    border-radius: 999px;
    background: rgba(34,197,94,0.12);
    border: 1px solid rgba(34,197,94,0.28);
    color: #22c55e;
    font-size: 10px;
    font-weight: 950;
    vertical-align: middle;
  }

  .mu-user-id {
    font-size: 10.5px;
    color: ${darkMode ? "rgba(255,255,255,0.26)" : "rgba(15,23,42,0.42)"};
    font-family: monospace;
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mu-email {
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.46)" : "rgba(15,23,42,0.6)"};
    font-weight: 650;
  }

  .mu-role {
    display: inline-flex;
    padding: 5px 12px;
    border-radius: 999px;
    border: 1px solid;
    font-size: 11px;
    font-weight: 950;
    letter-spacing: 0.04em;
    text-transform: capitalize;
  }

  .mu-role-admin {
    color: #fbbf24;
    background: rgba(245,158,11,0.11);
    border-color: rgba(245,158,11,0.28);
  }

  .mu-role-user {
    color: ${darkMode ? "rgba(255,255,255,0.48)" : "rgba(15,23,42,0.58)"};
    background: ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.045)"};
    border-color: ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)"};
  }

  .mu-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .mu-edit,
  .mu-delete {
    padding: 7px 14px;
    border-radius: 999px;
    font-family: inherit;
    font-size: 11.5px;
    font-weight: 950;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .mu-edit {
    border: 1px solid rgba(14,165,233,0.25);
    background: rgba(14,165,233,0.1);
    color: #38bdf8;
  }

  .mu-edit:hover {
    background: rgba(14,165,233,0.18);
  }

  .mu-delete {
    border: 1px solid rgba(244,63,94,0.25);
    background: rgba(244,63,94,0.1);
    color: #fb7185;
  }

  .mu-delete:hover {
    background: rgba(244,63,94,0.18);
  }

  .mu-footer-wrap {
    width: 100%;
    max-width: 1280px;
    margin: 64px auto 24px;
  }

  @media (max-width: 640px) {
    .mu-main {
      padding: 24px 16px;
    }

    .mu-hero {
      padding: 28px 22px;
      border-radius: 24px;
    }

    .mu-title {
      font-size: 36px;
    }

    .mu-refresh {
      width: 100%;
      justify-content: center;
    }
  }
`;

export default ManageUsersPage;