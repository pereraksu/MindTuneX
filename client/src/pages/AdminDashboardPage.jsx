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
} from "../api/adminApi";
import { useAuth } from "../context/AuthContext";

const AdminDashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();

  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [highRiskEntries, setHighRiskEntries] = useState([]);
  const [supportUsers, setSupportUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [summaryRes, usersRes, highRiskRes, supportUsersRes] =
        await Promise.all([
          getAdminSummaryApi(),
          getAdminUsersApi(),
          getHighRiskEntriesApi(),
          getSupportUsersApi(),
        ]);

      setSummary(summaryRes?.data || summaryRes || null);
      setUsers(usersRes?.data || usersRes || []);
      setHighRiskEntries(highRiskRes?.data || highRiskRes || []);
      setSupportUsers(supportUsersRes?.data || supportUsersRes || []);
    } catch (err) {
      console.error("Admin load failed:", err);
      setError("Failed to load dashboard data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
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
      ? "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"
      : totalHighRisk >= 5
      ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
      : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";

  return (
    // මුළු පිටුවේම background එක theme එකට අනුව මාරු වේ
    <div className="flex min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <Sidebar forceAdmin={true} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            
            {/* --- Hero / Header Section --- */}
            <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl lg:p-8 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
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
                    manage support cases, and maintain a healthy platform environment.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      👤 Admin: {user?.fullName || "Administrator"}
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${adminHealthStyle}`}>
                      🛡 Platform Status: {adminHealthLabel}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={loadAdminData}
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Refresh Dashboard
                  </button>
                  <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400">
                    Live Monitoring Enabled
                  </div>
                </div>
              </div>
            </div>

            {/* --- Top 3 Metrics Row --- */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { label: "Total Users Loaded", val: totalUsers, sub: "Registered user records" },
                { label: "High Risk Entries", val: totalHighRisk, sub: "Urgent review required" },
                { label: "Support Queue", val: totalSupport, sub: "Pending support attention" }
              ].map((card, idx) => (
                <div key={idx} className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-800 dark:text-white">{loading ? "--" : card.val}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* --- Content Area --- */}
            {loading ? (
              <div className="flex h-72 flex-col items-center justify-center rounded-3xl border border-white/60 bg-white/70 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400"></div>
                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading admin dashboard...</p>
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
                <p className="text-lg font-semibold text-rose-700 dark:text-rose-400">Unable to load data</p>
                <p className="mt-2 text-sm text-rose-600 dark:text-rose-500">{error}</p>
                <button onClick={loadAdminData} className="mt-5 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700">Try Again</button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Metrics Visuals */}
                <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Platform Analytics</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">Key Metrics</h2>
                  </div>
                  <AdminStatsCards summary={summary} />
                </div>

                {/* Risk & Support Grid */}
                <div className="grid items-start gap-6 lg:grid-cols-2">
                  <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-white">High Risk Entries</h3>
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">{totalHighRisk} flagged</span>
                    </div>
                    <HighRiskEntries entries={highRiskEntries} />
                  </div>

                  <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Support User List</h3>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{totalSupport} pending</span>
                    </div>
                    <SupportUserList users={supportUsers} />
                  </div>
                </div>

                {/* User Table */}
                <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white">All Users</h3>
                    <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Total: {totalUsers}</div>
                  </div>
                  <AdminUserTable users={users} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;