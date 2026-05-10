import React from "react";
import { useTheme } from "../../context/useTheme";

const SupportResponseCard = ({ support }) => {
  const { darkMode } = useTheme();

  if (!support) return null;

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="support-card">
        {/* Ambient glow */}
        <div className="support-glow" />

        {/* Top accent line */}
        <div className="support-bar" />

        <div className="support-content">
          {/* Header */}
          <div className="support-header">
            <div className="support-icon-wrap">
              💙
            </div>

            <div>
              <p className="support-eyebrow">
                Emotional Assistance
              </p>

              <h2 className="support-title">
                Support Response
              </h2>
            </div>
          </div>

          {/* Main response */}
          <div className="support-message-box">
            <p className="support-message">
              {support.supportResponse}
            </p>
          </div>

          {/* Footer note */}
          <div className="support-footer">
            <span className="support-dot" />
            AI-generated wellness guidance based on your emotional analysis
          </div>
        </div>
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  .support-card {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid ${
      darkMode
        ? "rgba(255,255,255,0.08)"
        : "rgba(15,23,42,0.08)"
    };
    background: ${
      darkMode
        ? "rgba(15,23,42,0.72)"
        : "rgba(255,255,255,0.78)"
    };
    backdrop-filter: blur(22px);
    box-shadow: ${
      darkMode
        ? "0 24px 60px rgba(0,0,0,0.28)"
        : "0 24px 60px rgba(15,23,42,0.08)"
    };
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
  }

  .support-glow {
    position: absolute;
    top: -90px;
    right: -90px;
    width: 240px;
    height: 240px;
    background: radial-gradient(
      circle,
      rgba(14,165,233,0.18) 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  .support-bar {
    height: 3px;
    width: 100%;
    background: linear-gradient(
      90deg,
      #14b8a6,
      #0ea5e9,
      #6366f1
    );
    opacity: 0.9;
  }

  .support-content {
    position: relative;
    z-index: 1;
    padding: 26px;
  }

  .support-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 22px;
  }

  .support-icon-wrap {
    width: 54px;
    height: 54px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(14,165,233,0.12);
    border: 1px solid rgba(14,165,233,0.25);
    font-size: 24px;
    flex-shrink: 0;
  }

  .support-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${
      darkMode
        ? "rgba(255,255,255,0.34)"
        : "rgba(15,23,42,0.42)"
    };
    margin-bottom: 5px;
  }

  .support-title {
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: ${
      darkMode
        ? "rgba(255,255,255,0.94)"
        : "#0f172a"
    };
    line-height: 1.1;
  }

  .support-message-box {
    border-radius: 20px;
    padding: 20px 22px;
    background: ${
      darkMode
        ? "rgba(255,255,255,0.04)"
        : "rgba(248,250,252,0.88)"
    };
    border: 1px solid ${
      darkMode
        ? "rgba(255,255,255,0.06)"
        : "rgba(15,23,42,0.06)"
    };
    margin-bottom: 18px;
  }

  .support-message {
    font-size: 14px;
    line-height: 1.85;
    font-weight: 500;
    color: ${
      darkMode
        ? "rgba(255,255,255,0.62)"
        : "rgba(15,23,42,0.68)"
    };
    white-space: pre-line;
  }

  .support-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: ${
      darkMode
        ? "rgba(255,255,255,0.34)"
        : "rgba(15,23,42,0.42)"
    };
  }

  .support-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      #14b8a6,
      #0ea5e9
    );
    flex-shrink: 0;
  }
`;

export default SupportResponseCard;