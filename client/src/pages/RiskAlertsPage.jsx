import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { getHighRiskEntriesApi } from "../api/adminApi";
import { useAuth } from "../context/AuthContext";

const RiskAlertsPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getHighRiskEntriesApi();
      setAlerts(res?.data || res || []);
    } catch (err) {
      console.error("Failed to load alerts:", err);
      setError("Unable to fetch risk alerts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const getRiskTone = (supportLevel) => {
    const level = supportLevel?.toLowerCase();
    if (level === "high") {
      return {
        badge: "bg-red-100 text-red-700 border-red-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800",
        dot: "bg-red-500 dark:bg-rose-500",
        label: "High Priority",
      };
    }
    if (level === "moderate") {
      return {
        badge: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800",
        dot: "bg-amber-500 dark:bg-amber-500",
        label: "Moderate Priority",
      };
    }
    return {
      badge: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      dot: "bg-slate-400 dark:bg-slate-600",
      label: "Needs Review",
    };
  };

  return (
    <div className="flex min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <Sidebar forceAdmin={true} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            
            {/* --- Header Section --- */}
            <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl lg:p-8 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Risk Monitoring
                  </p>
                  <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-slate-800 lg:text-4xl dark:text-white">
                    Risk <span className="bg-gradient-to-r from-rose-500 to-red-500 bg-clip-text text-transparent">Alerts</span>
                  </h1>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Monitor, review, and respond to critical emotional signals from users.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                    {alerts.length} Active Alert{alerts.length !== 1 ? "s" : ""}
                  </span>
                  <button 
                    onClick={loadAlerts}
                    className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* --- Content Section --- */}
            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-white/60 bg-white/70 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-rose-500 dark:border-slate-700 dark:border-t-rose-400"></div>
                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading risk alerts...</p>
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
                <p className="text-rose-600 dark:text-rose-400">{error}</p>
                <button onClick={loadAlerts} className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700">Try Again</button>
              </div>
            ) : !alerts.length ? (
               <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 p-16 text-center dark:border-slate-700 dark:bg-slate-800/50">
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl dark:bg-slate-800">
                   ✅
                 </div>
                 <h3 className="mt-5 text-xl font-semibold text-slate-700 dark:text-slate-300">
                   No high-risk entries found
                 </h3>
                 <p className="mt-2 text-slate-500 dark:text-slate-400">
                   Everything is stable. New alerts will appear here when elevated risks are detected.
                 </p>
               </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {alerts.map((entry) => {
                  const tone = getRiskTone(entry.supportLevel);
                  return (
                    <div 
                      key={entry._id} 
                      className="group flex flex-col justify-between rounded-3xl border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none"
                    >
                      <div>
                        {/* User & Time Info */}
                        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-xl dark:bg-rose-900/20">
                              ⚠️
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-slate-800 dark:text-white">
                                {entry.user?.fullName || entry.user?.name || "Unknown User"}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {entry.user?.email || "No email available"}
                              </p>
                            </div>
                          </div>
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tone.badge}`}>
                            {tone.label}
                          </span>
                        </div>

                        {/* Journal Text */}
                        <div className="mt-5 rounded-2xl border border-rose-50 bg-rose-50/30 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400 dark:text-rose-500/60">
                            Flagged Content
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-700 italic dark:text-slate-300">
                            “{entry.inputText || "No journal text available"}”
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Emotion: {entry.predictedEmotion || "Unknown"}
                          </span>
                          <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Trigger: {entry.triggerCategory || "General"}
                          </span>
                          <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Date: {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button className="flex-1 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600">
                          Mark as Reviewed
                        </button>
                        <button className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/50">
                          Contact User
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default RiskAlertsPage;