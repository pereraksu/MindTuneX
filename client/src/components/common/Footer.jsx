import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/useTheme";
import MindTuneXLogo from "./MindTuneXLogo";

const Footer = ({ admin = false }) => {
  const { darkMode } = useTheme();

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <footer className="mtx-footer">
        <div className="footer-brand">
          <MindTuneXLogo size="md" showTagline={false} />

          <p>
            AI-powered emotional wellness platform designed to support mood
            tracking, journal analysis, and personalized wellbeing insights.
          </p>

          <div className="footer-socials">
            <a
              href="https://www.linkedin.com/in/sasini-uththara-b06508277/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              LI
            </a>

            <a
              href="https://github.com/pereraksu"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              GH
            </a>

            <a href="mailto:sasiniuththara341@gmail.com" aria-label="Email">
              EM
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h4>{admin ? "Admin Links" : "Quick Links"}</h4>

          {!admin ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/journal">Journal</Link>
              <Link to="/mood-analysis">Mood Analysis</Link>
              <Link to="/reports">Reports</Link>
              <Link to="/support">Support</Link>
              <Link to="/privacy-consent">Privacy & Consent</Link>
              <Link to="/about-mindtunex">About</Link>
            </>
          ) : (
            <>
              <Link to="/admin/dashboard">Admin Dashboard</Link>
              <Link to="/admin/users">Manage Users</Link>
              <Link to="/admin/alerts">Risk Alerts</Link>
              <Link to="/admin/reports">System Reports</Link>
            </>
          )}
        </div>

        <div className="footer-note">
          <div className="footer-badge">
            <span>🛡️</span>
            <span>Academic Project</span>
          </div>

          <p>
            MindTuneX is an AI-powered mental wellness web application that
            utilizes NLP for emotion detection, offering personalized mood-based
            recommendations and comprehensive risk monitoring.
          </p>

          <span className="copyright">© 2026 MindTuneX v1.0</span>
        </div>
      </footer>
    </>
  );
};

const STYLES = (darkMode) => `
.mtx-footer {
  width: 100%;
  padding: 22px 26px;
  border-radius: 26px;
  position: relative;
  overflow: hidden;

  border: 1px solid ${
    darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"
  };

  background: ${
    darkMode ? "rgba(15,23,42,0.74)" : "rgba(255,255,255,0.78)"
  };

  backdrop-filter: blur(22px);

  box-shadow: ${
    darkMode
      ? "0 24px 60px rgba(0,0,0,0.24)"
      : "0 24px 60px rgba(15,23,42,0.07)"
  };

  display: grid;
  grid-template-columns: 1.5fr 0.8fr 1.2fr;
  gap: 28px;
}

.mtx-footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 2px;

  background: linear-gradient(
    90deg,
    #14b8a6,
    #38bdf8,
    #8b5cf6
  );
}

.footer-brand,
.footer-links,
.footer-note {
  position: relative;
  z-index: 1;
}

.footer-brand p,
.footer-note p {
  margin-top: 14px;
  font-size: 13px;
  line-height: 1.75;

  color: ${
    darkMode ? "rgba(255,255,255,0.48)" : "rgba(15,23,42,0.56)"
  };
}

.footer-socials {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.footer-socials a {
  width: 36px;
  height: 36px;

  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.06em;
  text-decoration: none;

  color: ${
    darkMode ? "rgba(255,255,255,0.72)" : "rgba(15,23,42,0.68)"
  };

  background: ${
    darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"
  };

  border: 1px solid ${
    darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"
  };

  transition: all 0.2s ease;
}

.footer-socials a:hover {
  transform: translateY(-2px);
  color: #14b8a6;
  border-color: rgba(20,184,166,0.35);
  background: rgba(20,184,166,0.1);
}

.footer-links {
  display: flex;
  flex-direction: column;
}

.footer-links h4 {
  font-size: 13px;
  font-weight: 950;
  margin-bottom: 14px;

  color: ${darkMode ? "rgba(255,255,255,0.88)" : "#0f172a"};
}

.footer-links a {
  width: fit-content;
  margin-bottom: 7px;

  font-size: 13px;
  font-weight: 700;

  text-decoration: none;

  color: ${
    darkMode ? "rgba(255,255,255,0.48)" : "rgba(15,23,42,0.56)"
  };

  transition: all 0.2s ease;
}

.footer-links a:hover {
  color: #14b8a6;
  transform: translateX(3px);
}

.footer-badge {
  width: fit-content;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 8px 13px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 900;

  color: #14b8a6;

  background: rgba(20,184,166,0.1);

  border: 1px solid rgba(20,184,166,0.22);
}

.copyright {
  display: block;
  margin-top: 14px;

  font-size: 12px;
  font-weight: 800;

  color: ${
    darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.44)"
  };
}

@media(max-width: 900px) {
  .mtx-footer {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
`;

export default Footer;