import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { getAdminUsersApi } from "../api/adminApi";
// (අවශ්‍ය නම් User ව Delete/Update කරන්න වෙනම API calls මෙතනට import කරගන්න)
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
      setUsers(res?.data || res || []);
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
                    User Administration
                  </p>
                  <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-slate-800 lg:text-4xl dark:text-white">
                    Manage <span className="bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent">Users</span>
                  </h1>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    View registered accounts, update roles, or remove users from the system.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                    Total Users: {users.length}
                  </span>
                  <button 
                    onClick={loadUsers}
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
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800 dark:border-slate-700 dark:border-t-white"></div>
                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading user records...</p>
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
                <p className="text-rose-600 dark:text-rose-400">{error}</p>
                <button onClick={loadUsers} className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700">Try Again</button>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                        <th className="px-4 py-4 font-semibold">Name</th>
                        <th className="px-4 py-4 font-semibold">Email</th>
                        <th className="px-4 py-4 font-semibold">Role</th>
                        <th className="px-4 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {users.map((u) => (
                        <tr key={u._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="px-4 py-4 font-medium text-slate-800 dark:text-white">
                            {u.fullName || u.name || "N/A"}
                          </td>
                          <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                            {u.email}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                              u.role === "admin" 
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" 
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                            }`}>
                              {u.role || "user"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button className="mr-2 rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:hover:bg-sky-900/40">
                              Edit Role
                            </button>
                            <button className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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