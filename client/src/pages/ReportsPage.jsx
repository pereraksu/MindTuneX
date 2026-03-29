import React from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";

const ReportsPage = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    // Background - Dark Mode colors added
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-5xl space-y-10">
            
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white transition-colors">
                  Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-600 dark:from-teal-400 dark:to-sky-400">Reports</span>
                </h1>
                <p className="mt-1 text-slate-500 dark:text-slate-400 transition-colors">
                  Detailed analytics and downloadable reports of your emotional progress
                </p>
              </div>

              <button className="flex items-center justify-center gap-2 rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 px-6 py-3 text-sm font-semibold text-teal-600 dark:text-teal-400 shadow-xl shadow-sky-100/50 dark:shadow-none transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:bg-white dark:hover:bg-slate-700/80 active:scale-95">
                <span className="text-xl">📥</span>
                Download Full PDF Report
              </button>
            </div>

            {/* Monthly Overview Cards - Glass */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Monthly Check-ins */}
              <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none p-6 transition-colors">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">Monthly Check-ins</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-light text-slate-800 dark:text-white transition-colors">24</span>
                  <span className="text-sm text-emerald-500 dark:text-emerald-400 font-medium">↑ 12% from last month</span>
                </div>
              </div>

              {/* Average Sentiment */}
              <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none p-6 transition-colors">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">Average Sentiment</p>
                <p className="mt-4 text-4xl font-light text-emerald-600 dark:text-emerald-400 transition-colors">Positive</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Stable trend this month</p>
              </div>

              {/* Current Streak */}
              <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none p-6 transition-colors">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">Current Streak</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-light text-slate-800 dark:text-white transition-colors">5 Days</span>
                  <span className="text-sm text-teal-500 dark:text-teal-400 font-medium">Keep it up! 🔥</span>
                </div>
              </div>
            </div>

            {/* Chart Area - Glass */}
            <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-2xl shadow-sky-100/50 dark:shadow-none p-8 transition-colors">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Emotion Trend (Last 30 Days)
                </h3>
                <select className="rounded-2xl border border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-800 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 outline-none focus:border-teal-400 dark:focus:border-teal-500 transition-colors cursor-pointer">
                  <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">Last 30 Days</option>
                  <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">This Year</option>
                  <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">All Time</option>
                </select>
              </div>

              {/* Placeholder Chart */}
              <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 transition-colors">
                <span className="mb-4 text-6xl opacity-40 dark:opacity-30 grayscale">📈</span>
                <p className="font-medium text-slate-500 dark:text-slate-400 text-center px-4">More mood entries needed to generate detailed chart</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Log consistently for richer insights</p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;