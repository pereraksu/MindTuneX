import React from "react";
import { useTheme } from "../../context/useTheme";

const RecommendationCard = ({ support }) => {
  const { darkMode } = useTheme();

  if (!support) return null;

  const recommendations = support.recommendations || [];

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="rec-card">
        <div className="rec-glow" />

        <div className="rec-header">
          <p className="rec-eyebrow">Wellness Guidance</p>
          <h2 className="rec-title">Recommendations</h2>
          <p className="rec-subtitle">
            Personalized suggestions based on your emotional state.
          </p>
        </div>

        {!recommendations.length ? (
          <div className="rec-empty">
            <span>💡</span>
            <p>No recommendations available yet.</p>
          </div>
        ) : (
          <div className="rec-list">
            {recommendations.map((item, index) => (
              <div key={index} className="rec-item">
                <div className="rec-icon">✨</div>
                <p>{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  .rec-card {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"};
    padding: 24px;
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    backdrop-filter: blur(22px);
    box-shadow: ${darkMode ? "0 22px 55px rgba(0,0,0,0.28)" : "0 22px 55px rgba(15,23,42,0.08)"};
  }

  .rec-glow {
    position: absolute;
    right: -90px;
    top: -90px;
    width: 240px;
    height: 240px;
    background: radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .rec-header,
  .rec-list,
  .rec-empty {
    position: relative;
    z-index: 1;
  }

  .rec-header {
    margin-bottom: 18px;
  }

  .rec-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 6px;
  }

  .rec-title {
    font-size: 20px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.94)" : "#0f172a"};
    margin-bottom: 4px;
  }

  .rec-subtitle {
    font-size: 13px;
    line-height: 1.6;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
  }

  .rec-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .rec-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    border-radius: 18px;
    padding: 15px 16px;
    background: ${darkMode ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.72)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.075)" : "rgba(15,23,42,0.075)"};
    transition: all 0.2s ease;
  }

  .rec-item:hover {
    transform: translateY(-2px);
    border-color: rgba(20,184,166,0.24);
    background: ${darkMode ? "rgba(20,184,166,0.08)" : "rgba(240,253,250,0.9)"};
  }

  .rec-icon {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(20,184,166,0.12);
    border: 1px solid rgba(20,184,166,0.25);
    font-size: 16px;
  }

  .rec-item p {
    font-size: 13.5px;
    line-height: 1.65;
    font-weight: 600;
    color: ${darkMode ? "rgba(255,255,255,0.62)" : "rgba(15,23,42,0.66)"};
  }

  .rec-empty {
    border-radius: 18px;
    border: 1px dashed ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.12)"};
    background: ${darkMode ? "rgba(255,255,255,0.025)" : "rgba(15,23,42,0.025)"};
    padding: 32px 20px;
    text-align: center;
  }

  .rec-empty span {
    display: block;
    font-size: 28px;
    margin-bottom: 10px;
  }

  .rec-empty p {
    font-size: 13px;
    font-weight: 700;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
  }
`;

export default RecommendationCard;