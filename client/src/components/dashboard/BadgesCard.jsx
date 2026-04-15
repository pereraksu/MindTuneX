import React, { useMemo } from "react";

const BadgesCard = ({ moods, streak }) => {
  const earnedBadges = useMemo(() => {
    const totalEntries = moods.length;
    const hasPositive = moods.some((m) =>
      ["joy", "calm", "love"].includes(m.predictedEmotion)
    );

    return {
      firstStep: totalEntries >= 1,
      streak3: streak >= 3,
      streak7: streak >= 7,
      positivity: hasPositive,
      consistent: totalEntries >= 10,
    };
  }, [moods, streak]);

  const badges = [
    {
      id: "firstStep",
      name: "First Step",
      desc: "Logged your first mood",
      icon: "🌱",
      earned: earnedBadges.firstStep,
      color: "from-emerald-400 to-teal-500",
    },
    {
      id: "streak3",
      name: "3-Day Streak",
      desc: "Logged in for 3 days",
      icon: "🔥",
      earned: earnedBadges.streak3,
      color: "from-orange-400 to-rose-500",
    },
    {
      id: "positivity",
      name: "Positivity",
      desc: "Recorded a joyful mood",
      icon: "✨",
      earned: earnedBadges.positivity,
      color: "from-amber-300 to-yellow-500",
    },
    {
      id: "streak7",
      name: "1 Week Master",
      desc: "7-day streak",
      icon: "🏆",
      earned: earnedBadges.streak7,
      color: "from-violet-400 to-fuchsia-500",
    },
    {
      id: "consistent",
      name: "Self-Aware",
      desc: "10 total entries",
      icon: "🧠",
      earned: earnedBadges.consistent,
      color: "from-sky-400 to-blue-600",
    },
  ];

  const unlockedCount = Object.values(earnedBadges).filter(Boolean).length;
  const progress = (unlockedCount / badges.length) * 100;

  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 transition-all">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Achievements
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-800 dark:text-white">
            Your Badges
          </h3>
        </div>

        <div className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-500">
          {unlockedCount} / {badges.length}
        </div>
      </div>

      {/* 🔥 Progress Bar */}
      <div className="mb-6">
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Progress: {Math.round(progress)}%
        </p>
      </div>

      {/* Badges */}
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`group relative min-w-[150px] rounded-2xl border p-4 text-center transition-all duration-300 
            
            ${
              badge.earned
                ? "bg-white shadow-xl hover:-translate-y-1 dark:bg-slate-800"
                : "bg-slate-50/50 border-dashed opacity-60 grayscale dark:bg-slate-800/30"
            }`}
          >
            {/* Glow Effect */}
            {badge.earned && (
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${badge.color} opacity-10 blur-xl`} />
            )}

            {/* Icon */}
            <div
              className={`relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-all 
              
              ${
                badge.earned
                  ? `bg-gradient-to-br ${badge.color} text-white shadow-lg`
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              {badge.icon}
            </div>

            {/* Title */}
            <p
              className={`text-sm font-bold ${
                badge.earned
                  ? "text-slate-800 dark:text-white"
                  : "text-slate-500"
              }`}
            >
              {badge.name}
            </p>

            {/* Desc */}
            <p className="mt-1 text-[10px] text-slate-500">
              {badge.earned ? "Unlocked 🎉" : badge.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesCard;