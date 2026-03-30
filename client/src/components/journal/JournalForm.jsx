import { useState } from "react";
// 🚨 මෙතන 'saveJournalApi' ලෙස වෙනස් කළා (moodApi.js එකෙන්)
import { saveJournalApi } from "../../api/moodApi"; 

const JournalForm = ({ onSaved }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      // 🚨 මෙතන 'saveJournalApi' පාවිච්චි කළා
      // 🚨 'content' වෙනුවට 'text' ලෙස යවනවා (Backend එකට ගැලපෙන්න)
      await saveJournalApi({
        title,
        text: content, 
        tags: tagsArray,
        source: "journal" // වැදගත්: මෙය 'journal' ලෙස සලකුණු කරයි
      });

      setTitle("");
      setContent("");
      setTags("");
      setMessage("Journal entry saved and analysed! ✨");

      // සේව් වුණාට පස්සේ Dashboard/History update කරන්න මේක උදව් වෙනවා
      if (onSaved) onSaved();
      
      // තත්පර 3කින් මැසේජ් එක අයින් කරන්න
      setTimeout(() => setMessage(""), 3000);

    } catch (err) {
      console.error("Save error:", err);
      setError(err?.response?.data?.message || "Failed to save journal. Is AI server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    // දැනට තියෙන ඔයාගේ ලස්සන UI එකම මම මෙතන තියාගත්තා
    <div className="flex items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-2xl">
        
        <div className="mb-6">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white transition-colors">
            New <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-600 dark:from-teal-400 dark:to-sky-400">Journal Entry</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors italic">
            Write in English for the best DistilBERT analysis.
          </p>
        </div>

        <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-2xl shadow-sky-100/50 dark:shadow-none p-8 lg:p-10 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-7">
            
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                Entry Title
              </label>
              <input
                type="text"
                placeholder="Give your entry a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-sky-100 dark:border-slate-600 bg-white/80 dark:bg-slate-900/50 px-5 py-4 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner dark:shadow-black/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                How are you feeling today?
              </label>
              <textarea
                rows="7"
                placeholder="Write your thoughts here in English..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full resize-none rounded-3xl border border-sky-100 dark:border-slate-600 bg-white/80 dark:bg-slate-900/50 p-5 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner dark:shadow-black/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                Tags <span className="text-slate-300 dark:text-slate-600">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="university, work, stress..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-2xl border border-sky-100 dark:border-slate-600 bg-white/80 dark:bg-slate-900/50 px-5 py-4 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner dark:shadow-black/20"
              />
            </div>

            {message && (
              <div className="rounded-2xl bg-emerald-100/80 dark:bg-emerald-900/30 backdrop-blur-sm border border-emerald-200 dark:border-emerald-800/50 px-5 py-3 text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
                <span>✅</span> {message}
              </div>
            )}

            {error && (
              <div className="rounded-2xl bg-rose-100/80 dark:bg-rose-900/30 backdrop-blur-sm border border-rose-200 dark:border-rose-800/50 px-5 py-3 text-rose-700 dark:text-rose-400 text-sm flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="w-full rounded-3xl bg-gradient-to-r from-teal-500 to-sky-600 py-4 text-lg font-medium text-white shadow-lg shadow-teal-200 dark:shadow-none transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:opacity-50"
            >
              {loading ? "Analysing Mood..." : "Save Journal Entry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JournalForm;