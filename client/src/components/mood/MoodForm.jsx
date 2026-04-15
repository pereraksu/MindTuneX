import { useState } from "react";
import { predictMoodApi, saveMoodApi } from "../../api/moodApi";
import { getSupportApi } from "../../api/supportApi";

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

const SENTIMENT_STYLES = {
  positive:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50",
  negative:
    "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50",
  neutral:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

const MoodForm = ({ onSaved }) => {
  const [text, setText] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [support, setSupport] = useState(null);
  const [loadingPredict, setLoadingPredict] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    if (!text.trim()) return;

    try {
      setError("");
      setLoadingPredict(true);

      const res = await predictMoodApi({ text });
      const result = res?.data || res;

      setPrediction(result);

      const supportRes = await getSupportApi({
        emotion: result.predictedEmotion,
      });

      setSupport(supportRes?.data || supportRes);
    } catch (err) {
      setError(err?.response?.data?.message || "Prediction failed");
    } finally {
      setLoadingPredict(false);
    }
  };

  const handleSave = async () => {
    if (!text.trim()) return;

    try {
      setError("");
      setLoadingSave(true);

      await saveMoodApi({
        text,
        source: "journal",
      });

      setText("");
      setPrediction(null);
      setSupport(null);

      if (onSaved) onSaved();
    } catch (err) {
      setError(err?.response?.data?.message || "Save failed");
    } finally {
      setLoadingSave(false);
    }
  };

  const emoKey = prediction?.predictedEmotion?.toLowerCase() || "neutral";
  const emoji = EMOTION_EMOJI[emoKey] || "😐";
  const sentimentClass =
    SENTIMENT_STYLES[prediction?.sentimentLabel] || SENTIMENT_STYLES.neutral;

  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          Mood Analysis
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
          Analyze your emotional state
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Write how you feel today and let the AI predict your emotional state and
          generate support guidance.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-400">
          ⚠️ {error}
        </div>
      )}

      <textarea
        rows="6"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write how you feel today..."
        className="w-full resize-none rounded-[1.75rem] border border-sky-100 bg-white/90 p-5 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-teal-500 dark:focus:ring-teal-900/20"
      />

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={handlePredict}
          disabled={loadingPredict || !text.trim()}
          className="rounded-2xl bg-gradient-to-r from-teal-500 to-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-200 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 dark:shadow-none"
        >
          {loadingPredict ? "Predicting..." : "Predict Mood"}
        </button>

        <button
          onClick={handleSave}
          disabled={loadingSave || !text.trim()}
          className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-700 disabled:opacity-60 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          {loadingSave ? "Saving..." : "Save Entry"}
        </button>
      </div>

      {prediction && (
        <div className="mt-6 rounded-[1.75rem] border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm dark:bg-slate-900">
              {emoji}
            </div>

            <div>
              <h3 className="text-xl font-semibold capitalize text-slate-800 dark:text-white">
                {prediction.predictedEmotion}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full border border-sky-200 bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-800/50 dark:bg-sky-900/30 dark:text-sky-400">
                  Confidence: {Math.round((prediction.confidence || 0) * 100)}%
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${sentimentClass}`}
                >
                  {prediction.sentimentLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoPill
              label="Confidence Level"
              value={prediction.confidenceLevel || "N/A"}
            />
            <InfoPill
              label="Sentiment Score"
              value={prediction.sentimentScore ?? "N/A"}
            />
            <InfoPill
              label="Recommendation"
              value={prediction.recommendationType || "N/A"}
            />
            <InfoPill
              label="Support Level"
              value={prediction.supportLevel || "N/A"}
            />
          </div>
        </div>
      )}

      {support && (
        <div className="mt-4 rounded-[1.75rem] border border-teal-100 bg-teal-50/70 p-5 dark:border-teal-900/40 dark:bg-teal-900/15">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-500 dark:text-teal-400">
            Support Response
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
            {support.supportResponse}
          </p>
        </div>
      )}
    </div>
  );
};

const InfoPill = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold capitalize text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
};

export default MoodForm;