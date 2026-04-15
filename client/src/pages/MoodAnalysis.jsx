import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "regenerator-runtime/runtime";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { predictMoodApi, saveMoodApi } from "../api/moodApi";
import CrisisAlertModal from "../components/common/CrisisAlertModal";

// Mood-based suggested videos
const MOOD_SUGGESTIONS = {
  joy: {
    title: "Keep the vibe going!",
    videoUrl: "https://www.youtube.com/embed/ZbZSe6N_BXs",
    desc: "Listen to some upbeat music to celebrate your joyful mood.",
  },
  sadness: {
    title: "It's okay to feel this way",
    videoUrl: "https://www.youtube.com/embed/lFcSrYw-ARY",
    desc: "Here is some soothing music to help you feel comforted.",
  },
  stress: {
    title: "Let's de-stress together",
    videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
    desc: "Take a break with these calming lo-fi beats.",
  },
  anxiety: {
    title: "Breathe in, breathe out",
    videoUrl: "https://www.youtube.com/embed/86m4RLZ61PPs",
    desc: "Listen to this guided breathing exercise to calm your mind.",
  },
  calm: {
    title: "Stay in your zen zone",
    videoUrl: "https://www.youtube.com/embed/m5U90y_HkL8",
    desc: "Perfect time for some nature sounds to stay relaxed.",
  },
  neutral: {
    title: "A little spark for your day",
    videoUrl: "https://www.youtube.com/embed/7NOSDKb0HlU",
    desc: "Some light background music for your daily tasks.",
  },
  anger: {
    title: "Cool down gently",
    videoUrl: "https://www.youtube.com/embed/2OEL4P1Rz04",
    desc: "Slow calming audio to help release tension.",
  },
  fatigue: {
    title: "Take a soft pause",
    videoUrl: "https://www.youtube.com/embed/1ZYbU82GVz4",
    desc: "Gentle sounds for low-energy moments.",
  },
  love: {
    title: "Stay in the warm moment",
    videoUrl: "https://www.youtube.com/embed/rtOvBOTyX00",
    desc: "A soft uplifting track to match your warm mood.",
  },
  fear: {
    title: "Ground yourself safely",
    videoUrl: "https://www.youtube.com/embed/ZToicYcHIOU",
    desc: "Use this calming audio to feel more grounded.",
  },
  disgust: {
    title: "Reset your mind",
    videoUrl: "https://www.youtube.com/embed/lTRiuFIWV54",
    desc: "A light reset to help shift your focus.",
  },
  surprise: {
    title: "Take in the moment",
    videoUrl: "https://www.youtube.com/embed/cyOkMZV7J1Y",
    desc: "Reflect and settle into the unexpected.",
  },
};

const EMOTION_EMOJI = {
  joy: "😄",
  calm: "😌",
  stress: "😤",
  anxiety: "😰",
  sadness: "😢",
  anger: "😡",
  fatigue: "😴",
  love: "🥰",
  fear: "😨",
  disgust: "🤢",
  surprise: "😲",
  neutral: "😐",
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

// 12 Emotion Quick Inputs
const QUICK_INPUTS = [
  { label: "😄 Joy", text: "I feel so happy and excited today" },
  { label: "😌 Calm", text: "I feel peaceful and calm after my morning meditation" },
  { label: "😤 Stress", text: "I feel really stressed about my deadlines and assignments" },
  { label: "😰 Anxiety", text: "I am feeling anxious and nervous about tomorrow" },
  { label: "😢 Sadness", text: "I feel sad and lonely, nothing is going right" },
  { label: "😡 Anger", text: "I am angry and frustrated about what happened" },
  { label: "😴 Fatigue", text: "I am completely exhausted and drained after studying all night" },
  { label: "🥰 Love", text: "I feel full of love and warmth when I think about my family" },
  { label: "😨 Fear", text: "I feel scared and fearful about the future" },
  { label: "🤢 Disgust", text: "I feel disgusted and uncomfortable after seeing that" },
  { label: "😲 Surprise", text: "I am really surprised and shocked by this unexpected event" },
  { label: "😐 Neutral", text: "I feel normal, nothing special happened today" },
];

function MoodAnalysis() {
  const { user, logout, isAdmin } = useAuth();

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);

  const charLimit = 500;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
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
    setSaved(false);
    setResult(null);

    try {
      const prediction = await predictMoodApi({ text });

      console.log("Prediction:", prediction);

      if (!prediction || !prediction.predictedEmotion) {
        throw new Error("Invalid prediction response");
      }

      setResult(prediction);

      const predictedEmotion = prediction.predictedEmotion?.toLowerCase();
      const isNegative = prediction.sentimentLabel?.toLowerCase() === "negative";

      if (["fear", "sadness", "stress", "anxiety"].includes(predictedEmotion) && isNegative) {
        setTimeout(() => {
          setShowCrisisAlert(true);
        }, 500);
      }
    } catch (err) {
      console.error("Prediction error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Analysis failed. Please try again."
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    try {
      await saveMoodApi({
        text,
        predictedEmotion: result.predictedEmotion,
        sentimentLabel: result.sentimentLabel,
        confidence: result.confidence,
        source: "analysis",
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save. Please try again.");
    }
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setError("");
    setSaved(false);
    setShowCrisisAlert(false);
    resetTranscript();
  };

  if (!browserSupportsSpeechRecognition) {
    return <div className="p-10 text-center">Your browser does not support voice input.</div>;
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300 relative">
      <Sidebar />

      <div className="flex flex-1 flex-col relative z-0">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-left">
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white">
                Mood{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-500 to-sky-600">
                  Analysis
                </span>
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Describe how you feel — use your <b>voice</b> or type below.
              </p>
            </div>

            <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-2xl p-8 transition-colors duration-300">
              <div className="mb-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Quick select
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_INPUTS.map(({ label, text: quickText }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setText(quickText);
                        setResult(null);
                        setError("");
                      }}
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
                  className={`w-full resize-none rounded-3xl border ${
                    listening ? "border-teal-400 ring-2 ring-teal-100" : "border-sky-100"
                  } bg-white/80 p-6 text-[0.95rem] focus:outline-none transition-all shadow-inner`}
                />

                <button
                  type="button"
                  onClick={handleToggleListening}
                  className={`absolute bottom-6 right-16 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 shadow-lg ${
                    listening
                      ? "bg-rose-500 text-white animate-pulse"
                      : "bg-teal-500 text-white hover:bg-teal-600"
                  }`}
                >
                  {listening ? "🛑" : "🎤"}
                </button>

                <span
                  className={`absolute bottom-6 right-6 font-mono text-xs ${
                    text.length > charLimit * 0.85 ? "text-rose-400" : "text-slate-300"
                  }`}
                >
                  {text.length}/{charLimit}
                </span>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm">
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
                    className={`rounded-full border-2 px-8 font-bold ${
                      saved ? "border-emerald-400 text-emerald-600" : "border-sky-300 text-sky-600"
                    }`}
                  >
                    {saved ? "✓ Saved" : "Save Entry"}
                  </button>
                )}

                {(text || result) && (
                  <button
                    onClick={handleClear}
                    className="rounded-full border px-6 text-slate-400"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {result && <ResultPanel result={result} />}
          </div>
        </main>
      </div>

      <CrisisAlertModal
        isOpen={showCrisisAlert}
        onClose={() => setShowCrisisAlert(false)}
      />
    </div>
  );
}

const ResultPanel = ({ result }) => {
  const emoKey = result.predictedEmotion?.toLowerCase() || "neutral";
  const emoji = EMOTION_EMOJI[emoKey] || "😐";
  const emoClass = EMOTION_COLORS[emoKey] || "bg-slate-100";
  const sentClass = SENTIMENT_COLORS[result.sentimentLabel] || "bg-slate-100";
  const confPct =
    result.confidencePercentage || Math.round((result.confidence || 0) * 100);

  const suggestion = MOOD_SUGGESTIONS[emoKey] || MOOD_SUGGESTIONS["neutral"];

  return (
    <div className="mt-8 rounded-3xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-6xl shadow-xl border border-slate-50">
          {emoji}
        </div>

        <div>
          <p className="text-4xl font-bold capitalize text-slate-800 dark:text-white">
            {emoKey}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`rounded-full border px-4 py-1 text-xs font-bold ${emoClass}`}>
              {confPct}% confidence
            </span>
            <span className={`rounded-full px-4 py-1 text-xs font-bold ${sentClass}`}>
              {result.sentimentLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-100 dark:border-slate-700 pt-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xl">🎶</span>
          <h4 className="font-bold text-slate-800 dark:text-white">{suggestion.title}</h4>
        </div>

        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
          {suggestion.desc}
        </p>

        <div className="overflow-hidden rounded-2xl shadow-xl aspect-video bg-slate-100">
          <iframe
            width="100%"
            height="100%"
            src={suggestion.videoUrl}
            title="YouTube Recommendation"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default MoodAnalysis;