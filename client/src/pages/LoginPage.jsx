import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

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

      const res = await login(formData);
      const loggedInUser = res?.user || res;
      const role = (loggedInUser?.role || "").toLowerCase();

      console.log("Login Success. User Role:", role);

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8">
      {/* Background blobs */}
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px]" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-sky-500 shadow-lg shadow-cyan-500/25">
              <Sparkles className="h-6 w-6 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-white">
              Welcome <span className="text-cyan-400">Back</span>
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Sign in to your MindTuneX account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Email Address
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400/60 focus:bg-white/10 focus:ring-4 focus:ring-cyan-400/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Password
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400/60 focus:bg-white/10 focus:ring-4 focus:ring-cyan-400/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 hover:from-teal-400 hover:to-sky-500 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
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

          {/* Footer */}
          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-slate-300">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-cyan-400 transition hover:text-cyan-300 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;