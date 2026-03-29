import { useState } from "react";
import { predictMoodApi, saveMoodApi } from "../../api/moodApi";
import { getSupportApi } from "../../api/supportApi";

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
      setPrediction(res.data);

      const supportRes = await getSupportApi({
        emotion: res.data.predictedEmotion,
      });
      setSupport(supportRes.data);
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

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-slate-800">Mood Analysis</h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <textarea
        rows="5"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write how you feel today..."
        className="w-full rounded-xl border border-slate-300 p-4 outline-none focus:border-blue-500"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={handlePredict}
          disabled={loadingPredict}
          className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {loadingPredict ? "Predicting..." : "Predict Mood"}
        </button>

        <button
          onClick={handleSave}
          disabled={loadingSave}
          className="rounded-xl bg-slate-800 px-5 py-2 text-white hover:bg-slate-900 disabled:opacity-70"
        >
          {loadingSave ? "Saving..." : "Save Entry"}
        </button>
      </div>

      {prediction && (
        <div className="mt-6 rounded-xl border border-blue-100 bg-slate-50 p-4">
          <h3 className="mb-3 text-lg font-semibold text-slate-800">
            Prediction Result
          </h3>

          <div className="grid gap-2 text-sm text-slate-700">
            <p><span className="font-semibold">Emotion:</span> {prediction.predictedEmotion}</p>
            <p><span className="font-semibold">Confidence:</span> {prediction.confidence} ({prediction.confidenceLevel})</p>
            <p><span className="font-semibold">Sentiment:</span> {prediction.sentimentLabel} ({prediction.sentimentScore})</p>
            <p><span className="font-semibold">Recommendation:</span> {prediction.recommendationType}</p>
            <p><span className="font-semibold">Support Level:</span> {prediction.supportLevel}</p>
          </div>
        </div>
      )}

      {support && (
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-blue-700">
            Support Response
          </h3>
          <p className="text-sm text-slate-700">{support.supportResponse}</p>
        </div>
      )}
    </div>
  );
};

export default MoodForm;