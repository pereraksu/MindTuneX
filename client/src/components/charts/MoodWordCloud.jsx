import React from "react";
import { TagCloud } from "react-tagcloud";

const MoodWordCloud = ({ moods }) => {
  
  const colorMap = {
    positive: ["#0d9488", "#0ea5e9", "#6366f1", "#10b981", "#8b5cf6"],
    negative: ["#f43f5e", "#fb923c", "#ef4444", "#f97316", "#be123c"]
  };

  const getWordCounts = () => {
    const wordFreq = {};
    const stopWords = new Set([
      "i", "am", "feel", "feeling", "the", "and", "a", "to", "in", "is", "it", "of", "for", 
      "with", "my", "was", "that", "on", "have", "been", "this", "really", "very", "about",
      "just", "at", "so", "be", "me", "had", "would", "like"
    ]);

    moods.forEach((m) => {
      const text = (m.inputText || "").toLowerCase();
      const words = text.match(/\b(\w+)\b/g);
      
      if (words) {
        words.forEach((word) => {
          if (word.length > 3 && !stopWords.has(word)) {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
          }
        });
      }
    });

    return Object.keys(wordFreq).map((word) => ({
      value: word,
      count: wordFreq[word],
    })).sort((a, b) => b.count - a.count).slice(0, 25);
  };

  const data = getWordCounts();

  // 🚨 Math.random() වෙනුවට වචනයේ අකුරු මත පදනම්ව ස්ථාවර පාටක් තෝරාගැනීම (Deterministic Fix)
  const getTagColor = (tag) => {
    const stressWords = ["stress", "exam", "work", "hard", "tired", "sad", "bad", "pressure", "anxious"];
    const isNegative = stressWords.some(w => tag.value.includes(w));
    const palette = isNegative ? colorMap.negative : colorMap.positive;
    
    // වචනයේ අකුරු වල අගයන් එකතු කරලා index එකක් හදනවා (Math.random වෙනුවට)
    const charSum = tag.value.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const index = charSum % palette.length;
    
    return palette[index];
  };

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400 font-medium italic">
        <div className="text-center">
          <p className="text-2xl mb-2">☁️</p>
          <p>Analyzing your thoughts for triggers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-6 bg-white/30 dark:bg-slate-800/20 rounded-3xl border border-white/40 dark:border-slate-700/50">
      <TagCloud
        minSize={16}
        maxSize={48}
        tags={data}
        className="text-center"
        renderer={(tag, size) => {
          const color = getTagColor(tag); // 🚨 දැන් මේක "Pure" function එකක්
          return (
            <span
              key={tag.value}
              className="inline-block transition-all duration-300 hover:scale-125 hover:z-10 cursor-default px-2 select-none"
              style={{
                fontSize: size,
                color: color,
                fontWeight: tag.count > 1 ? "700" : "500",
                textShadow: "0 2px 4px rgba(0,0,0,0.05)",
                fontFamily: "'Inter', sans-serif"
              }}
              title={`Used ${tag.count} times`}
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