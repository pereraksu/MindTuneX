import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import SupportResponseCard from "../components/support/SupportResponseCard";
import RecommendationCard from "../components/support/RecommendationCard";
import { getSupportApi } from "../api/supportApi";
import { useAuth } from "../context/AuthContext";

const EMOTIONS = [
  {
    value: "joy",
    label: "Joy",
    emoji: "😄",
    color:
      "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50",
  },
  {
    value: "calm",
    label: "Calm",
    emoji: "😌",
    color:
      "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800/50",
  },
  {
    value: "stress",
    label: "Stress",
    emoji: "😤",
    color:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50",
  },
  {
    value: "anxiety",
    label: "Anxiety",
    emoji: "😰",
    color:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50",
  },
  {
    value: "sadness",
    label: "Sadness",
    emoji: "😢",
    color:
      "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800/50",
  },
  {
    value: "anger",
    label: "Anger",
    emoji: "😡",
    color:
      "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800/50",
  },
  {
    value: "fatigue",
    label: "Fatigue",
    emoji: "😴",
    color:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  },
  {
    value: "love",
    label: "Love",
    emoji: "🥰",
    color:
      "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50",
  },
  {
    value: "fear",
    label: "Fear",
    emoji: "😨",
    color:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50",
  },
  {
    value: "disgust",
    label: "Disgust",
    emoji: "🤢",
    color:
      "bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-900/30 dark:text-lime-400 dark:border-lime-800/50",
  },
  {
    value: "surprise",
    label: "Surprise",
    emoji: "😲",
    color:
      "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800/50",
  },
  {
    value: "neutral",
    label: "Neutral",
    emoji: "😐",
    color:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50",
  },
];

const SupportPage = () => {
  const { user, logout, isAdmin } = useAuth();

  const [emotion, setEmotion] = useState("stress");
  const [support, setSupport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetSupport = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getSupportApi({ emotion });
      setSupport(res?.data || res || null);
    } catch (err) {
      console.error("Support load failed:", err);
      setError("Failed to load support resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 transition-colors duration-500 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_25%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_25%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.10),transparent_30%)]" />

      <Sidebar />

      <div className="relative flex flex-1 flex-col">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-6xl space-y-10">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none lg:p-8">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-500 via-sky-500 to-cyan-500" />
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-teal-100/50 blur-3xl dark:bg-teal-900/20" />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                  Personalized Emotional Support
                </p>

                <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white lg:text-5xl">
                  Mental Health{" "}
                  <span className="bg-gradient-to-r from-teal-500 to-sky-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-sky-400">
                    Support
                  </span>
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Select the emotion that best matches how you feel right now to
                  receive supportive guidance, tailored recommendations, and
                  calming audio resources.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    🤝 Instant support
                  </span>
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-900/50 dark:bg-sky-900/20 dark:text-sky-300">
                    🎯 Personalized recommendations
                  </span>
                  <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-300">
                    🎵 Audio therapy suggestions
                  </span>
                </div>
              </div>
            </div>

            {/* Selection section */}
            <div className="rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none lg:p-10">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                  Step 1
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                  How are you feeling right now?
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Choose one emotional state to get the most relevant support.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {EMOTIONS.map((emo) => {
                  const isActive = emotion === emo.value;

                  return (
                    <button
                      key={emo.value}
                      onClick={() => {
                        setEmotion(emo.value);
                        setSupport(null);
                        setError("");
                      }}
                      className={`flex items-center gap-3 rounded-[1.5rem] border px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-95 ${
                        isActive
                          ? `ring-2 ring-teal-400 ring-offset-2 dark:ring-teal-500 dark:ring-offset-slate-800 shadow-sm ${emo.color}`
                          : `bg-white hover:-translate-y-0.5 hover:shadow-sm dark:bg-slate-800 ${emo.color}`
                      }`}
                    >
                      <span className="text-xl">{emo.emoji}</span>
                      <span className="capitalize">{emo.label}</span>
                    </button>
                  );
                })}
              </div>

              {error && (
                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-800/50 dark:bg-rose-900/30 dark:text-rose-400">
                  {error}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-8 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Selected emotion:{" "}
                  <span className="font-semibold capitalize text-teal-600 dark:text-teal-400">
                    {emotion}
                  </span>
                </p>

                <button
                  onClick={handleGetSupport}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-teal-500 to-sky-600 px-8 py-4 text-lg font-medium text-white shadow-xl shadow-teal-200 transition-all hover:-translate-y-0.5 hover:shadow-2xl disabled:opacity-60 dark:shadow-none sm:w-auto"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Finding support...
                    </>
                  ) : (
                    "Get Personalized Support →"
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            {support && (
              <div className="animate-[fadeIn_0.5s_ease] space-y-10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    Step 2
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                    Your Personalized Action Plan
                  </h2>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <SupportResponseCard support={support} />
                  <RecommendationCard support={support} />
                </div>

                {support.youtubePlaylists &&
                  support.youtubePlaylists.length > 0 && (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                          Step 3 · Curated Music & Audio Therapy
                        </h2>

                        <span className="flex h-6 items-center rounded-full bg-red-100 px-3 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                          <svg
                            className="mr-1 h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                          </svg>
                          YouTube
                        </span>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {support.youtubePlaylists.map((playlist, index) => (
                          <a
                            key={index}
                            href={playlist.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:shadow-none"
                          >
                            <div className="relative aspect-video w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                              <img
                                src={playlist.thumbnail}
                                alt={playlist.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />

                              <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-lg">
                                  <svg
                                    className="ml-1 h-6 w-6 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-1 flex-col justify-between p-4">
                              <h3 className="line-clamp-2 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                                {playlist.title}
                              </h3>

                              <p className="mt-3 text-xs font-semibold text-teal-600 transition-colors group-hover:text-sky-600 dark:text-teal-400 dark:group-hover:text-sky-400">
                                Listen Now →
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupportPage;