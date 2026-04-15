import { Link } from "react-router-dom";
import MindTuneXLogo from "../components/common/MindTuneXLogo";

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* 🌈 Background Effects */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">

        {/* Logo */}
        <div className="mb-6">
          <MindTuneXLogo />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Your AI-Powered{" "}
          <span className="bg-gradient-to-r from-teal-400 to-sky-500 bg-clip-text text-transparent">
            Emotional Wellness
          </span>{" "}
          Platform
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Track your mood, understand your emotions, and receive intelligent
          recommendations to improve your mental wellbeing.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/login"
            className="rounded-2xl bg-gradient-to-r from-teal-500 to-sky-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 hover:from-teal-400 hover:to-sky-500"
          >
            Get Started
          </Link>

          <Link
            to="/register"
            className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
          >
            Create Account
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-6 md:grid-cols-3 max-w-5xl w-full">
          {[
            {
              title: "Emotion Tracking",
              desc: "Log and analyze your daily emotional patterns using AI.",
              icon: "🧠",
            },
            {
              title: "Smart Insights",
              desc: "Understand trends and triggers behind your moods.",
              icon: "📊",
            },
            {
              title: "AI Recommendations",
              desc: "Get personalized suggestions to improve your wellbeing.",
              icon: "✨",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-16 text-xs text-slate-500">
          © {new Date().getFullYear()} MindTuneX — Emotion-Aware AI System
        </p>
      </div>
    </div>
  );
}

export default Home;