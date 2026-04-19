import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "regenerator-runtime/runtime";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { predictMoodApi, saveMoodApi } from "../api/moodApi";
import { getSupportApi } from "../api/supportApi";
import CrisisAlertModal from "../components/common/CrisisAlertModal";

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
  stress: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/40",
  anxiety: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/40",
  calm: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800/40",
  joy: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/40",
  fatigue: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  sadness: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800/40",
  anger: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800/40",
  love: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800/40",
  fear: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/40",
  neutral: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/40",
  surprise: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800/40",
  disgust: "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/30 dark:text-lime-300 dark:border-lime-800/40",
};

const SENTIMENT_COLORS = {
  positive: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  negative: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

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
  const [support, setSupport] = useState(null);
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
    setSupport(null);

    try {
      const prediction = await predictMoodApi({ text });

      if (!prediction || !prediction.predictedEmotion) {
        throw new Error("Invalid prediction response");
      }

      setResult(prediction);

      try {
        const supportRes = await getSupportApi({
          emotion: prediction.predictedEmotion,
        });
        setSupport(supportRes?.data || supportRes || null);
      } catch (supportErr) {
        console.error("Support fetch error:", supportErr);
        setSupport(null);
      }

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
      setSupport(null);
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
    setSupport(null);
    setError("");
    setSaved(false);
    setShowCrisisAlert(false);
    resetTranscript();
  };

  if (!browserSupportsSpeechRecognition) {
    return <div className="p-10 text-center">Your browser does not support voice input.</div>;
  }

  return (
    <div className="relative flex min-h-screen bg-linear-to-br from-slate-50 to-sky-50 transition-colors duration-300 dark:from-slate-900 dark:to-slate-800">
      <Sidebar />

      <div className="relative z-0 flex flex-1 flex-col">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-left">
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white">
                Mood{" "}
                <span className="bg-linear-to-r from-teal-500 to-sky-600 bg-clip-text text-transparent">
                  Analysis
                </span>
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Describe how you feel — use your <b>voice</b> or type below.
              </p>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800/60">
              <div className="mb-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Quick select
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_INPUTS.map(({ label, text: quickText }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setText(quickText);
                        setResult(null);
                        setSupport(null);
                        setError("");
                      }}
                      className="rounded-full border border-sky-200 bg-white px-4 py-2 text-xs font-medium text-sky-600 transition hover:bg-sky-50 active:scale-95 dark:border-slate-600 dark:bg-slate-800 dark:text-sky-300 dark:hover:bg-slate-700"
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
                    if (support) setSupport(null);
                  }}
                  rows={6}
                  placeholder={listening ? "Listening... speak now" : "How are you feeling right now?"}
                  className={`w-full resize-none rounded-3xl border ${
                    listening
                      ? "border-teal-400 ring-2 ring-teal-100 dark:ring-teal-900/30"
                      : "border-sky-100 dark:border-slate-600"
                  } bg-white/80 p-6 text-[0.95rem] text-slate-700 shadow-inner transition-all focus:outline-none dark:bg-slate-900/50 dark:text-slate-200`}
                />

                <button
                  type="button"
                  onClick={handleToggleListening}
                  className={`absolute bottom-6 right-16 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
                    listening
                      ? "animate-pulse bg-rose-500 text-white"
                      : "bg-teal-500 text-white hover:bg-teal-600"
                  }`}
                >
                  {listening ? "🛑" : "🎤"}
                </button>

                <span
                  className={`absolute bottom-6 right-6 font-mono text-xs ${
                    text.length > charLimit * 0.85
                      ? "text-rose-400"
                      : "text-slate-300 dark:text-slate-500"
                  }`}
                >
                  {text.length}/{charLimit}
                </span>
              </div>

              {error && (
                <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300">
                  ⚠️ {error}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                  className="flex-1 rounded-full bg-linear-to-r from-teal-500 to-sky-600 py-4 text-lg font-bold text-white shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Analysing..." : "Analyse My Mood →"}
                </button>

                {result && (
                  <button
                    onClick={handleSave}
                    className={`rounded-full border-2 px-8 font-bold ${
                      saved
                        ? "border-emerald-400 text-emerald-600 dark:text-emerald-300"
                        : "border-sky-300 text-sky-600 dark:text-sky-300"
                    }`}
                  >
                    {saved ? "✓ Saved" : "Save Entry"}
                  </button>
                )}

                {(text || result) && (
                  <button
                    onClick={handleClear}
                    className="rounded-full border px-6 text-slate-400 dark:border-slate-600 dark:text-slate-400"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {result && <ResultPanel result={result} support={support} />}
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

const ResultPanel = ({ result, support }) => {
  const emoKey = result.predictedEmotion?.toLowerCase() || "neutral";
  const emoji = EMOTION_EMOJI[emoKey] || "😐";
  const emoClass =
    EMOTION_COLORS[emoKey] ||
    "bg-slate-100 text-slate-700 border-slate-200";
  const sentClass =
    SENTIMENT_COLORS[result.sentimentLabel] ||
    "bg-slate-100 text-slate-600";

  const confPct =
    result.confidencePercentage || Math.round((result.confidence || 0) * 100);

  const playlists = support?.youtubePlaylists || [];
  const featuredPlaylist = playlists[0] || null;

  const featuredEmbedUrl = featuredPlaylist?.url
    ? featuredPlaylist.url.replace(
        "https://www.youtube.com/playlist?list=",
        "https://www.youtube.com/embed/videoseries?list="
      )
    : null;

  const topPredictions = Array.isArray(result.top3Predictions)
    ? result.top3Predictions
    : [];

  const explanationKeywords = Array.isArray(result.explanationKeywords)
    ? result.explanationKeywords
    : [];

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-xl duration-500 dark:border-slate-700 dark:bg-slate-800/60">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-slate-50 bg-white text-6xl shadow-xl dark:border-slate-700 dark:bg-slate-900/70">
          {emoji}
        </div>

        <div className="flex-1">
          <p className="text-4xl font-bold capitalize text-slate-800 dark:text-white">
            {emoKey}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-4 py-1 text-xs font-bold ${emoClass}`}
            >
              {confPct}% confidence
            </span>

            <span
              className={`rounded-full px-4 py-1 text-xs font-bold ${sentClass}`}
            >
              {result.sentimentLabel}
            </span>

            {result.confidenceLevel && (
              <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-1 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {result.confidenceLevel} confidence level
              </span>
            )}

            {typeof result.riskScore === "number" && (
              <span className="rounded-full border border-purple-200 bg-purple-100 px-4 py-1 text-xs font-bold text-purple-700 dark:border-purple-800/40 dark:bg-purple-900/30 dark:text-purple-300">
                Risk Score: {result.riskScore}/100
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <InfoCard
          title="Support Level"
          value={result.supportLevel || "moderate"}
          accent="from-rose-500 to-orange-500"
        />
        <InfoCard
          title="Trigger Category"
          value={result.triggerCategory || "general"}
          accent="from-sky-500 to-cyan-500"
        />
        <InfoCard
          title="Recommendation Type"
          value={(result.recommendationType || "general_reflection_content").replaceAll("_", " ")}
          accent="from-emerald-500 to-teal-500"
        />
      </div>

      {topPredictions.length > 0 && (
        <div className="mt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Top 3 AI Predictions
          </p>

          <div className="space-y-3">
            {topPredictions.map((item, index) => {
              const scorePercent =
                item.score <= 1 ? Math.round(item.score * 100) : Math.round(item.score);

              return (
                <div
                  key={`${item.emotion}-${index}`}
                  className="rounded-2xl border border-slate-100 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {EMOTION_EMOJI[item.emotion?.toLowerCase()] || "😐"}
                      </span>
                      <span className="font-semibold capitalize text-slate-700 dark:text-slate-200">
                        {item.emotion}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      {scorePercent}%
                    </span>
                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all duration-700"
                      style={{ width: `${scorePercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {explanationKeywords.length > 0 && (
        <div className="mt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Detected Keywords
          </p>

          <div className="flex flex-wrap gap-2">
            {explanationKeywords.map((keyword, index) => (
              <span
                key={`${keyword}-${index}`}
                className="rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-700 dark:border-teal-800/40 dark:bg-teal-900/20 dark:text-teal-300"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {support?.supportResponse && (
        <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50/80 p-5 dark:border-sky-900/40 dark:bg-sky-900/20">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-500 dark:text-sky-400">
            Support Guidance
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
            {support.supportResponse}
          </p>
        </div>
      )}

      {support?.recommendations?.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Recommendations
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {support.recommendations.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-100 bg-white/80 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {featuredPlaylist && featuredEmbedUrl && (
        <div className="mt-10 border-t border-slate-100 pt-8 dark:border-slate-700">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xl">🎶</span>
            <h4 className="font-bold text-slate-800 dark:text-white">
              Featured Playlist
            </h4>
          </div>

          <p className="mb-2 text-base font-semibold text-slate-700 dark:text-slate-200">
            {featuredPlaylist.title}
          </p>

          <div className="aspect-video overflow-hidden rounded-2xl bg-slate-100 shadow-xl dark:bg-slate-900/50">
            <iframe
              className="h-full w-full"
              src={`${featuredEmbedUrl}&rel=0`}
              title="YouTube Playlist Recommendation"
              frameBorder="0"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <a
            href={featuredPlaylist.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400"
          >
            Open playlist in YouTube
          </a>
        </div>
      )}

      {playlists.length > 1 && (
        <div className="mt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            More Playlists
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.slice(1).map((playlist, index) => (
              <a
                key={index}
                href={playlist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/60"
              >
                {playlist.thumbnail && (
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.title}
                    className="aspect-video w-full object-cover"
                  />
                )}
                <div className="p-4">
                  <p className="line-clamp-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {playlist.title}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
                    Open playlist →
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ title, value, accent }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white/80 p-5 dark:border-slate-700 dark:bg-slate-900/50">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {title}
      </p>
      <p className="mt-3 text-sm font-semibold capitalize text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
};

export default MoodAnalysis;