import { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "regenerator-runtime/runtime";
import { saveJournalApi } from "../../api/moodApi";
import { useTheme } from "../../context/useTheme";

const JournalForm = ({ onSaved }) => {
  const { darkMode } = useTheme();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const maxSuggested = 1200;
  const charCount = content.length;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setContent(transcript);
  }, [transcript]);

  const handleToggleListening = () => {
    if (listening) SpeechRecognition.stopListening();
    else {
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
      <>
        <style>{STYLES(darkMode)}</style>
        <div className="jf-alert error">
          <span>⚠️</span>
          Your browser does not support voice input.
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="jf-card">
        <div className="jf-glow" />

        <div className="jf-header">
          <p className="jf-eyebrow">Journal Entry Form</p>
          <h2 className="jf-title">Write your thoughts</h2>
          <p className="jf-subtitle">
            Type or use voice input in English for better AI mood analysis.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="jf-form">
          <div>
            <label className="jf-label">Entry Title</label>
            <input
              type="text"
              placeholder="Give this reflection a short title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="jf-input"
            />
          </div>

          <div>
            <div className="jf-label-row">
              <label className="jf-label">How are you feeling today?</label>
              <span className={charCount > maxSuggested ? "jf-count danger" : "jf-count"}>
                {charCount}/{maxSuggested}
              </span>
            </div>

            <div className="jf-textarea-wrap">
              <textarea
                rows="9"
                placeholder={
                  listening
                    ? "Listening... speak now"
                    : "Write your thoughts, emotions, experiences, or concerns here..."
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`jf-textarea${listening ? " listening" : ""}`}
                required
              />

              <button
                type="button"
                onClick={handleToggleListening}
                className={`jf-mic-btn${listening ? " active" : ""}`}
                title={listening ? "Stop Listening" : "Start Voice Input"}
              >
                {listening ? "🛑" : "🎤"}
              </button>
            </div>

            {listening && (
              <p className="jf-listening">
                <span />
                MindTuneX is listening...
              </p>
            )}
          </div>

          <div>
            <label className="jf-label">
              Tags <span>(optional)</span>
            </label>

            <input
              type="text"
              placeholder="university, work, stress..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="jf-input"
            />

            <p className="jf-help">
              Separate tags with commas to categorize your entry.
            </p>
          </div>

          {message && (
            <div className="jf-alert success">
              <span>✅</span>
              {message}
            </div>
          )}

          {error && (
            <div className="jf-alert error">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <div className="jf-submit-row">
            <p className="jf-note">
              Your journal entry will be analysed to detect emotional signals and generate insights.
            </p>

            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="jf-submit-btn"
            >
              {loading ? "Analysing Mood..." : "Save Journal Entry"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  .jf-card {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"};
    padding: 26px;
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    backdrop-filter: blur(22px);
    box-shadow: ${darkMode ? "0 22px 55px rgba(0,0,0,0.28)" : "0 22px 55px rgba(15,23,42,0.08)"};
  }

  .jf-glow {
    position: absolute;
    right: -90px;
    top: -90px;
    width: 260px;
    height: 260px;
    background: radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .jf-header,
  .jf-form {
    position: relative;
    z-index: 1;
  }

  .jf-header {
    margin-bottom: 24px;
  }

  .jf-eyebrow,
  .jf-label {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.42)"};
  }

  .jf-title {
    margin-top: 8px;
    font-size: 24px;
    font-weight: 900;
    color: ${darkMode ? "rgba(255,255,255,0.95)" : "#0f172a"};
  }

  .jf-subtitle,
  .jf-help,
  .jf-note {
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
  }

  .jf-subtitle {
    margin-top: 8px;
    font-size: 14px;
    line-height: 1.6;
  }

  .jf-form {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .jf-label {
    display: block;
    margin-bottom: 9px;
  }

  .jf-label span {
    color: ${darkMode ? "rgba(255,255,255,0.22)" : "rgba(15,23,42,0.32)"};
  }

  .jf-label-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .jf-count {
    font-size: 12px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.42)"};
  }

  .jf-count.danger {
    color: #fb7185;
  }

  .jf-input,
  .jf-textarea {
    width: 100%;
    border-radius: 22px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.09)"};
    background: ${darkMode ? "rgba(15,23,42,0.58)" : "rgba(255,255,255,0.82)"};
    color: ${darkMode ? "rgba(255,255,255,0.86)" : "#0f172a"};
    outline: none;
    transition: all 0.2s ease;
    font-family: inherit;
    box-sizing: border-box;
  }

  .jf-input {
    padding: 15px 18px;
  }

  .jf-textarea {
    resize: none;
    padding: 20px 76px 20px 20px;
    line-height: 1.7;
  }

  .jf-input::placeholder,
  .jf-textarea::placeholder {
    color: ${darkMode ? "rgba(255,255,255,0.28)" : "rgba(15,23,42,0.35)"};
  }

  .jf-input:focus,
  .jf-textarea:focus,
  .jf-textarea.listening {
    border-color: rgba(20,184,166,0.55);
    box-shadow: 0 0 0 4px rgba(20,184,166,0.12);
  }

  .jf-textarea-wrap {
    position: relative;
  }

  .jf-mic-btn {
    position: absolute;
    right: 18px;
    bottom: 18px;
    width: 48px;
    height: 48px;
    border-radius: 999px;
    border: none;
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    color: white;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 14px 28px rgba(20,184,166,0.25);
    transition: all 0.2s ease;
  }

  .jf-mic-btn:hover {
    transform: translateY(-2px) scale(1.03);
  }

  .jf-mic-btn.active {
    background: linear-gradient(135deg, #f43f5e, #e11d48);
    animation: jf-pulse 1.1s ease-in-out infinite;
  }

  @keyframes jf-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }

  .jf-listening {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 9px;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #14b8a6;
  }

  .jf-listening span {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #14b8a6;
    box-shadow: 0 0 10px rgba(20,184,166,0.7);
  }

  .jf-help {
    margin-top: 8px;
    font-size: 12px;
  }

  .jf-alert {
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 16px;
    padding: 13px 16px;
    font-size: 13px;
    font-weight: 800;
    border: 1px solid;
  }

  .jf-alert.success {
    background: rgba(16,185,129,0.1);
    border-color: rgba(16,185,129,0.25);
    color: #34d399;
  }

  .jf-alert.error {
    background: rgba(244,63,94,0.1);
    border-color: rgba(244,63,94,0.25);
    color: #fb7185;
  }

  .jf-submit-row {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  @media (min-width: 640px) {
    .jf-submit-row {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .jf-note {
    font-size: 12px;
    line-height: 1.6;
    max-width: 520px;
  }

  .jf-submit-btn {
    border: none;
    border-radius: 999px;
    background: linear-gradient(135deg, #14b8a6, #0ea5e9);
    padding: 14px 26px;
    color: white;
    font-size: 14px;
    font-weight: 900;
    font-family: inherit;
    cursor: pointer;
    box-shadow: 0 16px 30px rgba(20,184,166,0.22);
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .jf-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 20px 38px rgba(20,184,166,0.3);
  }

  .jf-submit-btn:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export default JournalForm;