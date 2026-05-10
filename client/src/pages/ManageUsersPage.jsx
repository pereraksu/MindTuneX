import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { getAdminUsersApi } from "../api/adminApi";
import { useAuth } from "../context/AuthContext";

const ManageUsersPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminUsersApi();
      setUsers(res?.data?.data || res?.data || res || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Unable to fetch user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
      <style>{STYLES}</style>

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

                          return (
                            <tr key={u._id || index}>
                              <td>
                                <div className="mu-user-cell">
                                  <div className="mu-avatar">{initial}</div>

                                  <div>
                                    <p className="mu-user-name">{displayName}</p>
                                    <p className="mu-user-id">ID: {u._id || "N/A"}</p>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <span className="mu-email">{u.email || "No email"}</span>
                              </td>

                              <td>
                                <span
                                  className={`mu-role ${
                                    role === "admin" ? "mu-role-admin" : "mu-role-user"
                                  }`}
                                >
                                  {role}
                                </span>
                              </td>

                              <td className="mu-right">
                                <div className="mu-actions">
                                  <button className="mu-edit">Edit Role</button>
                                  <button className="mu-delete">Delete</button>
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
          </main>
        </div>
      </div>
    </>
  );
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

  .mu-root {
    display: flex;
    min-height: 100svh;
    background: #050810;
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
    overflow-x: hidden;
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
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
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
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(24px);
    box-shadow: 0 26px 70px rgba(0,0,0,0.25);
    animation: muFadeUp 0.55s ease both;
  }

  @keyframes muFadeUp {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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
    color: #fbbf24;
    margin-bottom: 10px;
  }

  .mu-title {
    font-size: clamp(34px, 5vw, 52px);
    font-weight: 950;
    line-height: 1.04;
    letter-spacing: -0.055em;
    color: rgba(255,255,255,0.96);
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
    color: rgba(255,255,255,0.44);
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
    border: 1px solid rgba(255,255,255,0.09);
    background: rgba(255,255,255,0.055);
    color: rgba(255,255,255,0.62);
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
    border: 3px solid rgba(255,255,255,0.09);
    border-top-color: #f59e0b;
    animation: muSpin 0.75s linear infinite;
  }

  @keyframes muSpin {
    to {
      transform: rotate(360deg);
    }
  }

  .mu-state-card p,
  .mu-empty-card p {
    color: rgba(255,255,255,0.4);
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
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.09);
  }

  .mu-error-card h3,
  .mu-empty-card h3 {
    font-size: 17px;
    font-weight: 950;
    color: rgba(255,255,255,0.9);
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
    color: rgba(255,255,255,0.92);
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
    border: 1px solid rgba(255,255,255,0.07);
  }

  .mu-table {
    width: 100%;
    min-width: 700px;
    border-collapse: collapse;
  }

  .mu-table thead {
    background: rgba(255,255,255,0.055);
  }

  .mu-table th {
    padding: 14px 16px;
    text-align: left;
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.34);
  }

  .mu-table td {
    padding: 15px 16px;
    border-top: 1px solid rgba(255,255,255,0.055);
    vertical-align: middle;
  }

  .mu-table tbody tr {
    transition: background 0.18s ease;
  }

  .mu-table tbody tr:hover {
    background: rgba(255,255,255,0.045);
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
    color: rgba(255,255,255,0.86);
    margin-bottom: 3px;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mu-user-id {
    font-size: 10.5px;
    color: rgba(255,255,255,0.26);
    font-family: monospace;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mu-email {
    font-size: 13px;
    color: rgba(255,255,255,0.46);
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
    color: rgba(255,255,255,0.48);
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.1);
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