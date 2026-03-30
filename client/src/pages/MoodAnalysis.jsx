import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { predictMoodApi, saveMoodApi } from "../api/moodApi";

// 🚨 අලුතින් හදපු Modal එක Import කරගත්තා
import CrisisAlertModal from "../components/common/CrisisAlertModal";

const EMOTION_EMOJI = {
  joy: "😄", calm: "😌", stress: "😤", anxiety: "😰",
  sadness: "😢", anger: "😡", fatigue: "😴", love: "🥰",
  fear: "😨", disgust: "🤢", surprise: "😲", neutral: "😐",
};

const EMOTION_COLORS = {
  stress: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50",
  anxiety: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/50",
  calm: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800/50",
  joy: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50",
  fatigue: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  sadness: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800/50",
  anger: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800/50",
  love: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800/50",
  fear: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50",
  neutral: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50",
  surprise: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800/50",
  disgust: "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/30 dark:text-lime-300 dark:border-lime-800/50",
};

const SENTIMENT_COLORS = {
  positive: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  negative: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const QUICK_INPUTS = [
  { label: "😤 Stressed", text: "I feel really stressed about my deadlines and assignments" },
  { label: "😌 Calm", text: "I feel peaceful and calm after my morning meditation" },
  { label: "😰 Anxious", text: "I am feeling anxious and nervous about tomorrow" },
  { label: "😴 Exhausted", text: "I am completely exhausted and drained after studying all night" },
  { label: "😄 Happy", text: "I finally completed my react project today! it was challenging, but seeing the final result makes me so happy." },
  { label: "😢 Sad", text: "I feel sad and lonely, nothing is going right" },
];

function MoodAnalysis() {
  const { user, logout, isAdmin } = useAuth();
  
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // 🚨 Modal එක පෙන්වනවද නැද්ද කියලා තීරණය කරන State එක
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);

  const charLimit = 500;

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setError("");
    setLoading(true);

    try {
      const res = await predictMoodApi({ text });
      setResult(res.data); 

      // 🚨 AI ප්‍රතිඵලය අනුව Modal එක Trigger කිරීම
      const predictedEmotion = res.data.predictedEmotion?.toLowerCase();
      const isNegative = res.data.sentimentLabel?.toLowerCase() === "negative";

      if (["fear", "sadness", "stress", "anxiety"].includes(predictedEmotion) && isNegative) {
        // තත්පර බාගයක් පරක්කු කරලා Modal එක පෙන්වනවා ලස්සනට
        setTimeout(() => {
          setShowCrisisAlert(true);
        }, 500);
      }

    } catch (err) {
      setError(err?.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    try {
      await saveMoodApi({
        text: text,
        predictedEmotion: result.predictedEmotion,
        sentimentLabel: result.sentimentLabel,
        confidence: result.confidence,
        source: "analysis"
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to save. Please try again.");
    }
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setError("");
    setShowCrisisAlert(false); // Clear කරද්දී Modal එකත් වහනවා
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300 relative">
      <Sidebar />

      <div className="flex flex-1 flex-col relative z-0">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white transition-colors">
                Mood <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-600 dark:from-teal-400 dark:to-sky-400">Analysis</span>
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400 transition-colors">
                Describe how you feel — our AI will detect your emotion instantly.
              </p>
            </div>

            {/* Info Cards */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "✍️", title: "Write freely", desc: "Your own words" },
                { icon: "🧠", title: "DistilBERT", desc: "12-class emotion model" },
                { icon: "💡", title: "Instant insights", desc: "Confidence + keywords" },
              ].map((item, i) => (
                <div key={i} className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 p-4 text-center shadow-xl shadow-sky-100/40 dark:shadow-none transition-all hover:-translate-y-1">
                  <div className="mx-auto mb-3 text-3xl">{item.icon}</div>
                  <p className="font-medium text-slate-700 dark:text-slate-200 leading-tight">{item.title}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Main Input Card */}
            <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-2xl shadow-sky-100/50 dark:shadow-none p-8 transition-colors duration-300">
              <div className="mb-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Quick select</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_INPUTS.map(({ label, text: t }) => (
                    <button
                      key={label}
                      onClick={() => { setText(t); setResult(null); setError(""); }}
                      className="rounded-full border border-sky-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-medium text-sky-600 dark:text-sky-400 transition hover:border-teal-300 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-slate-700 active:scale-95"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => {
                    if (e.target.value.length <= charLimit) setText(e.target.value);
                    if (result) setResult(null);
                  }}
                  rows={6}
                  placeholder="How are you feeling right now?"
                  className="w-full resize-none rounded-3xl border border-sky-100 dark:border-slate-600 bg-white/80 dark:bg-slate-900/50 p-6 text-[0.95rem] leading-relaxed text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-teal-400 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all shadow-inner dark:shadow-black/20"
                />
                <span className={`absolute bottom-6 right-6 font-mono text-xs ${text.length > charLimit * 0.85 ? "text-rose-400 dark:text-rose-500" : "text-slate-300 dark:text-slate-600"}`}>
                  {text.length}/{charLimit}
                </span>
              </div>

              {error && (
                <div className="mt-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 p-4 text-sm text-rose-600 dark:text-rose-400 animate-pulse">
                  {error}
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                  className="flex-1 rounded-full bg-gradient-to-r from-teal-500 to-sky-600 py-4 text-white font-bold text-lg shadow-lg shadow-teal-200 dark:shadow-none transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Analysing with AI...
                    </span>
                  ) : (
                    "Analyse My Mood →"
                  )}
                </button>

                {result && (
                  <button
                    onClick={handleSave}
                    className={`rounded-full border-2 px-8 font-bold transition-all active:scale-95 ${saved ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "border-sky-300 dark:border-sky-600 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800"}`}
                  >
                    {saved ? "✓ Saved" : "Save Entry"}
                  </button>
                )}

                {(text || result) && (
                  <button
                    onClick={handleClear}
                    className="rounded-full border border-slate-200 dark:border-slate-600 px-6 text-slate-400 hover:border-slate-300 dark:hover:border-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition active:scale-95"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Result Panel */}
            {result && <ResultPanel result={result} />}

            <p className="mt-10 mb-6 text-center text-[10px] text-slate-400 dark:text-slate-600 italic uppercase tracking-[0.2em]">
              Powered by DistilBERT • Real-time emotion detection
            </p>
          </div>
        </main>
      </div>

      {/* 🚨 Modal Component එක Render වෙන තැන (z-index වැඩි නිසා හැමදේටම උඩින් පේනවා) */}
      <CrisisAlertModal 
        isOpen={showCrisisAlert} 
        onClose={() => setShowCrisisAlert(false)} 
      />
    </div>
  );
}

const ResultPanel = ({ result }) => {
  const emoKey = result.predictedEmotion || "neutral";
  const emoji = EMOTION_EMOJI[emoKey] || "😐";
  const emoClass = EMOTION_COLORS[emoKey] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  const sentClass = SENTIMENT_COLORS[result.sentimentLabel] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  
  const confPct = Math.round((result.confidence || 0) * 100);

  return (
    <div className="mt-8 rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-2xl shadow-sky-100/50 dark:shadow-none p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
      <div className="flex items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white dark:bg-slate-700 text-6xl shadow-xl shadow-slate-100 dark:shadow-none border border-slate-50 dark:border-slate-600 transition-colors">
          {emoji}
        </div>
        <div>
          <p className="text-4xl font-bold capitalize text-slate-800 dark:text-white tracking-tight">{emoKey}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`rounded-full border px-4 py-1 text-xs font-bold uppercase tracking-wider ${emoClass}`}>
              {confPct}% confidence
            </span>
            <span className={`rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider ${sentClass}`}>
              {result.sentimentLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400 dark:text-slate-500">
          <span>Reliability score</span>
          <span>{confPct}%</span>
        </div>
        <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-50 dark:border-slate-600 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-sky-500 transition-all duration-1000 ease-out"
            style={{ width: `${confPct}%` }}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-2xl bg-white/40 dark:bg-slate-700/40 border border-white/60 dark:border-slate-600 p-5 transition hover:bg-white/60 dark:hover:bg-slate-700/60">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Sentiment</p>
          <p className="font-semibold text-slate-700 dark:text-slate-200 capitalize">{result.sentimentLabel}</p>
        </div>
        <div className="rounded-2xl bg-white/40 dark:bg-slate-700/40 border border-white/60 dark:border-slate-600 p-5 transition hover:bg-white/60 dark:hover:bg-slate-700/60">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Recommendation</p>
          <p className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
            {result.recommendationType?.replace(/_/g, " ") || "General"}
          </p>
        </div>
      </div>

      {result.explanationKeywords?.length > 0 && (
        <div className="mt-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Trigger keywords</p>
          <div className="flex flex-wrap gap-2">
            {result.explanationKeywords.map((kw) => (
              <span key={kw} className="rounded-full bg-white dark:bg-slate-700 border border-sky-100 dark:border-slate-600 px-4 py-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 shadow-sm transition-colors">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodAnalysis;