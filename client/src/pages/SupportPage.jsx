import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import SupportResponseCard from "../components/support/SupportResponseCard";
import RecommendationCard from "../components/support/RecommendationCard";
import { getSupportApi } from "../api/supportApi";
import { useAuth } from "../context/AuthContext";

// Dark mode colors added for emotions
const EMOTIONS = [
  { value: "joy",      label: "Joy",      emoji: "😄", color: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50 dark:hover:bg-yellow-900/50" },
  { value: "calm",     label: "Calm",     emoji: "😌", color: "bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800/50 dark:hover:bg-sky-900/50" },
  { value: "stress",   label: "Stress",   emoji: "😤", color: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 dark:hover:bg-red-900/50" },
  { value: "anxiety",  label: "Anxiety",  emoji: "😰", color: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50 dark:hover:bg-orange-900/50" },
  { value: "sadness",  label: "Sadness",  emoji: "😢", color: "bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800/50 dark:hover:bg-violet-900/50" },
  { value: "anger",    label: "Anger",    emoji: "😡", color: "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800/50 dark:hover:bg-pink-900/50" },
  { value: "fatigue",  label: "Fatigue",  emoji: "😴", color: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700" },
  { value: "love",     label: "Love",     emoji: "🥰", color: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50 dark:hover:bg-rose-900/50" },
  { value: "fear",     label: "Fear",     emoji: "😨", color: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50 dark:hover:bg-purple-900/50" },
  { value: "disgust",  label: "Disgust",  emoji: "🤢", color: "bg-lime-100 text-lime-700 border-lime-200 hover:bg-lime-200 dark:bg-lime-900/30 dark:text-lime-400 dark:border-lime-800/50 dark:hover:bg-lime-900/50" },
  { value: "surprise", label: "Surprise", emoji: "😲", color: "bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800/50 dark:hover:bg-teal-900/50" },
  { value: "neutral",  label: "Neutral",  emoji: "😐", color: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50 dark:hover:bg-green-900/50" },
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
      setSupport(res.data || res);
    } catch (err) {
      console.error("Support load failed:", err);
      setError("Failed to load support resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-5xl space-y-10">
            
            {/* Header */}
            <div>
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white transition-colors">
                Mental Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-600 dark:from-teal-400 dark:to-sky-400">Support</span>
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400 transition-colors">
                Tell us how you're feeling — get instant personalized support and recommendations
              </p>
            </div>

            {/* Emotion Selection Card - Glass */}
            <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-2xl shadow-sky-100/50 dark:shadow-none p-8 lg:p-10 transition-colors">
              <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                1. How are you feeling right now?
              </h2>

              {/* Emotion Chips */}
              <div className="flex flex-wrap gap-3">
                {EMOTIONS.map((emo) => (
                  <button
                    key={emo.value}
                    onClick={() => {
                      setEmotion(emo.value);
                      setSupport(null);
                      setError("");
                    }}
                    className={`flex items-center gap-2 rounded-3xl border px-5 py-3 text-sm font-medium transition-all active:scale-95 ${
                      emotion === emo.value
                        ? `ring-2 ring-teal-400 dark:ring-teal-500 ring-offset-2 dark:ring-offset-slate-800 ${emo.color}`
                        : `border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 ${emo.color}`
                    }`}
                  >
                    <span className="text-xl">{emo.emoji}</span>
                    <span className="capitalize">{emo.label}</span>
                  </button>
                ))}
              </div>

              {error && (
                <div className="mt-6 rounded-2xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/50 p-4 text-sm text-rose-600 dark:text-rose-400">
                  {error}
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-8 gap-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Selected: <span className="font-semibold capitalize text-teal-600 dark:text-teal-400">{emotion}</span>
                </p>
                
                <button
                  onClick={handleGetSupport}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 w-full sm:w-auto rounded-3xl bg-gradient-to-r from-teal-500 to-sky-600 px-8 py-4 text-lg font-medium text-white shadow-xl shadow-teal-200 dark:shadow-none transition-all hover:-translate-y-0.5 hover:shadow-2xl disabled:opacity-60"
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

            {/* Results Area */}
            {support && (
              <div className="animate-[fadeIn_0.5s_ease] space-y-10">
                
                {/* 1. Text Recommendations */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    2. Your Personalized Action Plan
                  </h2>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <SupportResponseCard support={support} />
                    <RecommendationCard support={support} />
                  </div>
                </div>

                {/* 2. YouTube Playlist Recommendations (New Section) */}
                {support.youtubePlaylists && support.youtubePlaylists.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        3. Curated Music & Audio Therapy
                      </h2>
                      <span className="flex h-6 items-center rounded-full bg-red-100 dark:bg-red-900/30 px-3 text-xs font-semibold text-red-600 dark:text-red-400">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
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
                          className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                          {/* Thumbnail */}
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                            <img 
                              src={playlist.thumbnail} 
                              alt={playlist.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-lg">
                                <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                              </div>
                            </div>
                          </div>
                          
                          {/* Title */}
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <h3 className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2 text-sm leading-relaxed">
                              {playlist.title}
                            </h3>
                            <p className="mt-3 text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
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