import { Link } from "react-router-dom";
import MindTuneXLogo from "../components/common/MindTuneXLogo";
import Footer from "../components/common/Footer";
import { useTheme } from "../context/useTheme";

export default function AboutMindTuneXPage() {
  const { darkMode } = useTheme();

  return (
    <>
      <style>{ABOUT_STYLES(darkMode)}</style>

      <div className="about-root">
        <div className="about-glow about-glow-1" />
        <div className="about-glow about-glow-2" />
        <div className="about-glow about-glow-3" />
        <div className="about-grid-bg" />

        <nav className="about-nav">
          <Link to="/" className="about-logo-link">
            <MindTuneXLogo />
          </Link>

          <div className="about-nav-links">
            <Link to="/" className="about-nav-link">Home</Link>
            <Link to="/privacy-consent" className="about-nav-link">Privacy</Link>
            <Link to="/login" className="about-nav-link">Sign In</Link>
            <Link to="/register" className="about-nav-cta">Get Started</Link>
          </div>
        </nav>

        <main className="about-main">
          <section className="about-hero">
            <div className="about-badge">
              <span className="about-badge-dot" />
              Final Year Project · AI Mental Wellness
            </div>

            <h1>
              About <span>MindTuneX</span>
            </h1>

            <p>
              MindTuneX is an AI-powered mental wellness platform designed as a
              Final Year Project for the BSc (Hons) Computer Science programme.
              It analyses journal entries and mood check-ins using NLP to help
              users understand emotional patterns and receive personalised
              wellbeing support.
            </p>
          </section>

          <section className="about-info-card">
            <div className="about-card-line" />
            <h2>Project Information</h2>

            <div className="about-info-grid">
              <Info label="Project Title" value="MindTuneX" />
              <Info label="Project Type" value="Final Year Project" />
              <Info label="Programme" value="BSc (Hons) Computer Science" />
              <Info label="Student Name" value="Koralalage Perera" />
              <Info label="Index Number" value="10954927" />
              <Info label="Research Area" value="AI, NLP & Mental Wellness" />
            </div>
          </section>

          <section className="about-grid">
            <Card
              icon="🎯"
              title="Project Purpose"
              text="MindTuneX supports users in understanding emotional wellbeing through AI-assisted mood analysis, emotional trend tracking, and personalised recommendations."
            />

            <Card
              icon="🤖"
              title="AI Model"
              text="The platform uses a fine-tuned DistilBERT-based emotion classification model to detect emotions such as joy, sadness, stress, anxiety, anger, calm, fear, love, fatigue, surprise, disgust, and neutral."
            />

            <Card
              icon="📊"
              title="Emotion Insights"
              text="Prediction results are converted into dashboards, charts, emotional histories, and wellbeing trends so users can understand changes in their mood over time."
            />

            <Card
              icon="🔐"
              title="Privacy"
              text="Because MindTuneX handles sensitive wellbeing text, privacy is a major design priority with authenticated access, protected sessions, secure data handling, and user consent."
            />

            <Card
              icon="⚖️"
              title="Ethics"
              text="MindTuneX is a supportive tool, not a replacement for professional mental health care. It avoids diagnosis and promotes transparency, user control, and emotional safety."
            />

            <Card
              icon="💡"
              title="Academic Value"
              text="This project demonstrates AI, NLP, full-stack development, data visualisation, privacy-aware design, ethical AI, and accountability within a real-world wellbeing context."
            />
          </section>

          <section className="about-disclaimer">
            <div>
              <p className="about-eyebrow">Important Disclaimer</p>
              <h2>AI support, not medical diagnosis</h2>
              <p>
                MindTuneX provides AI-assisted emotional insights for
                self-awareness and wellbeing support only. It does not provide
                medical diagnosis, emergency support, or professional
                psychological treatment. Users experiencing serious distress
                should contact a qualified professional or emergency support
                service.
              </p>
            </div>

            <div className="about-actions">
              <Link to="/privacy-consent" className="about-btn-secondary">
                View Privacy & Consent
              </Link>

              <Link to="/register" className="about-btn-primary">
                Get Started →
              </Link>
            </div>
          </section>
        </main>

        <div className="about-footer-wrap">
          <Footer />
        </div>
      </div>
    </>
  );
}

const Info = ({ label, value }) => (
  <div className="about-info-item">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const Card = ({ icon, title, text }) => (
  <div className="about-card">
    <div className="about-card-line" />
    <div className="about-icon">{icon}</div>
    <h2>{title}</h2>
    <p>{text}</p>
  </div>
);

const ABOUT_STYLES = (darkMode) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');

  .about-root {
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

  .about-grid-bg {
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

  .about-glow {
    position: fixed;
    border-radius: 999px;
    pointer-events: none;
    z-index: 0;
    filter: blur(70px);
    opacity: ${darkMode ? "0.35" : "0.22"};
  }

  .about-glow-1 {
    top: -120px;
    left: -120px;
    width: 460px;
    height: 460px;
    background: #14b8a6;
  }

  .about-glow-2 {
    top: 28%;
    right: -140px;
    width: 420px;
    height: 420px;
    background: #0ea5e9;
  }

  .about-glow-3 {
    bottom: 8%;
    left: 25%;
    width: 360px;
    height: 360px;
    background: #8b5cf6;
  }

  .about-nav {
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

  .about-logo-link {
    text-decoration: none;
  }

  .about-nav-links {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .about-nav-link {
    font-size: 13px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.58)" : "rgba(15,23,42,0.62)"};
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .about-nav-link:hover {
    color: ${darkMode ? "#ffffff" : "#0f172a"};
  }

  .about-nav-cta {
    padding: 9px 18px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 900;
    color: #ffffff;
    text-decoration: none;
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    box-shadow: 0 14px 34px rgba(20,184,166,0.24);
  }

  .about-main {
    position: relative;
    z-index: 1;
    max-width: 1120px;
    margin: 0 auto;
    padding: 140px 24px 90px;
  }

  .about-hero {
    text-align: center;
    max-width: 860px;
    margin: 0 auto 50px;
    animation: fadeUp 0.55s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .about-badge {
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

  .about-badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #14b8a6;
    box-shadow: 0 0 0 6px rgba(20,184,166,0.16);
  }

  .about-hero h1 {
    margin: 0;
    font-size: clamp(42px, 7vw, 78px);
    font-weight: 950;
    line-height: 1.02;
    letter-spacing: -0.06em;
    color: ${darkMode ? "rgba(255,255,255,0.96)" : "#0f172a"};
  }

  .about-hero h1 span,
  .about-disclaimer h2 span {
    background: linear-gradient(135deg, #2dd4bf, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .about-hero p {
    max-width: 760px;
    margin: 24px auto 0;
    font-size: 16px;
    color: ${darkMode ? "rgba(255,255,255,0.50)" : "rgba(15,23,42,0.65)"};
    line-height: 1.8;
    font-weight: 600;
  }

  .about-info-card,
  .about-card,
  .about-disclaimer {
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

  .about-card-line {
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, #14b8a6, #0ea5e9, #818cf8);
  }

  .about-info-card {
    border-radius: 30px;
    padding: 32px;
    margin-bottom: 22px;
  }

  .about-info-card h2,
  .about-card h2,
  .about-disclaimer h2 {
    margin: 0 0 16px;
    font-size: 22px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.92)" : "#0f172a"};
    letter-spacing: -0.025em;
  }

  .about-info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  .about-info-item {
    padding: 18px;
    border-radius: 20px;
    background: ${darkMode ? "rgba(255,255,255,0.045)" : "rgba(15,23,42,0.035)"};
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.06)"
    };
  }

  .about-info-item span {
    display: block;
    font-size: 11px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.48)"};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 7px;
  }

  .about-info-item strong {
    font-size: 14px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.88)" : "#0f172a"};
  }

  .about-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  .about-card {
    border-radius: 26px;
    padding: 28px;
    transition: all 0.22s ease;
  }

  .about-card:hover {
    transform: translateY(-5px);
    border-color: rgba(20,184,166,0.28);
  }

  .about-icon {
    width: 54px;
    height: 54px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(20,184,166,0.10);
    border: 1px solid rgba(20,184,166,0.22);
    font-size: 24px;
    margin-bottom: 18px;
  }

  .about-card p,
  .about-disclaimer p {
    margin: 0;
    font-size: 14px;
    line-height: 1.75;
    color: ${darkMode ? "rgba(255,255,255,0.48)" : "rgba(15,23,42,0.62)"};
    font-weight: 600;
  }

  .about-disclaimer {
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

  .about-eyebrow {
    margin-bottom: 10px !important;
    font-size: 10px !important;
    font-weight: 950 !important;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #14b8a6 !important;
  }

  .about-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 220px;
  }

  .about-btn-primary,
  .about-btn-secondary {
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

  .about-btn-primary {
    color: #ffffff;
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    box-shadow: 0 14px 34px rgba(20,184,166,0.28);
  }

  .about-btn-secondary {
    color: ${darkMode ? "rgba(255,255,255,0.82)" : "#0f172a"};
    border: 1px solid ${
      darkMode ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.10)"
    };
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.75)"};
  }

  .about-btn-primary:hover,
  .about-btn-secondary:hover,
  .about-nav-cta:hover {
    transform: translateY(-2px);
  }

  .about-footer-wrap {
    position: relative;
    z-index: 1;
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 24px 34px;
  }

  @media (max-width: 900px) {
    .about-info-grid,
    .about-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .about-disclaimer {
      grid-template-columns: 1fr;
    }

    .about-actions {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }

  @media (max-width: 640px) {
    .about-nav {
      padding: 14px 18px;
    }

    .about-nav-links {
      gap: 10px;
    }

    .about-nav-link {
      display: none;
    }

    .about-main {
      padding: 120px 18px 70px;
    }

    .about-info-grid,
    .about-grid {
      grid-template-columns: 1fr;
    }

    .about-info-card,
    .about-disclaimer {
      padding: 26px;
    }

    .about-actions {
      flex-direction: column;
    }

    .about-btn-primary,
    .about-btn-secondary {
      width: 100%;
    }

    .about-footer-wrap {
      padding: 0 18px 28px;
    }
  }
`;