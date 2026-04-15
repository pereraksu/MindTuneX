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
      setAlerts(res?.data?.data || res?.data || res || []);
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
        badge:
          "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800/50",
        dot: "bg-rose-500",
        label: "High Priority",
        cardBorder: "border-rose-100 dark:border-rose-900/40",
        softBg: "bg-rose-50/50 dark:bg-rose-950/10",
        iconBg: "bg-rose-100 dark:bg-rose-900/20",
      };
    }

    if (level === "moderate") {
      return {
        badge:
          "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800/50",
        dot: "bg-amber-500",
        label: "Moderate Priority",
        cardBorder: "border-amber-100 dark:border-amber-900/40",
        softBg: "bg-amber-50/50 dark:bg-amber-950/10",
        iconBg: "bg-amber-100 dark:bg-amber-900/20",
      };
    }

    return {
      badge:
        "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      dot: "bg-slate-400",
      label: "Needs Review",
      cardBorder: "border-slate-200 dark:border-slate-800",
      softBg: "bg-slate-50/50 dark:bg-slate-950/10",
      iconBg: "bg-slate-100 dark:bg-slate-800",
    };
  };

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-orange-50 transition-colors duration-500 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.18),transparent_25%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.14),transparent_25%),radial-gradient(circle_at_bottom,rgba(251,191,36,0.10),transparent_30%)]" />

      <Sidebar forceAdmin={true} />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-rose-100/40 backdrop-blur-xl lg:p-8 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-orange-500" />
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-rose-100/50 blur-3xl dark:bg-rose-900/20" />

              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    Risk Monitoring
                  </p>

                  <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-slate-800 lg:text-4xl dark:text-white">
                    Risk{" "}
                    <span className="bg-gradient-to-r from-rose-500 to-red-500 bg-clip-text text-transparent">
                      Alerts
                    </span>
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Monitor, review, and respond to emotionally sensitive entries
                    that may require timely administrative attention.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      👤 Admin: {user?.fullName || "Administrator"}
                    </span>

                    <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400">
                      🚨 Active Alerts: {alerts.length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                    Live Risk Watch
                  </span>

                  <button
                    onClick={loadAlerts}
                    className="rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:from-rose-700 hover:to-red-700"
                  >
                    Refresh Alerts
                  </button>
                </div>
              </div>
            </div>

            {/* States */}
            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-[2rem] border border-white/60 bg-white/75 shadow-2xl shadow-rose-100/30 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-rose-500 dark:border-slate-700 dark:border-t-rose-400" />
                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Loading risk alerts...
                </p>
              </div>
            ) : error ? (
              <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
                <p className="text-lg font-semibold text-rose-700 dark:text-rose-400">
                  Unable to load alerts
                </p>
                <p className="mt-2 text-sm text-rose-600 dark:text-rose-500">
                  {error}
                </p>
                <button
                  onClick={loadAlerts}
                  className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Try Again
                </button>
              </div>
            ) : !alerts.length ? (
              <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/80 p-16 text-center dark:border-slate-700 dark:bg-slate-800/50">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl dark:bg-slate-800">
                  ✅
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-700 dark:text-slate-300">
                  No high-risk entries found
                </h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Everything is stable right now. New alerts will appear here when
                  elevated risks are detected.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {alerts.map((entry) => {
                  const tone = getRiskTone(entry.supportLevel);

                  return (
                    <div
                      key={entry._id}
                      className={`group flex flex-col justify-between rounded-[1.75rem] border bg-white/75 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl dark:bg-slate-900/70 dark:shadow-none ${tone.cardBorder}`}
                    >
                      <div>
                        {/* User / top row */}
                        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${tone.iconBg}`}
                            >
                              ⚠️
                            </div>

                            <div className="min-w-0">
                              <p className="text-lg font-semibold text-slate-800 dark:text-white">
                                {entry.user?.fullName ||
                                  entry.user?.name ||
                                  "Unknown User"}
                              </p>
                              <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                                {entry.user?.email || "No email available"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tone.badge}`}
                          >
                            {tone.label}
                          </span>
                        </div>

                        {/* flagged content */}
                        <div
                          className={`mt-5 rounded-2xl border p-4 dark:border-slate-800 ${tone.softBg}`}
                        >
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                            Flagged Content
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-700 italic dark:text-slate-300">
                            “{entry.inputText || "No journal text available"}”
                          </p>
                        </div>

                        {/* tags */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Emotion: {entry.predictedEmotion || "Unknown"}
                          </span>

                          <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Trigger: {entry.triggerCategory || "General"}
                          </span>

                          <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Date:{" "}
                            {entry.createdAt
                              ? new Date(entry.createdAt).toLocaleDateString()
                              : "N/A"}
                          </span>

                          {entry.confidence !== undefined &&
                            entry.confidence !== null && (
                              <span className="rounded-xl bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                                Confidence: {Math.round(entry.confidence * 100)}%
                              </span>
                            )}
                        </div>
                      </div>

                      {/* footer actions */}
                      <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <div className="mb-4 flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${tone.dot} shadow-sm`}
                          />
                          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-500">
                            Review recommended for emotional wellness follow-up.
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button className="flex-1 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600">
                            Mark as Reviewed
                          </button>

                          <button className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/50">
                            Contact User
                          </button>
                        </div>
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