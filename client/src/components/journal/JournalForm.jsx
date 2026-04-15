import { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "regenerator-runtime/runtime";
import { saveJournalApi } from "../../api/moodApi";

const JournalForm = ({ onSaved }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const charCount = content.length;
  const maxSuggested = 1200;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setContent(transcript);
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

      await saveJournalApi({
        title,
        text: content,
        tags: tagsArray,
        source: "journal",
      });

      setTitle("");
      setContent("");
      setTags("");
      resetTranscript();
      setMessage("Journal entry saved and analysed successfully.");

      if (onSaved) onSaved();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to save journal. Check whether the AI service is running."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-5 text-center text-sm text-rose-600 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-400">
        Your browser does not support voice input.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          Journal Entry Form
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
          Write your thoughts
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          You can type or use voice input in English for better AI mood analysis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Entry Title
          </label>
          <input
            type="text"
            placeholder="Give this reflection a short title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-[1.5rem] border border-sky-100 bg-white/90 px-5 py-4 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-teal-500 dark:focus:ring-teal-900/20"
          />
        </div>

        {/* Content */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              How are you feeling today?
            </label>

            <span
              className={`text-xs font-medium ${
                charCount > maxSuggested
                  ? "text-rose-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {charCount}/{maxSuggested}
            </span>
          </div>

          <div className="relative">
            <textarea
              rows="9"
              placeholder={
                listening
                  ? "Listening... speak now"
                  : "Write your thoughts, emotions, experiences, or concerns here..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full resize-none rounded-[1.75rem] border bg-white/90 p-6 pr-20 text-slate-700 outline-none transition-all placeholder:text-slate-400 ${
                listening
                  ? "border-teal-400 ring-4 ring-teal-100 dark:border-teal-500 dark:ring-teal-900/20"
                  : "border-sky-100 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 dark:border-slate-600 dark:focus:border-teal-500 dark:focus:ring-teal-900/20"
              } dark:bg-slate-900/50 dark:text-slate-200`}
              required
            />

            <button
              type="button"
              onClick={handleToggleListening}
              className={`absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 ${
                listening
                  ? "bg-rose-500 animate-pulse scale-110"
                  : "bg-teal-500 hover:bg-teal-600"
              }`}
              title={listening ? "Stop Listening" : "Start Voice Input"}
            >
              {listening ? "🛑" : "🎤"}
            </button>
          </div>

          {listening && (
            <p className="mt-3 text-center text-xs font-bold uppercase tracking-[0.22em] text-teal-600 animate-pulse dark:text-teal-400">
              MindTuneX is listening...
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Tags <span className="text-slate-300 dark:text-slate-600">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="university, work, stress..."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-[1.5rem] border border-sky-100 bg-white/90 px-5 py-4 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-teal-500 dark:focus:ring-teal-900/20"
          />
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Separate tags with commas to categorize your entry.
          </p>
        </div>

        {/* Alerts */}
        {message && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm text-emerald-700 animate-in fade-in zoom-in-95 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400">
            <span>✅</span>
            {message}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 animate-in fade-in zoom-in-95 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-400">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Your journal entry will be analysed to detect emotional signals and generate insights.
          </p>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="rounded-3xl bg-gradient-to-r from-teal-500 to-sky-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-teal-200 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 dark:shadow-none"
          >
            {loading ? "Analysing Mood..." : "Save Journal Entry"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JournalForm;