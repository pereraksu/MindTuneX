import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MindTuneXLogo from "../components/common/MindTuneXLogo";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      const res = await login(formData);
      const role = (res?.user?.role || res?.role || "").toLowerCase();
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="lp-root">
        <div className="lp-glow lp-glow-1" />
        <div className="lp-glow lp-glow-2" />
        <div className="lp-grid" />

        <div className="lp-card">
          <div className="lp-brand">
              <MindTuneXLogo size="md" />
          </div>

          <div className="lp-heading">
            <p className="lp-eyebrow">Secure Login</p>
            <h1>
              Welcome <span>Back</span>
            </h1>
            <p>Sign in to continue your wellness journey.</p>
          </div>

          {error && (
            <div className="lp-error">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="lp-form">
            <div className="lp-field">
              <label>Email Address</label>

              <div className="lp-input-wrap">
                <span className="lp-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="lp-field">
              <label>Password</label>

              <div className="lp-input-wrap">
                <span className="lp-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="lp-password-input"
                />

                <button
                  type="button"
                  className="lp-eye"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="lp-submit">
              {submitting ? (
                <>
                  <span className="lp-spinner" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="lp-footer">
            Don&apos;t have an account?{" "}
            <Link to="/register">Create one free</Link>
          </div>

          <Link to="/" className="lp-home-link">
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

  .lp-root {
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background: #050810;
    font-family: 'DM Sans', system-ui, sans-serif;
    padding: 24px;
  }

  .lp-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(70px);
    z-index: 0;
  }

  .lp-glow-1 {
    top: -160px;
    left: -140px;
    width: 560px;
    height: 560px;
    background: radial-gradient(circle, rgba(20,184,166,0.18), transparent 68%);
  }

  .lp-glow-2 {
    bottom: -180px;
    right: -150px;
    width: 520px;
    height: 520px;
    background: radial-gradient(circle, rgba(14,165,233,0.15), transparent 68%);
  }

  .lp-grid {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: radial-gradient(circle at center, black, transparent 76%);
  }

  .lp-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
    border-radius: 30px;
    border: 1px solid rgba(255,255,255,0.09);
    background: rgba(255,255,255,0.045);
    backdrop-filter: blur(26px);
    box-shadow: 0 30px 90px rgba(0,0,0,0.42);
    padding: 40px 36px 34px;
    animation: lpFadeUp 0.55s ease both;
    overflow: hidden;
  }

  .lp-card::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, #14b8a6, #0ea5e9, #8b5cf6);
  }

  .lp-card::after {
    content: "";
    position: absolute;
    top: -90px;
    right: -90px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(20,184,166,0.12), transparent 70%);
    pointer-events: none;
  }

  @keyframes lpFadeUp {
    from {
      opacity: 0;
      transform: translateY(18px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .lp-brand {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    position: relative;
    z-index: 1;
  }

  .lp-heading {
    text-align: center;
    margin-bottom: 30px;
    position: relative;
    z-index: 1;
  }

  .lp-eyebrow {
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #2dd4bf;
    margin-bottom: 10px;
  }

  .lp-heading h1 {
    font-size: 36px;
    font-weight: 950;
    letter-spacing: -0.055em;
    color: rgba(255,255,255,0.96);
    line-height: 1.05;
  }

  .lp-heading h1 span {
    background: linear-gradient(135deg, #2dd4bf, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .lp-heading p:last-child {
    margin-top: 10px;
    font-size: 14px;
    color: rgba(255,255,255,0.42);
    font-weight: 550;
  }

  .lp-error {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 15px;
    border-radius: 16px;
    background: rgba(244,63,94,0.1);
    border: 1px solid rgba(244,63,94,0.28);
    color: #fb7185;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 18px;
  }

  .lp-form {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .lp-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .lp-field label {
    font-size: 10.5px;
    font-weight: 950;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.36);
    padding-left: 4px;
  }

  .lp-input-wrap {
    position: relative;
  }

  .lp-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    opacity: 0.65;
    pointer-events: none;
  }

  .lp-input-wrap input {
    width: 100%;
    padding: 15px 16px 15px 48px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(0,0,0,0.22);
    color: rgba(255,255,255,0.9);
    font-size: 14px;
    font-weight: 650;
    font-family: inherit;
    outline: none;
    transition: all 0.2s ease;
  }

  .lp-input-wrap input::placeholder {
    color: rgba(255,255,255,0.24);
    font-weight: 500;
  }

  .lp-input-wrap input:focus {
    border-color: rgba(20,184,166,0.52);
    box-shadow: 0 0 0 4px rgba(20,184,166,0.11);
    background: rgba(0,0,0,0.28);
  }

  .lp-password-input {
    padding-right: 54px !important;
  }

  .lp-eye {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.09);
    width: 34px;
    height: 34px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .lp-eye:hover {
    background: rgba(255,255,255,0.1);
  }

  .lp-submit {
    margin-top: 8px;
    width: 100%;
    padding: 15px 18px;
    border-radius: 16px;
    border: none;
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    color: #fff;
    font-family: inherit;
    font-size: 15px;
    font-weight: 950;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 16px 34px rgba(20,184,166,0.28);
    transition: all 0.2s ease;
  }

  .lp-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 20px 42px rgba(20,184,166,0.38);
  }

  .lp-submit:disabled {
    opacity: 0.62;
    cursor: not-allowed;
  }

  .lp-spinner {
    width: 16px;
    height: 16px;
    border: 2.5px solid rgba(255,255,255,0.34);
    border-top-color: #fff;
    border-radius: 50%;
    animation: lpSpin 0.75s linear infinite;
  }

  @keyframes lpSpin {
    to {
      transform: rotate(360deg);
    }
  }

  .lp-footer {
    position: relative;
    z-index: 1;
    margin-top: 28px;
    text-align: center;
    font-size: 13.5px;
    color: rgba(255,255,255,0.42);
    font-weight: 600;
  }

  .lp-footer a,
  .lp-home-link {
    color: #2dd4bf;
    font-weight: 900;
    text-decoration: none;
  }

  .lp-footer a:hover,
  .lp-home-link:hover {
    color: #67e8f9;
  }

  .lp-home-link {
    position: relative;
    z-index: 1;
    display: block;
    margin-top: 16px;
    text-align: center;
    font-size: 12.5px;
  }

  @media (max-width: 520px) {
    .lp-root {
      padding: 18px;
    }

    .lp-card {
      padding: 34px 24px 28px;
      border-radius: 26px;
    }

    .lp-heading h1 {
      font-size: 32px;
    }
  }
`;

export default LoginPage;