import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const { darkMode } = useTheme();

  // Loading State
  if (loading) {
    return (
      <>
        <style>{STYLES(darkMode)}</style>

        <div className="ar-root">
          <div className="ar-glow ar-glow-1" />
          <div className="ar-glow ar-glow-2" />
          <div className="ar-grid" />

          <div className="ar-card">
            <div className="ar-spinner-wrap">
              <div className="ar-spinner-ring" />
              <div className="ar-spinner-core" />
            </div>

            <p className="ar-eyebrow">MindTuneX Security</p>

            <h1 className="ar-title">
              Verifying <span>Admin Access</span>
            </h1>

            <p className="ar-subtitle">
              Please wait while we securely validate administrator credentials
              and permissions.
            </p>

            <div className="ar-progress">
              <div className="ar-progress-bar" />
            </div>

            <p className="ar-status">Checking authentication status…</p>
          </div>
        </div>
      </>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Access granted
  return children;
};

const STYLES = (darkMode) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

  .ar-root {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    font-family: 'DM Sans', system-ui, sans-serif;

    background: ${
      darkMode
        ? "radial-gradient(circle at top left, rgba(139,92,246,0.15), transparent 32%), #050810"
        : "linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f5f3ff 100%)"
    };
  }

  .ar-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(${darkMode ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.04)"} 1px, transparent 1px),
      linear-gradient(90deg, ${darkMode ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.04)"} 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(circle at center, black, transparent 80%);
  }

  .ar-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;
  }

  .ar-glow-1 {
    top: -120px;
    left: -100px;
    width: 420px;
    height: 420px;
    background: rgba(139,92,246,0.18);
  }

  .ar-glow-2 {
    bottom: -120px;
    right: -100px;
    width: 360px;
    height: 360px;
    background: rgba(14,165,233,0.16);
  }

  .ar-card {
    position: relative;
    z-index: 2;

    width: 100%;
    max-width: 460px;

    border-radius: 30px;
    padding: 42px 34px;

    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"
    };

    background: ${
      darkMode
        ? "rgba(255,255,255,0.05)"
        : "rgba(255,255,255,0.82)"
    };

    backdrop-filter: blur(26px);

    box-shadow: ${
      darkMode
        ? "0 30px 80px rgba(0,0,0,0.35)"
        : "0 30px 80px rgba(15,23,42,0.12)"
    };

    text-align: center;
    overflow: hidden;
  }

  .ar-card::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      #8b5cf6,
      #6366f1,
      #0ea5e9
    );
  }

  .ar-spinner-wrap {
    position: relative;
    width: 88px;
    height: 88px;
    margin: 0 auto 24px;
  }

  .ar-spinner-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 5px solid rgba(139,92,246,0.15);
    border-top-color: #8b5cf6;
    animation: arSpin 1s linear infinite;
  }

  .ar-spinner-core {
    position: absolute;
    inset: 18px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      #8b5cf6,
      #6366f1,
      #0ea5e9
    );
    box-shadow: 0 0 25px rgba(139,92,246,0.35);
  }

  @keyframes arSpin {
    to {
      transform: rotate(360deg);
    }
  }

  .ar-eyebrow {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #8b5cf6;
    margin-bottom: 10px;
  }

  .ar-title {
    font-size: clamp(30px, 5vw, 42px);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.05em;
    margin-bottom: 14px;
    color: ${
      darkMode
        ? "rgba(255,255,255,0.95)"
        : "#0f172a"
    };
  }

  .ar-title span {
    background: linear-gradient(
      135deg,
      #8b5cf6,
      #6366f1,
      #0ea5e9
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .ar-subtitle {
    font-size: 14px;
    line-height: 1.8;
    font-weight: 500;
    margin-bottom: 26px;

    color: ${
      darkMode
        ? "rgba(255,255,255,0.42)"
        : "rgba(15,23,42,0.58)"
    };
  }

  .ar-progress {
    position: relative;
    overflow: hidden;

    width: 100%;
    height: 6px;

    border-radius: 999px;

    background: ${
      darkMode
        ? "rgba(255,255,255,0.06)"
        : "rgba(15,23,42,0.08)"
    };

    margin-bottom: 18px;
  }

  .ar-progress-bar {
    position: absolute;
    inset: 0;
    width: 40%;

    border-radius: 999px;

    background: linear-gradient(
      90deg,
      #8b5cf6,
      #6366f1,
      #0ea5e9
    );

    animation: arLoad 1.4s ease-in-out infinite;
  }

  @keyframes arLoad {
    0% {
      left: -40%;
    }
    100% {
      left: 100%;
    }
  }

  .ar-status {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;

    color: ${
      darkMode
        ? "rgba(255,255,255,0.32)"
        : "rgba(15,23,42,0.46)"
    };

    animation: arPulse 1.8s ease infinite;
  }

  @keyframes arPulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.45;
    }
  }

  @media (max-width: 640px) {
    .ar-card {
      padding: 36px 24px;
      border-radius: 26px;
    }

    .ar-title {
      font-size: 34px;
    }

    .ar-subtitle {
      font-size: 13px;
    }
  }
`;

export default AdminRoute;