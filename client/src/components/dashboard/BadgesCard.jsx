import React, { useMemo } from "react";
import { useTheme } from "../../context/useTheme";

const BADGE_DEFS = [
  {
    id: "firstStep",
    name: "First Step",
    desc: "Log your first mood",
    unlockDesc: "Mood journey begun",
    icon: "🌱",
    gradFrom: "#10b981",
    gradTo: "#14b8a6",
  },
  {
    id: "streak3",
    name: "3-Day Streak",
    desc: "Log moods for 3 days",
    unlockDesc: "Consistency unlocked",
    icon: "🔥",
    gradFrom: "#f59e0b",
    gradTo: "#f43f5e",
  },
  {
    id: "positivity",
    name: "Positivity",
    desc: "Record a positive mood",
    unlockDesc: "Good vibes captured",
    icon: "✨",
    gradFrom: "#f59e0b",
    gradTo: "#fbbf24",
  },
  {
    id: "streak7",
    name: "1 Week Master",
    desc: "Reach a 7-day streak",
    unlockDesc: "7 days straight",
    icon: "🏆",
    gradFrom: "#8b5cf6",
    gradTo: "#ec4899",
  },
  {
    id: "consistent",
    name: "Self-Aware",
    desc: "Log 10 total entries",
    unlockDesc: "Deep self-knowledge",
    icon: "🧠",
    gradFrom: "#0ea5e9",
    gradTo: "#6366f1",
  },
];

const calculateStreak = (moods = []) => {
  if (!moods.length) return 0;

  const uniqueDays = [
    ...new Set(
      moods
        .map((m) => m.createdAt || m.date)
        .filter(Boolean)
        .map((d) => new Date(d).toISOString().slice(0, 10))
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  if (!uniqueDays.length) return 0;

  let streak = 1;

  for (let i = 0; i < uniqueDays.length - 1; i++) {
    const current = new Date(uniqueDays[i]);
    const next = new Date(uniqueDays[i + 1]);

    const diffDays = Math.round(
      (current - next) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) streak++;
    else break;
  }

  return streak;
};

const BadgesCard = ({ moods = [], streak }) => {
  const { darkMode } = useTheme();

  const finalStreak = useMemo(() => {
    return typeof streak === "number" ? streak : calculateStreak(moods);
  }, [moods, streak]);

  const badges = useMemo(() => {
    const totalEntries = moods.length;

    const hasPositive = moods.some((m) =>
      ["joy", "calm", "love"].includes(
        String(m.predictedEmotion || m.emotion || "").toLowerCase()
      )
    );

    const earned = {
      firstStep: totalEntries >= 1,
      streak3: finalStreak >= 3,
      positivity: hasPositive,
      streak7: finalStreak >= 7,
      consistent: totalEntries >= 10,
    };

    return BADGE_DEFS.map((badge) => ({
      ...badge,
      earned: earned[badge.id],
    }));
  }, [moods, finalStreak]);

  const unlockedCount = badges.filter((badge) => badge.earned).length;
  const progress = Math.round((unlockedCount / badges.length) * 100);

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="badges-card">
        <div className="badges-glow" />

        <div className="badges-header">
          <div>
            <p className="badges-eyebrow">Achievements</p>
            <h2 className="badges-title">Your Badges</h2>
            <p className="badges-subtitle">
              Track your emotional wellness milestones.
            </p>
          </div>

          <span className="badges-counter">
            {unlockedCount} / {badges.length}
          </span>
        </div>

        <div className="badges-progress-wrap">
          <div className="badges-progress-track">
            <div
              className="badges-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="badges-progress-label">
            Progress: {progress}% · Current streak: {finalStreak} day
            {finalStreak !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="badges-row">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`badge-item ${badge.earned ? "earned" : "locked"}`}
            >
              {badge.earned && (
                <>
                  <div
                    className="badge-bar"
                    style={{
                      background: `linear-gradient(90deg, ${badge.gradFrom}, ${badge.gradTo})`,
                    }}
                  />

                  <div
                    className="badge-glow"
                    style={{
                      background: `radial-gradient(circle, ${badge.gradFrom}55 0%, transparent 70%)`,
                    }}
                  />
                </>
              )}

              <div
                className="badge-icon-wrap"
                style={
                  badge.earned
                    ? {
                        background: `linear-gradient(135deg, ${badge.gradFrom}22, ${badge.gradTo}33)`,
                        borderColor: `${badge.gradFrom}44`,
                      }
                    : {}
                }
              >
                {badge.earned ? badge.icon : "🔒"}
              </div>

              <p className="badge-name">{badge.name}</p>
              <p className="badge-status">
                {badge.earned ? badge.unlockDesc : badge.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
.badges-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
  background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"};
  padding: 24px;
  font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
  backdrop-filter: blur(22px);
  box-shadow: ${darkMode ? "0 22px 55px rgba(0,0,0,0.28)" : "0 22px 55px rgba(15,23,42,0.08)"};
}

.badges-glow {
  position: absolute;
  right: -90px;
  top: -90px;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%);
  pointer-events: none;
}

.badges-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 20px;
}

.badges-eyebrow {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
  margin-bottom: 6px;
}

.badges-title {
  font-size: 20px;
  font-weight: 800;
  color: ${darkMode ? "rgba(255,255,255,0.94)" : "#0f172a"};
  margin-bottom: 4px;
}

.badges-subtitle {
  font-size: 13px;
  color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
}

.badges-counter {
  padding: 7px 15px;
  border-radius: 999px;
  background: rgba(20,184,166,0.12);
  border: 1px solid rgba(20,184,166,0.28);
  color: #14b8a6;
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
}

.badges-progress-wrap {
  position: relative;
  z-index: 1;
  margin-bottom: 22px;
}

.badges-progress-track {
  height: 6px;
  width: 100%;
  border-radius: 999px;
  background: ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"};
  overflow: hidden;
  margin-bottom: 8px;
}

.badges-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #14b8a6, #0ea5e9, #8b5cf6);
  transition: width 0.6s ease;
  box-shadow: 0 0 14px rgba(20,184,166,0.45);
}

.badges-progress-label {
  font-size: 11.5px;
  font-weight: 700;
  color: ${darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.48)"};
}

.badges-row {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.badges-row::-webkit-scrollbar {
  display: none;
}

.badge-item {
  position: relative;
  overflow: hidden;
  min-width: 148px;
  max-width: 148px;
  flex-shrink: 0;
  border-radius: 18px;
  border: 1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)"};
  background: ${darkMode ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.68)"};
  padding: 17px 13px;
  text-align: center;
  transition: all 0.22s ease;
}

.badge-item.earned {
  background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.88)"};
}

.badge-item.earned:hover {
  transform: translateY(-3px);
  box-shadow: ${darkMode ? "0 16px 34px rgba(0,0,0,0.24)" : "0 16px 34px rgba(15,23,42,0.08)"};
}

.badge-item.locked {
  opacity: 0.55;
  filter: grayscale(0.45);
}

.badge-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.badge-glow {
  position: absolute;
  top: -45px;
  left: 50%;
  transform: translateX(-50%);
  width: 130px;
  height: 130px;
  pointer-events: none;
}

.badge-icon-wrap {
  position: relative;
  z-index: 1;
  width: 52px;
  height: 52px;
  border-radius: 17px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
  background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"};
}

.badge-name {
  position: relative;
  z-index: 1;
  font-size: 13px;
  font-weight: 900;
  color: ${darkMode ? "rgba(255,255,255,0.82)" : "#0f172a"};
  margin-bottom: 5px;
}

.badge-status {
  position: relative;
  z-index: 1;
  font-size: 10.8px;
  font-weight: 600;
  line-height: 1.45;
  color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.5)"};
}
`;

export default BadgesCard;