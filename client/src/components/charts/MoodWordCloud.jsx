import React, { useMemo } from "react";
import { TagCloud } from "react-tagcloud";

const POSITIVE_COLORS = ["#14b8a6", "#0ea5e9", "#6366f1", "#10b981", "#8b5cf6"];
const NEGATIVE_COLORS = ["#f43f5e", "#fb923c", "#ef4444", "#f97316", "#be123c"];

const NEGATIVE_HINTS = [
  "stress",
  "stressed",
  "anxious",
  "anxiety",
  "sad",
  "tired",
  "exhausted",
  "angry",
  "fear",
  "scared",
  "bad",
  "pressure",
  "deadline",
  "worried",
  "upset",
  "drained",
  "panic",
  "frustrated",
  "alone",
  "lonely",
];

const STOP_WORDS = new Set([
  "i",
  "am",
  "feel",
  "feeling",
  "felt",
  "the",
  "and",
  "a",
  "to",
  "in",
  "is",
  "it",
  "of",
  "for",
  "with",
  "my",
  "was",
  "that",
  "on",
  "have",
  "been",
  "this",
  "really",
  "very",
  "about",
  "just",
  "at",
  "so",
  "be",
  "me",
  "had",
  "would",
  "like",
  "today",
  "from",
  "into",
  "your",
  "them",
  "they",
  "their",
  "then",
  "when",
  "what",
  "because",
  "after",
  "before",
  "there",
  "here",
  "got",
  "get",
  "getting",
  "make",
  "made",
  "been",
  "being",
  "still",
  "also",
  "more",
  "than",
  "some",
]);

const MoodWordCloud = ({ moods = [] }) => {
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
      .map((word) => ({
        value: word,
        count: wordFreq[word],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 28);
  }, [moods]);

  const getTagColor = (tag) => {
    const isNegative = NEGATIVE_HINTS.some((hint) => tag.value.includes(hint));
    const palette = isNegative ? NEGATIVE_COLORS : POSITIVE_COLORS;

    const charSum = tag.value
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return palette[charSum % palette.length];
  };

  if (data.length === 0) {
    return (
      <div className="flex h-full min-h-[260px] items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white/40 px-6 text-center dark:border-slate-700 dark:bg-slate-900/30">
        <div>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl dark:bg-slate-800">
            ☁️
          </div>
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
            No keywords detected yet
          </p>
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
            Add more journal entries to reveal your emotional trigger patterns
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center rounded-[2rem] border border-white/50 bg-white/40 p-6 shadow-inner backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/30">
      <TagCloud
        minSize={16}
        maxSize={46}
        tags={data}
        className="text-center"
        renderer={(tag, size) => {
          const color = getTagColor(tag);

          return (
            <span
              key={tag.value}
              className="inline-block cursor-default select-none px-2 py-1 transition-all duration-300 hover:scale-110"
              style={{
                fontSize: size,
                color,
                fontWeight: tag.count >= 3 ? 700 : 600,
                textShadow: "0 2px 10px rgba(0,0,0,0.06)",
                fontFamily: "Inter, sans-serif",
                lineHeight: 1.15,
              }}
              title={`${tag.value} • used ${tag.count} time${tag.count > 1 ? "s" : ""}`}
            >
              {tag.value}
            </span>
          );
        }}
      />
    </div>
  );
};

export default MoodWordCloud;