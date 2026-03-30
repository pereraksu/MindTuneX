import React, { useMemo } from "react";

const BadgesCard = ({ moods, streak }) => {
  // 🚨 යූසර්ගේ දත්ත අනුව Badges අන්ලොක් වෙන විදිහ ගණනය කිරීම
  const earnedBadges = useMemo(() => {
    const totalEntries = moods.length;
    const hasPositive = moods.some(m => ['joy', 'calm', 'love'].includes(m.predictedEmotion));
    
    return {
      firstStep: totalEntries >= 1,
      streak3: streak >= 3,
      streak7: streak >= 7,
      positivity: hasPositive,
      consistent: totalEntries >= 10,
    };
  }, [moods, streak]);

  // 🚨 Badges වල විස්තර සහ පාට
  const badges = [
    {
      id: "firstStep",
      name: "First Step",
      desc: "Logged your first mood",
      icon: "🌱",
      earned: earnedBadges.firstStep,
      color: "from-emerald-400 to-teal-500",
      shadow: "shadow-teal-500/30"
    },
    {
      id: "streak3",
      name: "3-Day Streak",
      desc: "Logged in for 3 days",
      icon: "🔥",
      earned: earnedBadges.streak3,
      color: "from-orange-400 to-rose-500",
      shadow: "shadow-orange-500/30"
    },
    {
      id: "positivity",
      name: "Positivity",
      desc: "Recorded a Joyful mood",
      icon: "✨",
      earned: earnedBadges.positivity,
      color: "from-amber-300 to-yellow-500",
      shadow: "shadow-yellow-500/30"
    },
    {
      id: "streak7",
      name: "1 Week Master",
      desc: "7-day continuous streak",
      icon: "🏆",
      earned: earnedBadges.streak7,
      color: "from-violet-400 to-fuchsia-500",
      shadow: "shadow-violet-500/30"
    },
    {
      id: "consistent",
      name: "Self-Aware",
      desc: "Logged 10 total entries",
      icon: "🧠",
      earned: earnedBadges.consistent,
      color: "from-sky-400 to-blue-600",
      shadow: "shadow-blue-500/30"
    }
  ];

  return (
    <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none mt-6 transition-colors">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Achievements
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-800 dark:text-white">
            Your Badges
          </h3>
        </div>
        <div className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-500 dark:text-slate-400">
          {Object.values(earnedBadges).filter(Boolean).length} / {badges.length} Unlocked
        </div>
      </div>

      {/* Horizontal Scrollable Badge List */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`flex min-w-[140px] flex-col items-center rounded-2xl border p-4 text-center transition-all duration-500 ${
              badge.earned 
                ? "border-transparent bg-white shadow-lg dark:bg-slate-800 hover:-translate-y-1" 
                : "border-dashed border-slate-200 bg-slate-50/50 opacity-60 grayscale dark:border-slate-700 dark:bg-slate-800/30"
            }`}
          >
            <div 
              className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
                badge.earned ? `bg-gradient-to-br ${badge.color} text-white shadow-lg ${badge.shadow}` : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              {badge.icon}
            </div>
            <p className={`text-sm font-bold ${badge.earned ? "text-slate-800 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
              {badge.name}
            </p>
            <p className="mt-1 text-[10px] leading-tight text-slate-500 dark:text-slate-500">
              {badge.earned ? "Unlocked!" : badge.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesCard;