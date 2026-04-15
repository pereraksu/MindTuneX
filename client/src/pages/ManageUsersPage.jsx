import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { getAdminUsersApi } from "../api/adminApi";
import { useAuth } from "../context/AuthContext";

const ManageUsersPage = () => {
  const { user, logout, isAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAdminUsersApi();
      setUsers(res?.data?.data || res?.data || res || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Unable to fetch user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 transition-colors duration-500 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_25%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.16),transparent_25%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.10),transparent_30%)]" />

      <Sidebar forceAdmin={true} />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl lg:p-8 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500" />
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-900/20" />

              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    User Administration
                  </p>

                  <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-slate-800 lg:text-4xl dark:text-white">
                    Manage{" "}
                    <span className="bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent">
                      Users
                    </span>
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    View registered accounts, inspect roles, and manage platform
                    access through a centralized administrative interface.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      👤 Admin: {user?.fullName || "Administrator"}
                    </span>
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-900/50 dark:bg-sky-900/20 dark:text-sky-400">
                      Total Users: {users.length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={loadUsers}
                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-cyan-700"
                  >
                    Refresh Users
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-[2rem] border border-white/60 bg-white/75 shadow-2xl shadow-sky-100/30 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800 dark:border-slate-700 dark:border-t-white" />
                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Loading user records...
                </p>
              </div>
            ) : error ? (
              <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
                <p className="text-lg font-semibold text-rose-700 dark:text-rose-400">
                  Unable to load users
                </p>
                <p className="mt-2 text-sm text-rose-600 dark:text-rose-500">
                  {error}
                </p>
                <button
                  onClick={loadUsers}
                  className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Try Again
                </button>
              </div>
            ) : users.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
                  👥
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
                  No users found
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Registered accounts will appear here once available.
                </p>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                      User Directory
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                      Registered Accounts
                    </h2>
                  </div>

                  <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {users.length} record{users.length !== 1 ? "s" : ""}
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-slate-50/80 dark:bg-slate-800/70">
                        <tr className="text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                          <th className="px-4 py-4 font-semibold">User</th>
                          <th className="px-4 py-4 font-semibold">Email</th>
                          <th className="px-4 py-4 font-semibold">Role</th>
                          <th className="px-4 py-4 text-right font-semibold">Actions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100 bg-white/70 dark:divide-slate-800/60 dark:bg-slate-900/30">
                        {users.map((u) => {
                          const displayName = u.fullName || u.name || "N/A";
                          const role = u.role || "user";

                          return (
                            <tr
                              key={u._id}
                              className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            >
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 text-sm font-semibold text-blue-700 dark:from-blue-900/40 dark:to-cyan-900/30 dark:text-blue-300">
                                    {displayName.charAt(0).toUpperCase()}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate font-semibold text-slate-800 dark:text-white">
                                      {displayName}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                      ID: {u._id}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                                {u.email}
                              </td>

                              <td className="px-4 py-4">
                                <span
                                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                    role === "admin"
                                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                                  }`}
                                >
                                  {role}
                                </span>
                              </td>

                              <td className="px-4 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button className="rounded-xl bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600 transition hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:hover:bg-sky-900/40">
                                    Edit Role
                                  </button>
                                  <button className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40">
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageUsersPage;