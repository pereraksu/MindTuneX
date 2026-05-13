import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";
import MindTuneXLogo from "../components/common/MindTuneXLogo";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const isPasswordValid = passwordRegex.test(formData.password);

  const handleChange = (e) =>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number."
      );
      return;
    }

    try {
      setSubmitting(true);
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const strength =
    formData.password.length === 0
      ? ""
      : !isPasswordValid
      ? "Needs uppercase, lowercase & number"
      : "Strong";

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="rg-root">
        <div className="rg-glow rg-glow-1" />
        <div className="rg-glow rg-glow-2" />
        <div className="rg-grid" />

        <div className="rg-card-wrap">
          <div className="rg-card">
            <div className="rg-brand">
              <MindTuneXLogo size="md" showTagline={false} />
            </div>

            <div className="rg-heading">
              <h1 className="rg-title">
                Create <span>Account</span>
              </h1>
              <p className="rg-subtitle">
                Start your MindTuneX wellness journey today.
              </p>
            </div>

            {error && <div className="rg-error">⚠️ {error}</div>}

            <form onSubmit={handleSubmit} className="rg-form">
              <Field
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                icon="👤"
              />

              <Field
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                icon="✉️"
              />

              <div className="rg-field">
                <label className="rg-label">Password</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="rg-input rg-input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="rg-eye-btn"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                <p className="rg-password-hint">
                  Must be 8+ characters with uppercase, lowercase & number.
                </p>
              </div>

              {formData.password.length > 0 && (
                <div className="rg-strength">
                  <div className="rg-strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="rg-strength-bar"
                        style={{
                          background:
                            isPasswordValid && formData.password.length >= i * 2
                              ? "#10b981"
                              : !isPasswordValid &&
                                formData.password.length >= i * 2
                              ? "#f97316"
                              : darkMode
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(15,23,42,0.1)",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className={`rg-strength-label ${
                      isPasswordValid ? "valid" : "invalid"
                    }`}
                  >
                    {strength}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="rg-btn-submit"
              >
                {submitting ? (
                  <>
                    <span className="rg-spinner" />
                    Creating account…
                  </>
                ) : (
                  <>Create Account →</>
                )}
              </button>
            </form>

            <div className="rg-footer">
              Already have an account?{" "}
              <Link to="/login" className="rg-footer-link">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Field = ({ label, icon, ...props }) => (
  <div className="rg-field">
    <label className="rg-label">{label}</label>
    <div className="rg-input-wrap">
      <span className="rg-input-icon">{icon}</span>
      <input {...props} required className="rg-input" />
    </div>
  </div>
);

const STYLES = (darkMode) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

  .rg-root {
    position: relative;
    min-height: 100svh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    font-family: 'DM Sans', system-ui, sans-serif;
    background: ${
      darkMode
        ? "radial-gradient(circle at top left, rgba(20,184,166,0.14), transparent 35%), radial-gradient(circle at bottom right, rgba(14,165,233,0.12), transparent 40%), #050810"
        : "linear-gradient(135deg, #ecfeff 0%, #f8fafc 48%, #eef2ff 100%)"
    };
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .rg-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(70px);
  }

  .rg-glow-1 {
    top: -120px;
    left: -100px;
    width: 520px;
    height: 520px;
    background: rgba(20,184,166,0.16);
  }

  .rg-glow-2 {
    bottom: -140px;
    right: -120px;
    width: 500px;
    height: 500px;
    background: rgba(14,165,233,0.14);
  }

  .rg-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(${darkMode ? "rgba(255,255,255,0.018)" : "rgba(15,23,42,0.035)"} 1px, transparent 1px),
      linear-gradient(90deg, ${darkMode ? "rgba(255,255,255,0.018)" : "rgba(15,23,42,0.035)"} 1px, transparent 1px);
    background-size: 52px 52px;
  }

  .rg-card-wrap {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 430px;
  }

  .rg-card {
    border-radius: 30px;
    padding: 38px 34px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.82)"};
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    box-shadow: ${darkMode ? "0 30px 80px rgba(0,0,0,0.55)" : "0 30px 80px rgba(15,23,42,0.12)"};
  }

  .rg-brand {
    display: flex;
    justify-content: center;
    margin-bottom: 28px;
  }

  .rg-heading {
    text-align: center;
    margin-bottom: 26px;
  }

  .rg-title {
    font-size: 34px;
    font-weight: 900;
    letter-spacing: -0.055em;
    line-height: 1.05;
    color: ${darkMode ? "rgba(255,255,255,0.96)" : "#0f172a"};
  }

  .rg-title span {
    background: linear-gradient(135deg,#14b8a6,#38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .rg-subtitle {
    margin-top: 9px;
    font-size: 14px;
    font-weight: 600;
    color: ${darkMode ? "rgba(255,255,255,0.44)" : "rgba(15,23,42,0.55)"};
  }

  .rg-error {
    margin-bottom: 18px;
    padding: 12px 15px;
    border-radius: 16px;
    background: rgba(244,63,94,0.1);
    border: 1px solid rgba(244,63,94,0.28);
    color: #fb7185;
    font-size: 13px;
    font-weight: 700;
  }

  .rg-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .rg-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .rg-label {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.48)"};
    padding-left: 3px;
  }

  .rg-input-wrap {
    position: relative;
  }

  .rg-input-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    opacity: 0.55;
  }

  .rg-input {
    width: 100%;
    box-sizing: border-box;
    border-radius: 16px;
    padding: 14px 15px 14px 44px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)"};
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.9)"};
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: all 0.22s ease;
  }

  .rg-input::placeholder {
    color: ${darkMode ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.36)"};
  }

  .rg-input:focus {
    border-color: rgba(20,184,166,0.58);
    box-shadow: 0 0 0 4px rgba(20,184,166,0.13);
    background: ${darkMode ? "rgba(255,255,255,0.075)" : "#ffffff"};
  }

  .rg-input-password {
    padding-right: 52px;
  }

  .rg-eye-btn {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
    opacity: 0.65;
  }

  .rg-password-hint {
    margin: -2px 0 0 3px;
    font-size: 11.5px;
    font-weight: 700;
    color: ${darkMode ? "rgba(94,234,212,0.78)" : "rgba(13,148,136,0.85)"};
  }

  .rg-strength {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: -3px;
  }

  .rg-strength-bars {
    display: flex;
    gap: 4px;
    flex: 1;
  }

  .rg-strength-bar {
    height: 4px;
    flex: 1;
    border-radius: 999px;
    transition: background 0.3s ease;
  }

  .rg-strength-label {
    font-size: 11px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.48)"};
  }

  .rg-strength-label.valid {
    color: #10b981;
  }

  .rg-strength-label.invalid {
    color: #f97316;
  }

  .rg-btn-submit {
    margin-top: 6px;
    width: 100%;
    padding: 15px;
    border-radius: 16px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 15px;
    font-weight: 900;
    color: #fff;
    background: linear-gradient(135deg,#14b8a6,#0ea5e9);
    box-shadow: 0 16px 34px rgba(20,184,166,0.28);
    transition: all 0.2s ease;
  }

  .rg-btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 20px 42px rgba(20,184,166,0.36);
  }

  .rg-btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  .rg-spinner {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 8px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    animation: rg-spin 0.7s linear infinite;
  }

  @keyframes rg-spin {
    to { transform: rotate(360deg); }
  }

  .rg-footer {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.08)"};
    text-align: center;
    font-size: 13.5px;
    font-weight: 600;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.55)"};
  }

  .rg-footer-link {
    color: #14b8a6;
    font-weight: 900;
    text-decoration: none;
  }

  .rg-footer-link:hover {
    color: #2dd4bf;
  }

  @media(max-width:480px) {
    .rg-card {
      padding: 32px 24px;
      border-radius: 26px;
    }

    .rg-title {
      font-size: 30px;
    }
  }
`;

export default RegisterPage;