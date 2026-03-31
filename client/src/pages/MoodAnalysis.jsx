import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'regenerator-runtime/runtime';

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { predictMoodApi, saveMoodApi } from "../api/moodApi";
import CrisisAlertModal from "../components/common/CrisisAlertModal";

// 🚨 මූඩ් අනුව නිර්දේශිත වීඩියෝ
const MOOD_SUGGESTIONS = {
  joy: {
    title: "Keep the vibe going!",
    videoUrl: "https://www.youtube.com/embed/ZbZSe6N_BXs",
    desc: "Listen to some upbeat music to celebrate your joyful mood."
  },
  sadness: {
    title: "It's okay to feel this way",
    videoUrl: "https://www.youtube.com/embed/lFcSrYw-ARY",
    desc: "Here is some soothing music to help you feel comforted."
  },
  stress: {
    title: "Let's de-stress together",
    videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
    desc: "Take a break with these calming lo-fi beats."
  },
  anxiety: {
    title: "Breathe in, breathe out",
    videoUrl: "https://www.youtube.com/embed/86m4RLZ61PPs",
    desc: "Listen to this guided breathing exercise to calm your mind."
  },
  calm: {
    title: "Stay in your zen zone",
    videoUrl: "https://www.youtube.com/embed/m5U90y_HkL8",
    desc: "Perfect time for some nature sounds to stay relaxed."
  },
  neutral: {
    title: "A little spark for your day",
    videoUrl: "https://www.youtube.com/embed/7NOSDKb0HlU",
    desc: "Some light background music for your daily tasks."
  }
};

const EMOTION_EMOJI = {
  joy: "😄", calm: "😌", stress: "😤", anxiety: "😰",
  sadness: "😢", anger: "😡", fatigue: "😴", love: "🥰",
  fear: "😨", disgust: "🤢", surprise: "😲", neutral: "😐",
};

const EMOTION_COLORS = {
  stress: "bg-red-100 text-red-800 border-red-200",
  anxiety: "bg-orange-100 text-orange-800 border-orange-200",
  calm: "bg-sky-100 text-sky-800 border-sky-200",
  joy: "bg-yellow-100 text-yellow-800 border-yellow-200",
  fatigue: "bg-slate-100 text-slate-700 border-slate-200",
  sadness: "bg-violet-100 text-violet-800 border-violet-200",
  anger: "bg-pink-100 text-pink-800 border-pink-200",
  love: "bg-pink-100 text-pink-700 border-pink-200",
  fear: "bg-purple-100 text-purple-800 border-purple-200",
  neutral: "bg-green-50 text-green-700 border-green-200",
  surprise: "bg-teal-100 text-teal-800 border-teal-200",
  disgust: "bg-lime-100 text-lime-800 border-lime-200",
};

const SENTIMENT_COLORS = {
  positive: "bg-emerald-100 text-emerald-700",
  negative: "bg-rose-100 text-rose-700",
  neutral: "bg-slate-100 text-slate-600",
};

const QUICK_INPUTS = [
  { label: "😤 Stressed", text: "I feel really stressed about my deadlines and assignments" },
  { label: "😌 Calm", text: "I feel peaceful and calm after my morning meditation" },
  { label: "😰 Anxious", text: "I am feeling anxious and nervous about tomorrow" },
  { label: "😴 Exhausted", text: "I am completely exhausted and drained after studying all night" },
  { label: "😄 Happy", text: "I finally completed my react project today!" },
  { label: "😢 Sad", text: "I feel sad and lonely, nothing is going right" },
];

function MoodAnalysis() {
  const { user, logout, isAdmin } = useAuth();
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(""); // 🚨 'error' දැන් UI එකේ පාවිච්චි වෙනවා
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);

  const charLimit = 500;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  const handleToggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setError("");
    setLoading(true);

    try {
      const res = await predictMoodApi({ text });
      setResult(res.data); 

      const predictedEmotion = res.data.predictedEmotion?.toLowerCase();
      const isNegative = res.data.sentimentLabel?.toLowerCase() === "negative";

      if (["fear", "sadness", "stress", "anxiety"].includes(predictedEmotion) && isNegative) {
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
    setShowCrisisAlert(false);
    resetTranscript();
  };

  if (!browserSupportsSpeechRecognition) {
    return <div className="p-10 text-center">Your browser does not support voice input.</div>;
  }

  return (
    // 🎨 Tailwind Suggestion: bg-linear-to-br
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300 relative">
      <Sidebar />

      <div className="flex flex-1 flex-col relative z-0">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-left">
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white">
                Mood <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-500 to-sky-600">Analysis</span>
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Describe how you feel — use your <b>voice</b> or type below.
              </p>
            </div>

            <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-2xl p-8 transition-colors duration-300">
              <div className="mb-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Quick select</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_INPUTS.map(({ label, text: t }) => (
                    <button
                      key={label}
                      onClick={() => { setText(t); setResult(null); setError(""); }}
                      className="rounded-full border border-sky-200 bg-white px-4 py-2 text-xs font-medium text-sky-600 transition hover:bg-sky-50 active:scale-95"
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
                  placeholder={listening ? "Listening... speak now" : "How are you feeling right now?"}
                  className={`w-full resize-none rounded-3xl border ${listening ? "border-teal-400 ring-2 ring-teal-100" : "border-sky-100"} bg-white/80 p-6 text-[0.95rem] focus:outline-none transition-all shadow-inner`}
                />
                
                <button
                  type="button"
                  onClick={handleToggleListening}
                  className={`absolute bottom-6 right-16 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 shadow-lg ${
                    listening ? "bg-rose-500 text-white animate-pulse" : "bg-teal-500 text-white hover:bg-teal-600"
                  }`}
                >
                  {listening ? "🛑" : "🎤"}
                </button>

                <span className={`absolute bottom-6 right-6 font-mono text-xs ${text.length > charLimit * 0.85 ? "text-rose-400" : "text-slate-300"}`}>
                  {text.length}/{charLimit}
                </span>
              </div>

              {/* 🚨 Error එක UI එකේ පෙන්වීම */}
              {error && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm animate-pulse">
                  ⚠️ {error}
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                  className="flex-1 rounded-full bg-linear-to-r from-teal-500 to-sky-600 py-4 text-white font-bold text-lg shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Analysing..." : "Analyse My Mood →"}
                </button>
                {result && (
                  <button
                    onClick={handleSave}
                    className={`rounded-full border-2 px-8 font-bold ${saved ? "border-emerald-400 text-emerald-600" : "border-sky-300 text-sky-600"}`}
                  >
                    {saved ? "✓ Saved" : "Save Entry"}
                  </button>
                )}
                {(text || result) && (
                  <button onClick={handleClear} className="rounded-full border px-6 text-slate-400">Clear</button>
                )}
              </div>
            </div>

            {result && <ResultPanel result={result} />}

          </div>
        </main>
      </div>

      <CrisisAlertModal isOpen={showCrisisAlert} onClose={() => setShowCrisisAlert(false)} />
    </div>
  );
}

const ResultPanel = ({ result }) => {
  const emoKey = result.predictedEmotion?.toLowerCase() || "neutral";
  const emoji = EMOTION_EMOJI[emoKey] || "😐";
  const emoClass = EMOTION_COLORS[emoKey] || "bg-slate-100";
  const sentClass = SENTIMENT_COLORS[result.sentimentLabel] || "bg-slate-100";
  const confPct = Math.round((result.confidence || 0) * 100);

  const suggestion = MOOD_SUGGESTIONS[emoKey] || MOOD_SUGGESTIONS["neutral"];

  return (
    <div className="mt-8 rounded-3xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-6xl shadow-xl border border-slate-50">
          {emoji}
        </div>
        <div>
          <p className="text-4xl font-bold capitalize text-slate-800 dark:text-white">{emoKey}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`rounded-full border px-4 py-1 text-xs font-bold ${emoClass}`}>{confPct}% confidence</span>
            <span className={`rounded-full px-4 py-1 text-xs font-bold ${sentClass}`}>{result.sentimentLabel}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-100 dark:border-slate-700 pt-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xl">🎶</span>
          <h4 className="font-bold text-slate-800 dark:text-white">{suggestion.title}</h4>
        </div>
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">{suggestion.desc}</p>
        
        <div className="overflow-hidden rounded-2xl shadow-xl aspect-video bg-slate-100">
          <iframe
            width="100%"
            height="100%"
            src={suggestion.videoUrl}
            title="YouTube Recommendation"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MoodAnalysis;