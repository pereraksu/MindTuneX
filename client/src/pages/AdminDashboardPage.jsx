import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import AdminStatsCards from "../components/admin/AdminStatsCards";
import AdminUserTable from "../components/admin/AdminUserTable";
import HighRiskEntries from "../components/admin/HighRiskEntries";
import SupportUserList from "../components/admin/SupportUserList";
import {
  getAdminSummaryApi,
  getAdminUsersApi,
  getHighRiskEntriesApi,
  getSupportUsersApi,
  getSystemStatusApi,
} from "../api/adminApi";
import { useAuth } from "../context/AuthContext";

const AdminDashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();

  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [highRiskEntries, setHighRiskEntries] = useState([]);
  const [supportUsers, setSupportUsers] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        summaryRes,
        usersRes,
        highRiskRes,
        supportUsersRes,
        systemStatusRes,
      ] = await Promise.all([
        getAdminSummaryApi(),
        getAdminUsersApi(),
        getHighRiskEntriesApi(),
        getSupportUsersApi(),
        getSystemStatusApi(),
      ]);

      setSummary(summaryRes?.data || summaryRes || null);
      setUsers(usersRes?.data || usersRes || []);
      setHighRiskEntries(highRiskRes?.data || highRiskRes || []);
      setSupportUsers(supportUsersRes?.data || supportUsersRes || []);
      setSystemStatus(systemStatusRes?.data || systemStatusRes || null);
    } catch (err) {
      console.error("Admin load failed:", err);
      setError("Failed to load dashboard data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();

    const interval = setInterval(() => {
      loadAdminData();
    }, 15000); // auto refresh every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const totalUsers = users.length;
  const totalHighRisk = highRiskEntries.length;
  const totalSupport = supportUsers.length;

  const adminHealthLabel =
    totalHighRisk >= 10
      ? "Critical Attention"
      : totalHighRisk >= 5
      ? "Moderate Risk"
      : "Stable";

  const adminHealthStyle =
    totalHighRisk >= 10
      ? "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50"
      : totalHighRisk >= 5
      ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50"
      : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50";

  const topSummaryCards = [
    {
      label: "Total Users Loaded",
      val: totalUsers,
      sub: "Registered user records",
      gradient: "from-blue-500 to-cyan-500",
      icon: "👥",
    },
    {
      label: "High Risk Entries",
      val: totalHighRisk,
      sub: "Urgent review required",
      gradient: "from-rose-500 to-red-500",
      icon: "⚠️",
    },
    {
      label: "Support Queue",
      val: totalSupport,
      sub: "Pending support attention",
      gradient: "from-amber-500 to-orange-500",
      icon: "🤝",
    },
  ];

  const systemCards = [
    {
      label: "Server Status",
      value: systemStatus?.serverStatus || "Unknown",
      sub: "Core backend service",
      gradient: "from-emerald-500 to-teal-500",
      icon: "🟢",
      valueClass:
        systemStatus?.serverStatus === "Operational"
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400",
    },
    {
      label: "AI Model API",
      value: systemStatus?.aiModelApi || "Unknown",
      sub: "FastAPI connection",
      gradient: "from-violet-500 to-fuchsia-500",
      icon: "🧠",
      valueClass:
        systemStatus?.aiModelApi === "Connected"
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400",
    },
    {
      label: "Active Users",
      value: systemStatus?.activeUsers ?? 0,
      sub: "Last 24 hours",
      gradient: "from-sky-500 to-blue-500",
      icon: "👤",
      valueClass: "text-slate-800 dark:text-white",
    },
    {
      label: "Database",
      value: systemStatus?.database || "Unknown",
      sub: "MongoDB connection",
      gradient: "from-cyan-500 to-teal-500",
      icon: "🗄️",
      valueClass:
        systemStatus?.database === "Healthy"
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 transition-colors duration-500 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_25%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.16),transparent_25%),radial-gradient(circle_at_bottom,rgba(244,63,94,0.10),transparent_28%)]" />

      <Sidebar forceAdmin={true} />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl lg:p-8 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500" />
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-900/20" />

              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    Administrative Control Center
                  </p>

                  <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-slate-800 lg:text-4xl dark:text-white">
                    Admin{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
                      Dashboard
                    </span>
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Monitor user wellbeing, review high-risk emotional signals,
                    manage support cases, and maintain a healthy platform
                    environment.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      👤 Admin: {user?.fullName || "Administrator"}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${adminHealthStyle}`}
                    >
                      🛡 Platform Status: {adminHealthLabel}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={loadAdminData}
                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-cyan-700"
                  >
                    Refresh Dashboard
                  </button>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400">
                    Auto refresh every 15s
                  </div>
                </div>
              </div>
            </div>

            {/* System status cards */}
            <section className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                  Infrastructure Status
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                  Live System Health
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {systemCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-xl shadow-sky-100/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none"
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.gradient}`}
                    />
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-xl dark:bg-slate-800">
                        {card.icon}
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      {card.label}
                    </p>
                    <p className={`mt-2 text-3xl font-semibold ${card.valueClass}`}>
                      {loading ? "--" : card.value}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {card.sub}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Top mini stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {topSummaryCards.map((card, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-xl shadow-sky-100/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.gradient}`}
                  />
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-xl dark:bg-slate-800">
                      {card.icon}
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    {card.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-800 dark:text-white">
                    {loading ? "--" : card.val}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {card.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* States */}
            {loading ? (
              <div className="flex h-72 flex-col items-center justify-center rounded-[2rem] border border-white/60 bg-white/75 shadow-2xl shadow-sky-100/30 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Loading admin dashboard...
                </p>
              </div>
            ) : error ? (
              <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
                <p className="text-lg font-semibold text-rose-700 dark:text-rose-400">
                  Unable to load data
                </p>
                <p className="mt-2 text-sm text-rose-600 dark:text-rose-500">
                  {error}
                </p>
                <button
                  onClick={loadAdminData}
                  className="mt-5 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Key metrics */}
                <section className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                      Platform Analytics
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                      Key Metrics
                    </h2>
                  </div>
                  <AdminStatsCards summary={summary} />
                </section>

                {/* Risk & support */}
                <section className="grid items-start gap-6 lg:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                        High Risk Entries
                      </h3>
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                        {totalHighRisk} flagged
                      </span>
                    </div>
                    <HighRiskEntries entries={highRiskEntries} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                        Support User List
                      </h3>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        {totalSupport} pending
                      </span>
                    </div>
                    <SupportUserList users={supportUsers} />
                  </div>
                </section>

                {/* Users table */}
                <section className="space-y-3">
                  <div className="flex flex-col gap-3 px-1 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                      All Users
                    </h3>
                    <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      Total: {totalUsers}
                    </div>
                  </div>
                  <AdminUserTable users={users} />
                </section>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;