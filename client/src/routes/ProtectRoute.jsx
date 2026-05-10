import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";

const ProtectRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { darkMode } = useTheme();

  // Loading State
  if (loading) {
    return (
      <>
        <style>{STYLES(darkMode)}</style>

        <div className="pr-root">
          <div className="pr-glow pr-glow-1" />
          <div className="pr-glow pr-glow-2" />
          <div className="pr-grid" />

          <div className="pr-card">
            <div className="pr-spinner-wrap">
              <div className="pr-spinner-ring" />
              <div className="pr-spinner-core" />
            </div>

            <p className="pr-eyebrow">MindTuneX Security</p>

            <h1 className="pr-title">
              Checking <span>Authentication</span>
            </h1>

            <p className="pr-subtitle">
              Please wait while we securely verify your account and session
              credentials.
            </p>

            <div className="pr-progress">
              <div className="pr-progress-bar" />
            </div>

            <p className="pr-status">Validating secure access…</p>
          </div>
        </div>
      </>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authorized
  return children;
};

const STYLES = (darkMode) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

  .pr-root {
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
        ? "radial-gradient(circle at top left, rgba(249,115,22,0.14), transparent 34%), #050810"
        : "linear-gradient(135deg, #fff7ed 0%, #f8fafc 48%, #fef3c7 100%)"
    };
  }

  .pr-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;

    background-image:
      linear-gradient(${darkMode ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.04)"} 1px, transparent 1px),
      linear-gradient(90deg, ${darkMode ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.04)"} 1px, transparent 1px);

    background-size: 48px 48px;

    mask-image: radial-gradient(circle at center, black, transparent 80%);
  }

  .pr-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;
  }

  .pr-glow-1 {
    top: -120px;
    left: -100px;
    width: 420px;
    height: 420px;
    background: rgba(249,115,22,0.18);
  }

  .pr-glow-2 {
    bottom: -120px;
    right: -100px;
    width: 360px;
    height: 360px;
    background: rgba(251,191,36,0.18);
  }

  .pr-card {
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

  .pr-card::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;

    background: linear-gradient(
      90deg,
      #f97316,
      #f59e0b,
      #fb923c
    );
  }

  .pr-spinner-wrap {
    position: relative;
    width: 88px;
    height: 88px;
    margin: 0 auto 24px;
  }

  .pr-spinner-ring {
    position: absolute;
    inset: 0;

    border-radius: 50%;
    border: 5px solid rgba(249,115,22,0.15);
    border-top-color: #f97316;

    animation: prSpin 1s linear infinite;
  }

  .pr-spinner-core {
    position: absolute;
    inset: 18px;

    border-radius: 50%;

    background: linear-gradient(
      135deg,
      #f97316,
      #f59e0b,
      #fb923c
    );

    box-shadow: 0 0 25px rgba(249,115,22,0.35);
  }

  @keyframes prSpin {
    to {
      transform: rotate(360deg);
    }
  }

  .pr-eyebrow {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.24em;
    text-transform: uppercase;

    color: #f97316;

    margin-bottom: 10px;
  }

  .pr-title {
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

  .pr-title span {
    background: linear-gradient(
      135deg,
      #f97316,
      #f59e0b,
      #fb923c
    );

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .pr-subtitle {
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

  .pr-progress {
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

  .pr-progress-bar {
    position: absolute;
    inset: 0;

    width: 40%;

    border-radius: 999px;

    background: linear-gradient(
      90deg,
      #f97316,
      #f59e0b,
      #fb923c
    );

    animation: prLoad 1.4s ease-in-out infinite;
  }

  @keyframes prLoad {
    0% {
      left: -40%;
    }

    100% {
      left: 100%;
    }
  }

  .pr-status {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;

    color: ${
      darkMode
        ? "rgba(255,255,255,0.32)"
        : "rgba(15,23,42,0.46)"
    };

    animation: prPulse 1.8s ease infinite;
  }

  @keyframes prPulse {
    0%,100% {
      opacity: 1;
    }

    50% {
      opacity: 0.45;
    }
  }

  @media (max-width: 640px) {
    .pr-card {
      padding: 36px 24px;
      border-radius: 26px;
    }

    .pr-title {
      font-size: 34px;
    }

    .pr-subtitle {
      font-size: 13px;
    }
  }
`;

export default ProtectRoute;