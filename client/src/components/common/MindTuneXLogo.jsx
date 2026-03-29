import React from "react";

const MindTuneXLogo = ({ className = "" }) => {
  return (
    // හරහට තියෙන ලස්සන අලුත් ලෝගෝ ඩිසයින් එක
    <div className={`group flex items-center gap-3 cursor-pointer ${className}`}>
      
      {/* 🧠 SVG අයිකන් එක */}
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="newLogoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>
          </defs>
          <path 
            d="M50 85V70C43.5 70 37 66.5 33 61C29 55.5 29 48.5 32 42C35 35.5 41 31.5 48 31C48.7 31 49.3 31 50 31.1C50.7 31 51.3 31 52 31C59 31.5 65 35.5 68 42C71 48.5 71 55.5 67 61C63 66.5 56.5 70 50 70M50 15C56 15 61.5 17 66 21C70.5 25 73.5 30.5 74.5 36.5C75.5 42.5 74.5 49 71.5 54C68.5 59 63.5 63 57.5 64.5C51.5 66 45 65 40 62.5C35 60 31 55.5 29 50C27 44.5 27.5 38.5 30 33.5C32.5 28.5 36.5 24.5 41.5 21.5C46.5 18.5 52.5 18 58 19.5" 
            stroke="url(#newLogoGradient)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transition-all duration-300 dark:stroke-[4]"
          />
        </svg>
      </div>

      {/* ✍️ අකුරු ටික (Tailwind මගින් Dark Mode පාලනය වේ) */}
      <div className="flex flex-col justify-center">
        <h1 className="font-sans text-2xl font-bold tracking-tight leading-none transition-colors duration-300">
          <span className="text-slate-800 dark:text-white">Mind</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">TuneX</span>
        </h1>
        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 transition-colors duration-300">
          Emotion-Aware Support
        </p>
      </div>
      
    </div>
  );
};

export default MindTuneXLogo;