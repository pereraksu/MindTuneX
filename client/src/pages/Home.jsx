import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import MindTuneXLogo from "../components/common/MindTuneXLogo";
import Footer from "../components/common/Footer";
import "./Home.css";

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
  return (
    <>
      <div className="home-root">
        <div className="home-glow home-glow-1" />
        <div className="home-glow home-glow-2" />
        <div className="home-glow home-glow-3" />
        <div className="home-grid-bg" />

        <nav className="home-nav">
         <MindTuneXLogo
           size="sm"
           showTagline={true}
           className="home-logo-small"
        />

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

