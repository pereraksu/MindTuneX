import React, { useMemo } from "react";
import { TagCloud } from "react-tagcloud";
import { useTheme } from "../../context/useTheme";

const POSITIVE_COLORS = [
  "#14b8a6", "#0ea5e9", "#6366f1", "#10b981",
  "#8b5cf6", "#2dd4bf", "#38bdf8",
];

const NEGATIVE_COLORS = [
  "#f43f5e", "#fb923c", "#ef4444", "#f97316",
  "#be123c", "#fb7185", "#fca5a5",
];

const NEGATIVE_HINTS = [
  "stress", "stressed", "anxious", "anxiety", "sad", "tired", "exhausted",
  "angry", "fear", "scared", "bad", "pressure", "deadline", "worried",
  "upset", "drained", "panic", "frustrated", "alone", "lonely",
];

const STOP_WORDS = new Set([
  "i", "am", "feel", "feeling", "felt", "the", "and", "a", "to", "in", "is",
  "it", "of", "for", "with", "my", "was", "that", "on", "have", "been", "this",
  "really", "very", "about", "just", "at", "so", "be", "me", "had", "would",
  "like", "today", "from", "into", "your", "them", "they", "their", "then",
  "when", "what", "because", "after", "before", "there", "here", "got", "get",
  "getting", "make", "made", "being", "still", "also", "more", "than", "some",
]);

const MoodWordCloud = ({ moods = [] }) => {
  const { darkMode } = useTheme();

  const data = useMemo(() => {
    const wordFreq = {};

    moods.forEach((mood) => {
      const text = String(mood?.inputText || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ");

      const words = text.match(/\b[a-z]{4,}\b/g);
      if (!words) return;

      words.forEach((word) => {
        if (!STOP_WORDS.has(word)) {
          wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
      });
    });

    return Object.keys(wordFreq)
      .map((word) => ({ value: word, count: wordFreq[word] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 28);
  }, [moods]);

  const getTagColor = (tag) => {
    const isNegative = NEGATIVE_HINTS.some((h) => tag.value.includes(h));
    const palette = isNegative ? NEGATIVE_COLORS : POSITIVE_COLORS;
    const charSum = tag.value
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return palette[charSum % palette.length];
  };

  if (data.length === 0) {
    return (
      <>
        <style>{STYLES(darkMode)}</style>

        <div className="wc-empty">
          <div className="wc-empty-icon">☁️</div>
          <p className="wc-empty-title">No keywords detected yet</p>
          <p className="wc-empty-sub">
            Add more journal entries to reveal your emotional trigger patterns.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES(darkMode)}</style>

      <div className="wc-card">
        <div className="wc-glow" />

        <div className="wc-header">
          <p className="wc-eyebrow">Keyword Intelligence</p>
          <h2 className="wc-title">Emotional Word Cloud</h2>
          <p className="wc-subtitle">
            Frequently used words extracted from journal reflections.
          </p>
        </div>

        <div className="wc-wrap">
          <TagCloud
            minSize={14}
            maxSize={44}
            tags={data}
            className="wc-cloud"
            renderer={(tag, size) => {
              const color = getTagColor(tag);
              const isLarge = tag.count >= 3;

              return (
                <span
                  key={tag.value}
                  className="wc-tag"
                  style={{
                    fontSize: size,
                    color,
                    fontWeight: isLarge ? 800 : 600,
                    textShadow: darkMode ? `0 0 18px ${color}55` : "none",
                    opacity: 0.78 + Math.min(tag.count * 0.07, 0.22),
                  }}
                  title={`${tag.value} • ${tag.count} time${tag.count > 1 ? "s" : ""}`}
                >
                  {tag.value}
                </span>
              );
            }}
          />
        </div>
      </div>
    </>
  );
};

const STYLES = (darkMode) => `
  .wc-card,
  .wc-empty {
    position: relative;
    overflow: hidden;
    height: 100%;
    min-height: 320px;
    border-radius: 24px;
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.08)"};
    background: ${darkMode ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"};
    padding: 24px;
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    backdrop-filter: blur(22px);
    box-shadow: ${darkMode ? "0 22px 55px rgba(0,0,0,0.28)" : "0 22px 55px rgba(15,23,42,0.08)"};
  }

  .wc-glow {
    position: absolute;
    right: -90px;
    top: -90px;
    width: 240px;
    height: 240px;
    background: radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .wc-header {
    position: relative;
    z-index: 1;
    margin-bottom: 18px;
  }

  .wc-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${darkMode ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.42)"};
    margin-bottom: 6px;
  }

  .wc-title {
    font-size: 20px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.94)" : "#0f172a"};
    margin-bottom: 4px;
  }

  .wc-subtitle {
    font-size: 13px;
    color: ${darkMode ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.52)"};
  }

  .wc-wrap {
    position: relative;
    z-index: 1;
    display: flex;
    min-height: 220px;
    width: 100%;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    background: ${darkMode ? "rgba(0,0,0,0.16)" : "rgba(15,23,42,0.035)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.07)"};
    padding: 22px;
    box-sizing: border-box;
  }

  .wc-cloud {
    text-align: center;
    line-height: 1.35;
  }

  .wc-tag {
    display: inline-block;
    cursor: default;
    user-select: none;
    padding: 4px 7px;
    font-family: 'DM Sans', system-ui, sans-serif;
    line-height: 1.2;
    letter-spacing: -0.01em;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .wc-tag:hover {
    opacity: 1 !important;
    transform: scale(1.12);
    text-shadow: none !important;
    background: ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.055)"};
  }

  .wc-empty {
    min-height: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .wc-empty-icon {
    width: 58px;
    height: 58px;
    border-radius: 18px;
    background: ${darkMode ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.055)"};
    border: 1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin-bottom: 14px;
  }

  .wc-empty-title {
    font-size: 15px;
    font-weight: 800;
    color: ${darkMode ? "rgba(255,255,255,0.72)" : "#0f172a"};
    margin-bottom: 6px;
  }

  .wc-empty-sub {
    font-size: 12.5px;
    color: ${darkMode ? "rgba(255,255,255,0.36)" : "rgba(15,23,42,0.48)"};
    line-height: 1.6;
    max-width: 270px;
  }
`;

export default MoodWordCloud;