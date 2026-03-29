import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      
      // 🚀 1. AuthContext එකේ login function එක හරහා login වීම
      const res = await login(formData);
      
      // 🚀 2. Backend එකෙන් එන data structure එක අනුව User සහ Role එක නිවැරදිව හඳුනාගැනීම
      // (res.user හෝ res ඇතුළේ තිබිය හැක)
      const loggedInUser = res?.user || res;
      const role = (loggedInUser?.role || "").toLowerCase();

      console.log("Login Success. User Role:", role);

      // 🚀 3. Role එක අනුව අදාළ Dashboard එකට Navigate කිරීම
      if (role === "admin") {
        // Admin Dashboard එකට යවයි
        navigate("/admin/dashboard");
      } else {
        // සාමාන්‍ය User Dashboard එකට යවයි
        navigate("/dashboard");
      }
      
    } catch (err) {
      console.error("Login Error:", err);
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-sky-100 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Welcome <span className="text-sky-600">Back</span></h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to your MindTuneX account</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-sky-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-sky-200 transition-all hover:bg-sky-700 hover:shadow-sky-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-bold text-sky-600 hover:text-sky-700 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;