import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";
import MindTuneXLogo from "../components/common/MindTuneXLogo";
import { useTheme } from "../context/useTheme";

export default function PrivacyConsentPage() {
  const { darkMode } = useTheme();

  return (
    <>
      <style>{PRIVACY_STYLES(darkMode)}</style>

      <div className="privacy-root">
        <div className="privacy-glow privacy-glow-1" />
        <div className="privacy-glow privacy-glow-2" />
        <div className="privacy-glow privacy-glow-3" />
        <div className="privacy-grid-bg" />

        <nav className="privacy-nav">
          <Link to="/" className="privacy-logo-link">
            <MindTuneXLogo />
          </Link>

          <div className="privacy-nav-links">
            <Link to="/" className="privacy-nav-link">Home</Link>
            <Link to="/about-mindtunex" className="privacy-nav-link">About</Link>
            <Link to="/login" className="privacy-nav-link">Sign In</Link>
            <Link to="/register" className="privacy-nav-cta">Get Started</Link>
          </div>
        </nav>

        <main className="privacy-main">
          <section className="privacy-hero">
            <div className="privacy-badge">
              <span className="privacy-badge-dot" />
              Privacy-first mental wellness
            </div>

            <h1>
              Privacy & <span>Consent</span>
            </h1>

            <p>
              MindTuneX protects user trust, emotional safety, and personal
              wellbeing data through transparent consent, secure data handling,
              and responsible AI practices.
            </p>
          </section>

          <section className="privacy-grid">
            <PrivacyCard
              number="01"
              title="What data we collect"
              text="MindTuneX may collect journal entries, mood check-ins, emotion prediction results, recommendation activity, and basic account information required to provide personalised wellbeing support."
            />

            <PrivacyCard
              number="02"
              title="How your data is used"
              text="Data is used to analyse emotional patterns, generate personalised recommendations, improve dashboards, and provide safer AI-assisted wellbeing support."
            />

            <PrivacyCard
              number="03"
              title="Consent and user control"
              text="Users provide consent before using emotional analysis features. They should be able to review, update, or delete their personal wellbeing data where supported by the system."
            />

            <PrivacyCard
              number="04"
              title="AI transparency"
              text="MindTuneX uses AI to detect emotional states from text. The system does not replace professional mental health care and should be treated as supportive guidance only."
            />

            <PrivacyCard
              number="05"
              title="Data security"
              text="The platform follows security-focused design practices such as authenticated access, protected sessions, encrypted data handling, and restricted access to sensitive wellbeing records."
            />

            <PrivacyCard
              number="06"
              title="Ethical limitation"
              text="MindTuneX does not provide diagnosis, crisis intervention, or emergency treatment. It is designed for self-awareness, emotional reflection, and supportive wellbeing guidance."
            />
          </section>

          <section className="privacy-consent-box">
            <div>
              <p className="privacy-eyebrow">User Consent Statement</p>
              <h2>Understand how AI supports your wellbeing</h2>
              <p>
                By continuing to use MindTuneX, users acknowledge that submitted
                text may be analysed by AI to provide emotion insights, mood
                trends, and personalised recommendations.
              </p>
            </div>

            <div className="privacy-actions">
              <Link to="/about-mindtunex" className="privacy-btn-secondary">
                Learn About MindTuneX
              </Link>

              <Link to="/register" className="privacy-cta">
                I Understand & Continue →
              </Link>
            </div>
          </section>
        </main>

        <div className="privacy-footer-wrap">
          <Footer />
        </div>
      </div>
    </>
  );
}

const PrivacyCard = ({ number, title, text }) => (
  <div className="privacy-card">
    <div className="privacy-card-line" />
    <div className="privacy-card-top">
      <span className="privacy-number">{number}</span>
      <div className="privacy-icon">🔐</div>
    </div>
    <h2>{title}</h2>
    <p>{text}</p>
  </div>
);

const PRIVACY_STYLES = (darkMode) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');

  .privacy-root {
    position: relative;
    min-height: 100svh;
    overflow-x: hidden;
    background: ${
      darkMode
        ? "radial-gradient(circle at top left, rgba(20,184,166,0.12), transparent 34%), #050810"
        : "linear-gradient(135deg, #ecfeff 0%, #f8fafc 48%, #eef9ff 100%)"
    };
    color: ${darkMode ? "#ffffff" : "#0f172a"};
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .privacy-grid-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      linear-gradient(${darkMode ? "rgba(255,255,255,0.025)" : "rgba(15,23,42,0.035)"} 1px, transparent 1px),
      linear-gradient(90deg, ${darkMode ? "rgba(255,255,255,0.025)" : "rgba(15,23,42,0.035)"} 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: radial-gradient(circle at center, black, transparent 75%);
  }

  .privacy-glow {
    position: fixed;
    border-radius: 999px;
    pointer-events: none;
    z-index: 0;
    filter: blur(70px);
    opacity: ${darkMode ? "0.35" : "0.22"};
  }

  .privacy-glow-1 {
    top: -120px;
    left: -120px;
    width: 460px;
    height: 460px;
    background: #14b8a6;
  }

  .privacy-glow-2 {
    top: 28%;
    right: -140px;
    width: 420px;
    height: 420px;
    background: #0ea5e9;
  }

  .privacy-glow-3 {
    bottom: 8%;
    left: 25%;
    width: 360px;
    height: 360px;
    background: #8b5cf6;
  }

  .privacy-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 32px;
    border-bottom: 1px solid ${
      darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.08)"
    };
    background: ${
      darkMode ? "rgba(5,8,16,0.84)" : "rgba(255,255,255,0.86)"
    };
    backdrop-filter: blur(22px);
  }

  .privacy-logo-link {
    text-decoration: none;
  }

  .privacy-nav-links {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .privacy-nav-link {
    font-size: 13px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.58)" : "rgba(15,23,42,0.62)"};
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .privacy-nav-link:hover {
    color: ${darkMode ? "#ffffff" : "#0f172a"};
  }

  .privacy-nav-cta {
    padding: 9px 18px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 900;
    color: #ffffff;
    text-decoration: none;
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    box-shadow: 0 14px 34px rgba(20,184,166,0.24);
  }

  .privacy-main {
    position: relative;
    z-index: 1;
    max-width: 1120px;
    margin: 0 auto;
    padding: 140px 24px 90px;
  }

  .privacy-hero {
    text-align: center;
    max-width: 860px;
    margin: 0 auto 50px;
    animation: privacyFadeUp 0.55s ease both;
  }

  @keyframes privacyFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .privacy-badge {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 9px 17px;
    border-radius: 999px;
    margin-bottom: 26px;
    border: 1px solid rgba(20,184,166,0.25);
    background: rgba(20,184,166,0.10);
    font-size: 12px;
    font-weight: 900;
    color: ${darkMode ? "#5eead4" : "#0f766e"};
    letter-spacing: 0.04em;
  }

  .privacy-badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #14b8a6;
    box-shadow: 0 0 0 6px rgba(20,184,166,0.16);
  }

  .privacy-hero h1 {
    margin: 0;
    font-size: clamp(42px, 7vw, 78px);
    font-weight: 950;
    line-height: 1.02;
    letter-spacing: -0.06em;
    color: ${darkMode ? "rgba(255,255,255,0.96)" : "#0f172a"};
  }

  .privacy-hero h1 span {
    background: linear-gradient(135deg, #2dd4bf, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .privacy-hero p {
    max-width: 760px;
    margin: 24px auto 0;
    font-size: 16px;
    color: ${darkMode ? "rgba(255,255,255,0.50)" : "rgba(15,23,42,0.65)"};
    line-height: 1.8;
    font-weight: 600;
  }

  .privacy-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  .privacy-card,
  .privacy-consent-box {
    position: relative;
    overflow: hidden;
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"
    };
    background: ${
      darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.78)"
    };
    backdrop-filter: blur(24px);
    box-shadow: ${
      darkMode
        ? "0 26px 70px rgba(0,0,0,0.28)"
        : "0 24px 60px rgba(15,23,42,0.08)"
    };
  }

  .privacy-card {
    border-radius: 26px;
    padding: 26px;
    transition: all 0.22s ease;
  }

  .privacy-card:hover {
    transform: translateY(-5px);
    border-color: rgba(20,184,166,0.28);
  }

  .privacy-card-line {
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, #14b8a6, #0ea5e9, #818cf8);
  }

  .privacy-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
  }

  .privacy-number {
    font-size: 42px;
    font-weight: 950;
    letter-spacing: -0.06em;
    color: ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.10)"};
    line-height: 1;
  }

  .privacy-icon {
    width: 50px;
    height: 50px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(20,184,166,0.10);
    border: 1px solid rgba(20,184,166,0.22);
    font-size: 22px;
  }

  .privacy-card h2,
  .privacy-consent-box h2 {
    margin: 0 0 12px;
    font-size: 20px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.92)" : "#0f172a"};
    letter-spacing: -0.025em;
  }

  .privacy-card p,
  .privacy-consent-box p {
    margin: 0;
    font-size: 14px;
    line-height: 1.75;
    color: ${darkMode ? "rgba(255,255,255,0.48)" : "rgba(15,23,42,0.62)"};
    font-weight: 600;
  }

  .privacy-consent-box {
    margin-top: 24px;
    border-radius: 34px;
    padding: 34px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
    align-items: center;
    background: ${
      darkMode
        ? "linear-gradient(135deg, rgba(20,184,166,0.08), rgba(14,165,233,0.06)), rgba(255,255,255,0.04)"
        : "linear-gradient(135deg, rgba(20,184,166,0.12), rgba(14,165,233,0.10)), rgba(255,255,255,0.84)"
    };
  }

  .privacy-eyebrow {
    margin-bottom: 10px !important;
    font-size: 10px !important;
    font-weight: 950 !important;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #14b8a6 !important;
  }

  .privacy-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 240px;
  }

  .privacy-cta,
  .privacy-btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 22px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 950;
    text-decoration: none;
    transition: transform 0.2s ease;
    white-space: nowrap;
  }

  .privacy-cta {
    color: #ffffff;
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    box-shadow: 0 14px 34px rgba(20,184,166,0.28);
  }

  .privacy-btn-secondary {
    color: ${darkMode ? "rgba(255,255,255,0.82)" : "#0f172a"};
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.10)"
    };
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.75)"};
  }

  .privacy-cta:hover,
  .privacy-btn-secondary:hover,
  .privacy-nav-cta:hover {
    transform: translateY(-2px);
  }

  .privacy-footer-wrap {
    position: relative;
    z-index: 1;
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 24px 34px;
  }

  @media (max-width: 900px) {
    .privacy-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .privacy-consent-box {
      grid-template-columns: 1fr;
    }

    .privacy-actions {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }

  @media (max-width: 640px) {
    .privacy-nav {
      padding: 14px 18px;
    }

    .privacy-nav-link {
      display: none;
    }

    .privacy-main {
      padding: 120px 18px 70px;
    }

    .privacy-grid {
      grid-template-columns: 1fr;
    }

    .privacy-consent-box {
      padding: 26px;
    }

    .privacy-actions {
      flex-direction: column;
    }

    .privacy-cta,
    .privacy-btn-secondary {
      width: 100%;
    }

    .privacy-footer-wrap {
      padding: 0 18px 28px;
    }
  }
`;