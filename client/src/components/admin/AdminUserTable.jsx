import React from "react";
import { useTheme } from "../../context/useTheme";

const MOOD_EMOJI = {
  joy: "😄", calm: "😌", stress: "😤", anxiety: "😰",
  sadness: "😢", anger: "😡", fatigue: "😴", love: "🥰",
  fear: "😨", disgust: "🤢", surprise: "😲", neutral: "😐",
};

const MOOD_COLOR = {
  joy: "#fbbf24", calm: "#2dd4bf", stress: "#fb7185", anxiety: "#fb923c",
  sadness: "#a78bfa", anger: "#f87171", fatigue: "#94a3b8", love: "#f472b6",
  fear: "#a5b4fc", disgust: "#86efac", surprise: "#5eead4", neutral: "#94a3b8",
};

const getRisk = (count) =>
  count >= 5
    ? { label: "High", color: "#fb7185" }
    : count >= 1
    ? { label: "Moderate", color: "#fb923c" }
    : { label: "Low", color: "#34d399" };

const AdminUserTable = ({ users = [] }) => {
  const { darkMode } = useTheme();

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="aut-card">
        <div className="aut-header">
          <div>
            <p className="aut-eyebrow">User Management</p>
            <h2 className="aut-title">Users Overview</h2>
            <p className="aut-subtitle">
              Review user roles, emotional activity, and risk alerts.
            </p>
          </div>

          <span className="aut-count-badge">
            {users.length} User{users.length !== 1 ? "s" : ""}
          </span>
        </div>

        {!users.length ? (
          <div className="aut-empty">
            <div className="aut-empty-icon">👥</div>
            <p className="aut-empty-title">No users found</p>
            <p className="aut-empty-sub">
              User records will appear here once accounts are available.
            </p>
          </div>
        ) : (
          <div className="aut-table-wrap">
            <table className="aut-table">
              <thead>
                <tr className="aut-thead-row">
                  {["User", "Role", "Entries", "Alerts", "Latest Mood", "Risk Level"].map((h) => (
                    <th
                      key={h}
                      className={`aut-th${h === "Entries" || h === "Alerts" ? " aut-th-center" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {users.map((user, i) => {
                  const riskCount = user.highSupportCount || 0;
                  const latestMood = user.latestMood?.toLowerCase() || "neutral";
                  const role = user.role || "user";
                  const moodCount = user.moodCount || 0;
                  const risk = getRisk(riskCount);
                  const moodColor = MOOD_COLOR[latestMood] || "#94a3b8";
                  const initial = (user.fullName || user.name || "U")
                    .charAt(0)
                    .toUpperCase();

                  return (
                    <tr key={user._id || i} className="aut-row">
                      <td className="aut-td">
                        <div className="aut-user-cell">
                          <div className="aut-avatar">{initial}</div>
                          <div className="aut-user-info">
                            <p className="aut-user-name">
                              {user.fullName || user.name || "Unknown User"}
                            </p>
                            <p className="aut-user-email">{user.email || "No email"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="aut-td">
                        <span
                          className="aut-role-badge"
                          style={
                            role === "admin"
                              ? {
                                  color: "#f59e0b",
                                  background: "rgba(245,158,11,0.12)",
                                  borderColor: "rgba(245,158,11,0.3)",
                                }
                              : {}
                          }
                        >
                          {role}
                        </span>
                      </td>

                      <td className="aut-td aut-td-center">
                        <span className="aut-count-chip">{moodCount}</span>
                      </td>

                      <td className="aut-td aut-td-center">
                        <span
                          className="aut-count-chip"
                          style={
                            riskCount > 0
                              ? {
                                  color: "#fb7185",
                                  background: "rgba(244,63,94,0.12)",
                                  borderColor: "rgba(244,63,94,0.3)",
                                }
                              : {}
                          }
                        >
                          {riskCount}
                        </span>
                      </td>

                      <td className="aut-td">
                        <div
                          className="aut-mood-chip"
                          style={{
                            color: moodColor,
                            background: `${moodColor}14`,
                            borderColor: `${moodColor}33`,
                          }}
                        >
                          <span>{MOOD_EMOJI[latestMood] || "😐"}</span>
                          <span className="aut-mood-label">{latestMood}</span>
                        </div>
                      </td>

                      <td className="aut-td">
                        <span
                          className="aut-risk-badge"
                          style={{
                            color: risk.color,
                            background: `${risk.color}14`,
                            borderColor: `${risk.color}33`,
                          }}
                        >
                          <span
                            className="aut-risk-dot"
                            style={{ background: risk.color }}
                          />
                          {risk.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  .aut-card {
    border-radius: 24px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"};
    padding: 24px;
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    backdrop-filter: blur(22px);
    box-shadow: ${darkMode ? "0 22px 55px rgba(0,0,0,0.28)" : "0 22px 55px rgba(15,23,42,0.08)"};
  }

  .aut-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 20px;
  }

  .aut-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 6px;
  }

  .aut-title {
    font-size: 20px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.94)" : "#0f172a"};
    margin-bottom: 4px;
  }

  .aut-subtitle {
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
  }

  .aut-count-badge {
    padding: 6px 15px;
    border-radius: 999px;
    background: rgba(14,165,233,0.12);
    border: 1px solid rgba(14,165,233,0.28);
    color: #38bdf8;
    font-size: 12px;
    font-weight: 800;
  }

  .aut-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 54px 24px;
    text-align: center;
    border-radius: 18px;
    border: 1px dashed ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.12)"};
    background: ${darkMode ? "rgba(255,255,255,0.025)" : "rgba(15,23,42,0.025)"};
  }

  .aut-empty-icon {
    width: 58px;
    height: 58px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin-bottom: 14px;
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.055)"};
  }

  .aut-empty-title {
    font-size: 15px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.7)" : "#0f172a"};
    margin-bottom: 5px;
  }

  .aut-empty-sub {
    font-size: 12.5px;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.48)"};
    line-height: 1.6;
    max-width: 260px;
  }

  .aut-table-wrap {
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.08)"};
    overflow-x: auto;
  }

  .aut-table {
    min-width: 760px;
    width: 100%;
    border-collapse: collapse;
  }

  .aut-thead-row {
    background: ${darkMode ? "rgba(255,255,255,0.045)" : "rgba(15,23,42,0.045)"};
    border-bottom: 1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.08)"};
  }

  .aut-th {
    padding: 13px 15px;
    text-align: left;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    white-space: nowrap;
  }

  .aut-th-center {
    text-align: center;
  }

  .aut-row {
    border-bottom: 1px solid ${darkMode ? "rgba(255,255,255,0.045)" : "rgba(15,23,42,0.055)"};
    transition: background 0.18s ease;
  }

  .aut-row:last-child {
    border-bottom: none;
  }

  .aut-row:hover {
    background: ${darkMode ? "rgba(255,255,255,0.045)" : "rgba(14,165,233,0.035)"};
  }

  .aut-td {
    padding: 14px 15px;
    vertical-align: middle;
  }

  .aut-td-center {
    text-align: center;
  }

  .aut-user-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .aut-avatar {
    width: 40px;
    height: 40px;
    border-radius: 14px;
    flex-shrink: 0;
    background: linear-gradient(135deg,#0ea5e9,#6366f1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 800;
    color: #fff;
    box-shadow: 0 10px 22px rgba(14,165,233,0.22);
  }

  .aut-user-name {
    font-size: 13.5px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.86)" : "#0f172a"};
    margin-bottom: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 180px;
  }

  .aut-user-email {
    font-size: 11.5px;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.45)"};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 180px;
  }

  .aut-role-badge {
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)"};
    color: ${darkMode ? "rgba(255,255,255,0.52)" : "rgba(15,23,42,0.58)"};
    background: ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.045)"};
    text-transform: capitalize;
    letter-spacing: 0.04em;
  }

  .aut-count-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    padding: 5px 11px;
    border-radius: 999px;
    background: ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.045)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.09)"};
    font-size: 12px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.58)" : "rgba(15,23,42,0.62)"};
  }

  .aut-mood-chip,
  .aut-risk-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 5px 12px;
    border-radius: 999px;
    border: 1px solid;
    font-size: 11.5px;
    font-weight: 800;
    white-space: nowrap;
  }

  .aut-mood-label {
    text-transform: capitalize;
  }

  .aut-risk-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

export default AdminUserTable;