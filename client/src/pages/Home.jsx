import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import MindTuneXLogo from "../components/common/MindTuneXLogo";
import Footer from "../components/common/Footer";
import { useTheme } from "../context/useTheme";

const Counter = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let frame;
    const duration = 1600;
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * end));

      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [started, end]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const ChatBubble = ({ user, text }) => (
  <div className={`chat-row ${user === "user" ? "chat-row-user" : ""}`}>
    {user === "bot" && <div className="chat-avatar">AI</div>}

    <div className={`chat-bubble ${user === "user" ? "chat-user" : "chat-bot"}`}>
      {text}
    </div>
  </div>
);

const FEATURE_ACCENTS = ["#14b8a6", "#0ea5e9", "#f43f5e", "#8b5cf6"];

const FEATURES = [
  {
    icon: "😊",
    title: "Emotion Analysis",
    desc: "AI-based text analysis identifies emotional states from journals and check-ins.",
  },
  {
    icon: "📈",
    title: "Mood Tracking",
    desc: "Visual dashboards reveal emotional patterns and wellbeing trends over time.",
  },
  {
    icon: "🚨",
    title: "Risk Detection",
    desc: "High-risk emotional signals are flagged early for timely support awareness.",
  },
  {
    icon: "✨",
    title: "AI Insights",
    desc: "Personalised recommendations guide users toward healthier coping actions.",
  },
];

const FeatureCard = ({ icon, title, desc, accentColor }) => (
  <div className="feature-card">
    <div
      className="feature-line"
      style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
    />

    <div
      className="feature-icon"
      style={{
        background: `${accentColor}18`,
        borderColor: `${accentColor}33`,
        color: accentColor,
      }}
    >
      {icon}
    </div>

    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

const StatCard = ({ value, suffix, label }) => (
  <div className="stat-card-home">
    <div className="stat-value">
      <Counter end={value} suffix={suffix} />
    </div>
    <div className="stat-label">{label}</div>
  </div>
);

export default function Home() {
  const { darkMode } = useTheme();

  return (
    <>
      <style>{HOME_STYLES(darkMode)}</style>

      <div className="home-root">
        <div className="home-glow home-glow-1" />
        <div className="home-glow home-glow-2" />
        <div className="home-glow home-glow-3" />
        <div className="home-grid-bg" />

        <nav className="home-nav">
          <MindTuneXLogo />

          <div className="home-nav-links">
  <Link to="/" className="home-nav-link">
    Home
  </Link>

  <Link to="/about-mindtunex" className="home-nav-link">
    About
  </Link>

  <Link to="/privacy-consent" className="home-nav-link">
    Privacy
  </Link>

  <Link to="/login" className="home-nav-link">
    Sign In
  </Link>

  <Link to="/register" className="home-nav-cta">
    Get Started
  </Link>
</div>

        </nav>

        <section className="home-hero">
          <div className="home-hero-inner">
            <div className="home-badge">
              <span className="home-badge-dot" />
              AI-Powered Mental Wellness Platform
            </div>

            <h1 className="home-headline">
              Understand Your <span className="home-headline-accent">Emotions</span>{" "}
              with AI
            </h1>

            <p className="home-hero-sub">
              MindTuneX helps users track moods, analyse emotional patterns, identify
              distress signals, and receive personalised wellness support through AI.
            </p>

            <div className="home-cta-group">
              <Link to="/register" className="home-btn-primary">
                Start Your Journey →
              </Link>

              <Link to="/login" className="home-btn-ghost">
                Sign In
              </Link>
            </div>

            <div className="home-scroll-hint">
              <div className="home-scroll-line" />
              <span>Scroll</span>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="home-container">
            <div className="home-stats-card">
              <div className="home-stats-grid">
                <StatCard value={12} suffix="+" label="Emotion Classes" />
                <StatCard value={80} suffix="%" label="Macro F1 Score" />
                <StatCard value={3} suffix="+" label="Core Datasets" />
                <StatCard value={24} suffix="/7" label="Support Access" />
              </div>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="home-container-wide">
            <div className="home-section-header">
              <p className="home-eyebrow">What We Offer</p>
              <h2 className="home-section-title">
                Everything needed for{" "}
                <span className="home-gradient-text">emotion-aware wellness</span>
              </h2>
            </div>

            <div className="home-features-grid">
              {FEATURES.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                  accentColor={FEATURE_ACCENTS[index]}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="home-container">
            <div className="home-chat-grid">
              <div>
                <p className="home-eyebrow">AI Chatbot</p>
                <h2 className="home-section-title home-section-title-left">
                  Talk to an assistant that{" "}
                  <span className="home-gradient-text">responds with care</span>
                </h2>

                <p className="home-chat-desc">
                  The MindTuneX chatbot provides supportive responses, detects
                  emotional tone, and suggests small practical actions when users feel
                  overwhelmed.
                </p>

                <Link to="/register" className="home-chat-link">
                  Try the chat experience →
                </Link>
              </div>

              <div className="home-chat-box">
                <div className="home-chat-header">
                  <div className="home-chat-avatar">AI</div>

                  <div>
                    <div className="home-chat-name">MindTuneX Assistant</div>
                    <div className="home-chat-status">
                      <span className="home-chat-status-dot" />
                      Emotion-Aware Support
                    </div>
                  </div>
                </div>

                <ChatBubble user="user" text="I feel really stressed today..." />
                <ChatBubble
                  user="bot"
                  text="I hear you 💙 Let’s slow things down. Would a breathing exercise help?"
                />
                <ChatBubble user="user" text="Yes, that would help" />
                <ChatBubble
                  user="bot"
                  text="Start with a slow inhale, hold briefly, then exhale gently. You are safe right now."
                />

                <div className="typing-wrap">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="home-container-sm">
            <div className="home-section-header">
              <p className="home-eyebrow">How It Works</p>
              <h2 className="home-section-title">Three simple steps</h2>
            </div>

            <div className="home-steps-grid">
              {[
                {
                  step: "01",
                  title: "Write or Check In",
                  desc: "Users enter a journal reflection or quick mood update.",
                },
                {
                  step: "02",
                  title: "AI Analyses Emotion",
                  desc: "The NLP model predicts emotions, sentiment, and risk indicators.",
                },
                {
                  step: "03",
                  title: "Receive Support",
                  desc: "The system provides insights, recommendations, and support options.",
                },
              ].map((item, index) => (
                <div key={item.step} className="home-step">
                  <div className="home-step-num">{item.step}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  {index < 2 && <div className="home-step-arrow">→</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-cta-section">
          <div className="home-cta-glow" />

          <div className="home-cta-inner">
            <p className="home-eyebrow">Begin Today</p>

            <h2 className="home-cta-title">
              Your wellness journey{" "}
              <span className="home-gradient-text">starts here</span>
            </h2>

            <p className="home-cta-sub">
              Create an account and begin tracking your emotional wellbeing with
              AI-powered insights and personalised support.
            </p>

            <Link to="/register" className="home-btn-primary home-btn-primary-lg">
              Create Free Account →
            </Link>
          </div>
        </section>

        <div className="home-footer-wrap">
          <Footer />
        </div>
      </div>
    </>
  );
}

const HOME_STYLES = (darkMode) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');

  .home-root {
    position: relative;
    min-height: 100svh;
    overflow-x: hidden;
    background: ${
      darkMode
        ? "#050810"
        : "linear-gradient(135deg, #ecfeff 0%, #f8fafc 48%, #eef9ff 100%)"
    };
    color: ${darkMode ? "#fff" : "#0f172a"};
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .home-glow {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(4px);
  }

  .home-glow-1 {
    top: -140px;
    left: -100px;
    width: 560px;
    height: 560px;
    background: radial-gradient(circle, rgba(20,184,166,0.12), transparent 65%);
  }

  .home-glow-2 {
    top: 30%;
    right: -120px;
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(14,165,233,0.1), transparent 65%);
  }

  .home-glow-3 {
    bottom: 12%;
    left: 18%;
    width: 420px;
    height: 420px;
    background: radial-gradient(circle, rgba(139,92,246,0.07), transparent 65%);
  }

  .home-grid-bg {
    pointer-events: none;
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: radial-gradient(circle at center, black, transparent 75%);
  }

  .home-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(5,8,16,0.82);
    backdrop-filter: blur(22px);
  }

  .home-nav-links {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .home-nav-link {
    font-size: 13px;
    font-weight: 700;
    color: rgba(255,255,255,0.48);
    text-decoration: none;
  }

  .home-nav-link:hover {
    color: rgba(255,255,255,0.88);
  }

  .home-nav-cta {
    padding: 9px 18px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 800;
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    color: #fff;
    text-decoration: none;
    box-shadow: 0 10px 24px rgba(20,184,166,0.25);
  }

  .home-hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 110px 24px 60px;
    text-align: center;
    z-index: 1;
  }

  .home-hero-inner {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeUp 0.75s ease both;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .home-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 17px;
    border-radius: 999px;
    margin-bottom: 28px;
    border: 1px solid rgba(20,184,166,0.25);
    background: rgba(20,184,166,0.08);
    font-size: 11.5px;
    font-weight: 800;
    color: rgba(45,212,191,0.9);
    letter-spacing: 0.04em;
  }

  .home-badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #14b8a6;
    box-shadow: 0 0 12px rgba(20,184,166,0.8);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.45; transform: scale(0.85); }
  }

  .home-headline {
    max-width: 920px;
    font-size: clamp(42px, 7vw, 78px);
    font-weight: 950;
    line-height: 1.02;
    letter-spacing: -0.06em;
    color: rgba(255,255,255,0.96);
    margin-bottom: 24px;
  }

  .home-headline-accent,
  .home-gradient-text {
    background: linear-gradient(135deg, #2dd4bf, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .home-hero-sub {
    max-width: 560px;
    font-size: 16px;
    color: rgba(255,255,255,0.44);
    line-height: 1.75;
    margin-bottom: 36px;
    font-weight: 500;
  }

  .home-cta-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }

  .home-btn-primary,
  .home-btn-ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 28px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 900;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .home-btn-primary {
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    color: #fff;
    box-shadow: 0 14px 34px rgba(20,184,166,0.3);
  }

  .home-btn-primary:hover,
  .home-btn-ghost:hover,
  .feature-card:hover,
  .home-step:hover {
    transform: translateY(-4px);
  }

  .home-btn-primary-lg {
    padding: 16px 36px;
    font-size: 15px;
  }

  .home-btn-ghost {
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.055);
    color: rgba(255,255,255,0.68);
  }

  .home-scroll-hint {
    margin-top: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: rgba(255,255,255,0.24);
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .home-scroll-line {
    width: 1px;
    height: 42px;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3));
  }

  .home-section {
    position: relative;
    z-index: 1;
    padding: 82px 24px;
  }

  .home-container {
    max-width: 960px;
    margin: 0 auto;
  }

  .home-container-wide {
    max-width: 1160px;
    margin: 0 auto;
  }

  .home-container-sm {
    max-width: 840px;
    margin: 0 auto;
  }

  .home-section-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .home-eyebrow {
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #14b8a6;
    margin-bottom: 12px;
  }

  .home-section-title {
    font-size: clamp(30px, 4vw, 46px);
    font-weight: 950;
    color: rgba(255,255,255,0.92);
    letter-spacing: -0.045em;
    line-height: 1.1;
  }

  .home-section-title-left {
    text-align: left;
    margin-bottom: 14px;
  }

  .home-stats-card,
  .feature-card,
  .home-chat-box,
  .home-step {
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.035);
    backdrop-filter: blur(22px);
    box-shadow: 0 26px 70px rgba(0,0,0,0.24);
  }

  .home-stats-card {
    border-radius: 26px;
    padding: 42px 32px;
  }

  .home-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 36px 24px;
  }

  @media (min-width: 640px) {
    .home-stats-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .stat-card-home {
    text-align: center;
  }

  .stat-value {
    font-size: clamp(38px, 5vw, 54px);
    font-weight: 950;
    letter-spacing: -0.055em;
    background: linear-gradient(135deg, #2dd4bf, #38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .stat-label {
    margin-top: 9px;
    font-size: 10px;
    color: rgba(255,255,255,0.32);
    font-weight: 950;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .home-features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (min-width: 1024px) {
    .home-features-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .feature-card {
    position: relative;
    border-radius: 22px;
    overflow: hidden;
    padding: 24px;
    transition: transform 0.2s ease, border-color 0.2s ease;
  }

  .feature-card:hover {
    border-color: rgba(20,184,166,0.25);
  }

  .feature-line {
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
  }

  .feature-icon {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    margin-bottom: 15px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  }

  .feature-card h3 {
    font-size: 15px;
    font-weight: 900;
    color: rgba(255,255,255,0.9);
    margin-bottom: 8px;
  }

  .feature-card p {
    font-size: 13px;
    color: rgba(255,255,255,0.42);
    line-height: 1.7;
    font-weight: 550;
  }

  .home-chat-grid {
    display: grid;
    gap: 48px;
    align-items: center;
  }

  @media (min-width: 768px) {
    .home-chat-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .home-chat-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.42);
    line-height: 1.75;
    margin-bottom: 22px;
    font-weight: 550;
  }

  .home-chat-link {
    font-size: 13.5px;
    font-weight: 900;
    color: #14b8a6;
    text-decoration: none;
  }

  .home-chat-box {
    border-radius: 26px;
    padding: 24px;
  }

  .home-chat-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 16px;
    margin-bottom: 18px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .home-chat-avatar,
  .chat-avatar {
    border-radius: 50%;
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 950;
    box-shadow: 0 8px 20px rgba(20,184,166,0.28);
    flex-shrink: 0;
  }

  .home-chat-avatar {
    width: 36px;
    height: 36px;
    font-size: 10px;
  }

  .home-chat-name {
    font-size: 13px;
    font-weight: 900;
    color: rgba(255,255,255,0.86);
    margin-bottom: 3px;
  }

  .home-chat-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #14b8a6;
    font-weight: 750;
  }

  .home-chat-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #14b8a6;
    animation: pulse 2s ease-in-out infinite;
  }

  .chat-row {
    display: flex;
    margin-bottom: 12px;
    justify-content: flex-start;
    animation: fadeUp 0.45s ease both;
  }

  .chat-row-user {
    justify-content: flex-end;
  }

  .chat-avatar {
    width: 30px;
    height: 30px;
    font-size: 9px;
    margin-right: 10px;
    margin-top: 2px;
  }

  .chat-bubble {
    padding: 11px 16px;
    border-radius: 16px;
    max-width: 250px;
    font-size: 13px;
    line-height: 1.65;
    font-weight: 600;
  }

  .chat-user {
    border-radius: 16px 4px 16px 16px;
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    color: #fff;
  }

  .chat-bot {
    border-radius: 4px 16px 16px 16px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.76);
  }

  .typing-wrap {
    display: inline-flex;
    gap: 5px;
    padding: 11px 14px;
    border-radius: 14px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.09);
  }

  .typing-wrap span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.45);
    animation: typing 0.9s ease-in-out infinite;
  }

  .typing-wrap span:nth-child(2) {
    animation-delay: 0.14s;
  }

  .typing-wrap span:nth-child(3) {
    animation-delay: 0.28s;
  }

  @keyframes typing {
    0%, 100% { transform: translateY(0); opacity: 0.45; }
    50% { transform: translateY(-5px); opacity: 1; }
  }

  .home-steps-grid {
    display: grid;
    gap: 18px;
  }

  @media (min-width: 768px) {
    .home-steps-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .home-step {
    position: relative;
    border-radius: 24px;
    padding: 26px;
    transition: transform 0.2s ease, border-color 0.2s ease;
  }

  .home-step:hover {
    border-color: rgba(20,184,166,0.25);
  }

  .home-step-num {
    font-size: 54px;
    font-weight: 950;
    letter-spacing: -0.06em;
    color: rgba(255,255,255,0.08);
    line-height: 1;
    margin-bottom: 14px;
  }

  .home-step h3 {
    font-size: 15px;
    font-weight: 950;
    color: rgba(255,255,255,0.88);
    margin-bottom: 8px;
  }

  .home-step p {
    font-size: 13px;
    color: rgba(255,255,255,0.42);
    line-height: 1.7;
    font-weight: 550;
  }

  .home-step-arrow {
    display: none;
    position: absolute;
    top: 34px;
    right: -13px;
    color: rgba(255,255,255,0.16);
    font-size: 24px;
  }

  @media (min-width: 768px) {
    .home-step-arrow {
      display: block;
    }
  }

  .home-cta-section {
    position: relative;
    z-index: 1;
    padding: 105px 24px;
    text-align: center;
    overflow: hidden;
  }

  .home-cta-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 620px;
    height: 320px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(20,184,166,0.13), transparent);
    pointer-events: none;
  }

  .home-cta-inner {
    position: relative;
    max-width: 720px;
    margin: 0 auto;
  }

  .home-cta-title {
    font-size: clamp(34px, 5vw, 56px);
    font-weight: 950;
    letter-spacing: -0.055em;
    line-height: 1.05;
    color: rgba(255,255,255,0.96);
    margin: 12px 0 18px;
  }

  .home-cta-sub {
    font-size: 15px;
    color: rgba(255,255,255,0.42);
    line-height: 1.75;
    max-width: 500px;
    margin: 0 auto 36px;
    font-weight: 550;
  }

  .home-footer-wrap {
    position: relative;
    z-index: 1;
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 24px 34px;
  }

  @media (max-width: 640px) {
    .home-nav {
      padding: 14px 18px;
    }

    .home-nav-link {
      display: none;
    }

    .home-features-grid {
      grid-template-columns: 1fr;
    }

    .home-headline {
      font-size: clamp(38px, 12vw, 54px);
    }

    .home-section {
      padding: 64px 18px;
    }

    .home-footer-wrap {
      padding: 0 18px 28px;
    }
  }
`;