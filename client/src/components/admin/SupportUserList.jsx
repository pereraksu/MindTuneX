import React from "react";
import { useTheme } from "../../context/useTheme";

const getSupportTone = (user) => {
  const h = user.highSupportEntries || 0;
  const n = user.negativeEntries || 0;

  if (h >= 5 || n >= 8) {
    return { label: "Priority Support", color: "#fb7185", from: "#f43f5e", to: "#e11d48" };
  }

  if (h >= 2 || n >= 4) {
    return { label: "Monitor Closely", color: "#fb923c", from: "#f97316", to: "#f59e0b" };
  }

  return { label: "Needs Follow-up", color: "#38bdf8", from: "#0ea5e9", to: "#14b8a6" };
};

const SupportUserList = ({ users = [] }) => {
  const { darkMode } = useTheme();

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="sul-card">
        <div className="sul-header">
          <div>
            <p className="sul-eyebrow">Support Monitoring</p>
            <h2 className="sul-title">Users Needing Support</h2>
            <p className="sul-subtitle">
              Identified through emotional trends and risk indicators.
            </p>
          </div>

          <div className="sul-count-badge">
            <span className="sul-count-dot" />
            {users.length} User{users.length !== 1 ? "s" : ""}
          </div>
        </div>

        {!users.length ? (
          <div className="sul-empty">
            <div className="sul-empty-icon">✓</div>
            <p className="sul-empty-title">No users currently flagged</p>
            <p className="sul-empty-sub">
              All users appear emotionally stable at the moment.
            </p>
          </div>
        ) : (
          <div className="sul-list">
            {users.map((user, index) => {
              const tone = getSupportTone(user);
              const initials = (user.fullName || user.name || "U")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div key={user._id || index} className="sul-entry">
                  <div
                    className="sul-entry-glow"
                    style={{
                      background: `radial-gradient(circle, ${tone.color}22 0%, transparent 70%)`,
                    }}
                  />

                  <div
                    className="sul-entry-bar"
                    style={{
                      background: `linear-gradient(180deg, ${tone.from}, ${tone.to})`,
                    }}
                  />

                  <div className="sul-entry-body">
                    <div className="sul-entry-top">
                      <div className="sul-user-row">
                        <div
                          className="sul-avatar"
                          style={{
                            background: `linear-gradient(135deg, ${tone.from}22, ${tone.to}28)`,
                            borderColor: `${tone.color}35`,
                            color: tone.color,
                          }}
                        >
                          {initials}
                        </div>

                        <div className="sul-user-info">
                          <div className="sul-name-row">
                            <p className="sul-user-name">
                              {user.fullName || user.name || "Unknown User"}
                            </p>

                            <span
                              className="sul-priority-badge"
                              style={{
                                color: tone.color,
                                background: `${tone.color}14`,
                                borderColor: `${tone.color}33`,
                              }}
                            >
                              <span
                                className="sul-priority-dot"
                                style={{ background: tone.color }}
                              />
                              {tone.label}
                            </span>
                          </div>

                          <p className="sul-user-email">
                            {user.email || "No email available"}
                          </p>
                        </div>
                      </div>

                      <div className="sul-status-col">
                        <p className="sul-status-label">Status</p>
                        <div className="sul-status-row">
                          <span
                            className="sul-status-dot"
                            style={{
                              background: tone.color,
                              boxShadow: `0 0 10px ${tone.color}88`,
                            }}
                          />
                          <span className="sul-status-text">Active Monitoring</span>
                        </div>
                      </div>
                    </div>

                    <div className="sul-stats-grid">
                      <StatBox title="Total Entries" value={user.totalEntries || 0} />
                      <StatBox
                        title="High Support"
                        value={user.highSupportEntries || 0}
                        accentColor="#fb7185"
                      />
                      <StatBox
                        title="Negative Signals"
                        value={user.negativeEntries || 0}
                        accentColor="#fb923c"
                      />
                    </div>

                    <div className="sul-entry-footer">
                      <span
                        className="sul-footer-dot"
                        style={{
                          background: tone.color,
                          boxShadow: `0 0 10px ${tone.color}88`,
                        }}
                      />
                      <p className="sul-footer-text">
                        Recommended for follow-up and emotional support review.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

const StatBox = ({ title, value, accentColor }) => (
  <div className="sul-stat-box">
    <p className="sul-stat-label">{title}</p>
    <p className="sul-stat-val" style={accentColor ? { color: accentColor } : {}}>
      {value}
    </p>
  </div>
);

const STYLES = (darkMode) => `
  .sul-card {
    border-radius: 24px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"};
    padding: 24px;
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    backdrop-filter: blur(22px);
    box-shadow: ${darkMode ? "0 22px 55px rgba(0,0,0,0.28)" : "0 22px 55px rgba(15,23,42,0.08)"};
  }

  .sul-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 20px;
  }

  .sul-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 6px;
  }

  .sul-title {
    font-size: 20px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.94)" : "#0f172a"};
    margin-bottom: 4px;
  }

  .sul-subtitle {
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
  }

  .sul-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 15px;
    border-radius: 999px;
    background: rgba(249,115,22,0.12);
    border: 1px solid rgba(249,115,22,0.3);
    font-size: 12px;
    font-weight: 800;
    color: #fb923c;
  }

  .sul-count-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f97316;
    animation: sul-pulse 1.6s ease-in-out infinite;
  }

  @keyframes sul-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.35; transform: scale(0.82); }
  }

  .sul-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
    border-radius: 18px;
    border: 1px dashed ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.12)"};
    background: ${darkMode ? "rgba(255,255,255,0.025)" : "rgba(15,23,42,0.025)"};
  }

  .sul-empty-icon {
    width: 58px;
    height: 58px;
    border-radius: 18px;
    background: rgba(52,211,153,0.12);
    border: 1px solid rgba(52,211,153,0.28);
    color: #34d399;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    font-weight: 900;
    margin-bottom: 14px;
  }

  .sul-empty-title {
    font-size: 15px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.72)" : "#0f172a"};
    margin-bottom: 5px;
  }

  .sul-empty-sub {
    font-size: 12.5px;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.48)"};
    line-height: 1.6;
    max-width: 260px;
  }

  .sul-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-height: 620px;
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: ${darkMode ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.16)"} transparent;
  }

  .sul-list::-webkit-scrollbar {
    width: 5px;
  }

  .sul-list::-webkit-scrollbar-thumb {
    background: ${darkMode ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.16)"};
    border-radius: 999px;
  }

  .sul-entry {
    position: relative;
    display: flex;
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.72)"};
    transition: all 0.22s ease;
  }

  .sul-entry:hover {
    transform: translateY(-2px);
    border-color: ${darkMode ? "rgba(255,255,255,0.14)" : "rgba(249,115,22,0.2)"};
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.92)"};
    box-shadow: ${darkMode ? "0 18px 40px rgba(0,0,0,0.24)" : "0 18px 40px rgba(15,23,42,0.08)"};
  }

  .sul-entry-glow {
    position: absolute;
    right: -90px;
    top: -90px;
    width: 230px;
    height: 230px;
    pointer-events: none;
  }

  .sul-entry-bar {
    width: 4px;
    flex-shrink: 0;
    opacity: 0.95;
  }

  .sul-entry-body {
    position: relative;
    z-index: 1;
    flex: 1;
    padding: 18px 20px;
    min-width: 0;
  }

  .sul-entry-top {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-bottom: 14px;
    margin-bottom: 14px;
    border-bottom: 1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"};
  }

  @media(min-width: 640px) {
    .sul-entry-top {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
    }
  }

  .sul-user-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
  }

  .sul-avatar {
    width: 44px;
    height: 44px;
    border-radius: 15px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 0.05em;
  }

  .sul-user-info {
    min-width: 0;
  }

  .sul-name-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .sul-user-name {
    font-size: 13.5px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.86)" : "#0f172a"};
  }

  .sul-user-email {
    font-size: 11.5px;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.46)"};
  }

  .sul-priority-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 11px;
    border-radius: 999px;
    border: 1px solid;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.04em;
  }

  .sul-priority-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .sul-status-col {
    flex-shrink: 0;
    text-align: left;
  }

  @media(min-width: 640px) {
    .sul-status-col {
      text-align: right;
    }
  }

  .sul-status-label {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.32)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 6px;
  }

  .sul-status-row {
    display: flex;
    align-items: center;
    gap: 7px;
    justify-content: flex-start;
  }

  @media(min-width: 640px) {
    .sul-status-row {
      justify-content: flex-end;
    }
  }

  .sul-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .sul-status-text {
    font-size: 12px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.52)" : "rgba(15,23,42,0.58)"};
  }

  .sul-stats-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 10px;
    margin-bottom: 13px;
  }

  @media(min-width: 520px) {
    .sul-stats-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .sul-stat-box {
    background: ${darkMode ? "rgba(255,255,255,0.045)" : "rgba(15,23,42,0.035)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.075)" : "rgba(15,23,42,0.075)"};
    border-radius: 14px;
    padding: 13px 14px;
  }

  .sul-stat-label {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.28)" : "rgba(15,23,42,0.4)"};
    margin-bottom: 7px;
  }

  .sul-stat-val {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: ${darkMode ? "rgba(255,255,255,0.86)" : "#0f172a"};
    line-height: 1;
  }

  .sul-entry-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 11px;
    border-top: 1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)"};
  }

  .sul-footer-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .sul-footer-text {
    font-size: 11.5px;
    font-weight: 600;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.46)"};
  }
`;

export default SupportUserList;