import React from "react";
import { useTheme } from "../../context/useTheme";

const PLATFORM_STATUS = (highRisk) =>
  highRisk >= 10
    ? { label: "Critical", color: "#fb7185", from: "#f43f5e", to: "#e11d48" }
    : highRisk >= 5
    ? { label: "Moderate Risk", color: "#fb923c", from: "#f97316", to: "#f59e0b" }
    : { label: "Stable", color: "#34d399", from: "#10b981", to: "#14b8a6" };

const CARDS = [
  {
    key: "totalUsers",
    title: "Total Users",
    subtitle: "Registered users on the platform",
    icon: "👥",
    tag: "Users",
    from: "#0ea5e9",
    to: "#6366f1",
    tagColor: "#38bdf8",
  },
  {
    key: "totalMoodEntries",
    title: "Mood Entries",
    subtitle: "Emotional records submitted",
    icon: "📝",
    tag: "Entries",
    from: "#14b8a6",
    to: "#0ea5e9",
    tagColor: "#2dd4bf",
  },
  {
    key: "totalHighRiskEntries",
    title: "High Risk Entries",
    subtitle: "Urgent intervention alerts",
    icon: "⚠️",
    tag: "Risk",
    from: "#f43f5e",
    to: "#e11d48",
    tagColor: "#fb7185",
    isDanger: true,
  },
];

const AdminStatCard = ({
  title,
  subtitle,
  icon,
  tag,
  from,
  to,
  tagColor,
  isDanger,
  value,
  darkMode,
}) => {
  const dangerActive = isDanger && Number(value) > 0;

  return (
    <div
      className="asc-card"
      style={
        dangerActive
          ? {
              borderColor: "rgba(244,63,94,0.32)",
              background: darkMode
                ? "rgba(244,63,94,0.08)"
                : "rgba(255,241,242,0.9)",
            }
          : {}
      }
    >
      <div
        className="asc-glow"
        style={{
          background: `radial-gradient(circle, ${from}26 0%, transparent 68%)`,
        }}
      />

      <div
        className="asc-bar"
        style={{ background: `linear-gradient(90deg,${from},${to})` }}
      />

      <div className="asc-row">
        <div
          className="asc-icon"
          style={{
            background: `linear-gradient(135deg, ${from}18, ${to}14)`,
            border: `1px solid ${from}33`,
            color: from,
          }}
        >
          {icon}
        </div>

        <span
          className="asc-tag"
          style={{
            color: tagColor,
            background: `${tagColor}14`,
            borderColor: `${tagColor}33`,
          }}
        >
          {tag}
        </span>
      </div>

      <p className="asc-title">{title}</p>

      <p
        className="asc-val"
        style={dangerActive ? { color: tagColor } : {}}
      >
        {value}
      </p>

      <p className="asc-sub">{subtitle}</p>
    </div>
  );
};

const PlatformStatusCard = ({ highRisk, darkMode }) => {
  const status = PLATFORM_STATUS(highRisk);

  return (
    <div
      className="asc-card"
      style={{
        borderColor: `${status.color}30`,
        background: darkMode ? `${status.color}10` : `${status.color}08`,
      }}
    >
      <div
        className="asc-glow"
        style={{
          background: `radial-gradient(circle, ${status.color}24 0%, transparent 68%)`,
        }}
      />

      <div
        className="asc-bar"
        style={{
          background: `linear-gradient(90deg,${status.from},${status.to})`,
        }}
      />

      <div className="asc-row">
        <div
          className="asc-icon"
          style={{
            background: `${status.from}18`,
            border: `1px solid ${status.from}33`,
            color: status.from,
          }}
        >
          🛡️
        </div>

        <span
          className="asc-tag"
          style={{
            color: status.color,
            background: `${status.color}14`,
            borderColor: `${status.color}33`,
          }}
        >
          {status.label}
        </span>
      </div>

      <p className="asc-title">Platform Status</p>
      <p className="asc-val" style={{ color: status.color }}>
        {status.label}
      </p>
      <p className="asc-sub">System health overview</p>
    </div>
  );
};

const AdminStatsCards = ({ summary }) => {
  const { darkMode } = useTheme();

  const totalUsers = summary?.totalUsers || 0;
  const totalMoodEntries = summary?.totalMoodEntries || 0;
  const totalHighRiskEntries = summary?.totalHighRiskEntries || 0;

  const values = {
    totalUsers,
    totalMoodEntries,
    totalHighRiskEntries,
  };

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="asc-grid">
        {CARDS.map((card) => (
          <AdminStatCard
            key={card.key}
            {...card}
            value={values[card.key]}
            darkMode={darkMode}
          />
        ))}

        <PlatformStatusCard
          highRisk={totalHighRiskEntries}
          darkMode={darkMode}
        />
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  .asc-grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 16px;
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
  }

  @media(min-width: 640px) {
    .asc-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media(min-width: 1280px) {
    .asc-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  .asc-card {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    padding: 22px 24px;
    min-height: 172px;
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"
    };
    background: ${
      darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"
    };
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    box-shadow: ${
      darkMode
        ? "0 22px 55px rgba(0,0,0,0.28)"
        : "0 22px 55px rgba(15,23,42,0.08)"
    };
    transition: all 0.25s ease;
  }

  .asc-card:hover {
    transform: translateY(-4px);
    border-color: ${
      darkMode ? "rgba(255,255,255,0.16)" : "rgba(14,165,233,0.22)"
    };
    box-shadow: ${
      darkMode
        ? "0 28px 70px rgba(0,0,0,0.36)"
        : "0 28px 70px rgba(14,165,233,0.14)"
    };
  }

  .asc-glow {
    position: absolute;
    right: -80px;
    top: -90px;
    width: 220px;
    height: 220px;
    filter: blur(8px);
    opacity: ${darkMode ? "0.85" : "0.65"};
    pointer-events: none;
  }

  .asc-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    opacity: 0.95;
  }

  .asc-row {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .asc-icon {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
    box-shadow: ${
      darkMode
        ? "inset 0 1px 0 rgba(255,255,255,0.06)"
        : "inset 0 1px 0 rgba(255,255,255,0.8)"
    };
  }

  .asc-tag {
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 10.5px;
    font-weight: 800;
    border: 1px solid;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .asc-title {
    position: relative;
    z-index: 1;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 8px;
  }

  .asc-val {
    position: relative;
    z-index: 1;
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: ${darkMode ? "rgba(255,255,255,0.94)" : "#0f172a"};
    line-height: 1;
    margin-bottom: 8px;
    text-transform: capitalize;
  }

  .asc-sub {
    position: relative;
    z-index: 1;
    font-size: 12.5px;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.5)"};
    line-height: 1.55;
  }
`;

export default AdminStatsCards;