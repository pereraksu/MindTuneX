import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import JournalForm from "../components/journal/JournalForm";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/useTheme";

const INFO_CARDS = [
  {
    title: "Why journaling matters",
    text: "Regular writing improves self-awareness, reduces emotional overload, and helps reveal hidden mood triggers over time.",
    accentFrom: "#0ea5e9",
    accentTo: "#14b8a6",
    icon: "📘",
  },
  {
    title: "Best practice",
    text: "Write honestly instead of perfectly. Even a short reflection can help the AI generate meaningful emotional insights.",
    accentFrom: "#10b981",
    accentTo: "#14b8a6",
    icon: "✨",
  },
  {
    title: "Pro tip",
    text: "Five minutes of daily reflection can support emotional regulation and build a healthier self-awareness habit.",
    accentFrom: "#8b5cf6",
    accentTo: "#6366f1",
    icon: "🧠",
  },
];

const JournalPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode } = useTheme();

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="jp-root">
        <div className="jp-glow jp-glow-1" />
        <div className="jp-glow jp-glow-2" />
        <div className="jp-grid-bg" />

        <Sidebar />

        <div className="jp-body">
          <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

          <main className="jp-main">
            <div className="jp-container">
              <section className="jp-hero">
                <div className="jp-hero-line" />

                <div className="jp-hero-content">
                  <p className="jp-eyebrow">Personal Reflection Space</p>

                  <h1 className="jp-title">
                    Daily <span>Journal</span>
                  </h1>

                  <p className="jp-subtitle">
                    Express your thoughts and feelings in a private space.
                    MindTuneX analyses your journal entry to detect emotional
                    signals, mood patterns, and personalised support needs.
                  </p>

                  <div className="jp-pills">
                    <span>🔐 Private reflection</span>
                    <span>🤖 AI mood analysis</span>
                    <span>📊 Insight generation</span>
                  </div>
                </div>
              </section>

              <section className="jp-layout">
                <div className="jp-form-card">
                  <JournalForm />
                </div>

                <aside className="jp-side">
                  {INFO_CARDS.map((card) => (
                    <InfoCard key={card.title} {...card} />
                  ))}
                </aside>
              </section>

              <section className="jp-reminder">
                <div className="jp-reminder-icon">📅</div>

                <div>
                  <p className="jp-reminder-label">Daily Reflection Reminder</p>
                  <p className="jp-reminder-text">
                    Consistent journaling helps the system understand emotional
                    changes, recurring triggers, and recovery patterns more accurately.
                  </p>
                </div>
              </section>
            </div>

            <div className="jp-footer-wrap">
              <Footer />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const InfoCard = ({ title, text, accentFrom, accentTo, icon }) => (
  <div className="jp-info-card">
    <div
      className="jp-info-line"
      style={{ background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})` }}
    />

    <div
      className="jp-info-icon"
      style={{
        background: `${accentFrom}18`,
        borderColor: `${accentFrom}33`,
        color: accentFrom,
      }}
    >
      {icon}
    </div>

    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

const STYLES = (darkMode) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

  .jp-root {
    display: flex;
    min-height: 100svh;
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
    overflow-x: hidden;
    background: ${
      darkMode
        ? "radial-gradient(circle at top left, rgba(20,184,166,0.12), transparent 34%), #050810"
        : "linear-gradient(135deg, #ecfeff 0%, #f8fafc 48%, #f5f3ff 100%)"
    };
    color: ${darkMode ? "#f8fafc" : "#0f172a"};
  }

  .jp-glow {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(70px);
  }

  .jp-glow-1 {
    top: -120px;
    left: -100px;
    width: 520px;
    height: 520px;
    background: ${darkMode ? "rgba(20,184,166,0.14)" : "rgba(20,184,166,0.18)"};
  }

  .jp-glow-2 {
    bottom: -100px;
    right: -100px;
    width: 460px;
    height: 460px;
    background: ${darkMode ? "rgba(14,165,233,0.12)" : "rgba(139,92,246,0.14)"};
  }

  .jp-grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(${darkMode ? "rgba(255,255,255,0.018)" : "rgba(15,23,42,0.035)"} 1px, transparent 1px),
      linear-gradient(90deg, ${darkMode ? "rgba(255,255,255,0.018)" : "rgba(15,23,42,0.035)"} 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: radial-gradient(circle at center, black, transparent 75%);
  }

  .jp-body {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    z-index: 1;
    min-width: 0;
  }

  .jp-main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
  }

  @media (min-width: 1024px) {
    .jp-main {
      padding: 38px 42px;
    }
  }

  .jp-container {
    max-width: 1180px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .jp-footer-wrap {
    width: 100%;
    max-width: 1180px;
    margin: 46px auto 0;
  }

  .jp-hero,
  .jp-form-card,
  .jp-info-card {
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.78)"};
    backdrop-filter: blur(24px);
    box-shadow: ${darkMode ? "0 26px 70px rgba(0,0,0,0.28)" : "0 26px 70px rgba(15,23,42,0.09)"};
  }

  .jp-hero {
    position: relative;
    overflow: hidden;
    border-radius: 28px;
    padding: 34px;
    animation: jpFadeUp 0.55s ease both;
  }

  @keyframes jpFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .jp-hero-line {
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, #14b8a6, #0ea5e9, #8b5cf6);
  }

  .jp-hero-content {
    position: relative;
    z-index: 1;
  }

  .jp-eyebrow {
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #14b8a6;
    margin-bottom: 10px;
  }

  .jp-title {
    font-size: clamp(34px, 5vw, 52px);
    font-weight: 950;
    line-height: 1.04;
    letter-spacing: -0.055em;
    color: ${darkMode ? "rgba(255,255,255,0.96)" : "#0f172a"};
    margin-bottom: 14px;
  }

  .jp-title span {
    background: linear-gradient(135deg, #14b8a6, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .jp-subtitle {
    max-width: 700px;
    font-size: 14px;
    line-height: 1.75;
    color: ${darkMode ? "rgba(255,255,255,0.44)" : "rgba(15,23,42,0.58)"};
    font-weight: 550;
    margin-bottom: 20px;
  }

  .jp-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }

  .jp-pills span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 999px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.045)"};
    color: ${darkMode ? "rgba(255,255,255,0.62)" : "rgba(15,23,42,0.62)"};
    font-size: 11.5px;
    font-weight: 800;
  }

  .jp-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
  }

  @media (min-width: 1280px) {
    .jp-layout {
      grid-template-columns: 2fr 0.9fr;
    }
  }

  .jp-form-card {
    border-radius: 28px;
    padding: 8px;
    overflow: hidden;
    animation: jpFadeUp 0.65s ease both;
  }

  .jp-side {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  @media (max-width: 1279px) {
    .jp-side {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 768px) {
    .jp-side {
      grid-template-columns: 1fr;
    }
  }

  .jp-info-card {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    padding: 20px;
    transition: transform 0.2s ease, border-color 0.2s ease;
  }

  .jp-info-card:hover {
    transform: translateY(-4px);
    border-color: rgba(20,184,166,0.24);
  }

  .jp-info-line {
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
  }

  .jp-info-icon {
    width: 46px;
    height: 46px;
    border-radius: 16px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 14px;
  }

  .jp-info-card h3 {
    font-size: 14px;
    font-weight: 950;
    color: ${darkMode ? "rgba(255,255,255,0.9)" : "#0f172a"};
    margin-bottom: 8px;
  }

  .jp-info-card p {
    font-size: 12.8px;
    line-height: 1.7;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.56)"};
    font-weight: 550;
  }

  .jp-reminder {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    border-radius: 24px;
    border: 1px solid rgba(14,165,233,0.22);
    background: ${darkMode ? "rgba(14,165,233,0.075)" : "rgba(14,165,233,0.09)"};
    backdrop-filter: blur(20px);
    padding: 20px 22px;
    box-shadow: ${darkMode ? "0 18px 48px rgba(14,165,233,0.06)" : "0 18px 48px rgba(14,165,233,0.10)"};
  }

  .jp-reminder-icon {
    width: 42px;
    height: 42px;
    border-radius: 15px;
    flex-shrink: 0;
    background: rgba(14,165,233,0.14);
    border: 1px solid rgba(14,165,233,0.28);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #38bdf8;
    font-size: 20px;
  }

  .jp-reminder-label {
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #0ea5e9;
    margin-bottom: 6px;
  }

  .jp-reminder-text {
    font-size: 13px;
    line-height: 1.7;
    color: ${darkMode ? "rgba(255,255,255,0.44)" : "rgba(15,23,42,0.58)"};
    font-weight: 550;
  }

  @media (max-width: 640px) {
    .jp-main {
      padding: 24px 16px;
    }

    .jp-hero {
      padding: 28px 22px;
      border-radius: 24px;
    }

    .jp-title {
      font-size: 36px;
    }

    .jp-reminder {
      flex-direction: column;
    }

    .jp-footer-wrap {
      margin-top: 36px;
    }
  }
`;

export default JournalPage;