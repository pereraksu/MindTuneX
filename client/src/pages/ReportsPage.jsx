import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { getMyMoodsApi } from "../api/moodApi";
import { 
  PieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

// 🚨 අලුත් PDF Libraries
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

const CHART_COLORS = {
  joy: "#facc15", calm: "#38bdf8", stress: "#f87171", anxiety: "#fb923c",
  sadness: "#a78bfa", anger: "#f472b6", fatigue: "#94a3b8", love: "#f472b6",
  fear: "#c084fc", neutral: "#4ade80", surprise: "#2dd4bf", disgust: "#a3e635",
};

const ReportsPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const reportRef = useRef(null);

  const [pieData, setPieData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [avgSentiment, setAvgSentiment] = useState("Neutral");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await getMyMoodsApi();
        const fetchedMoods = Array.isArray(response) ? response : (response.data || []);
        setMoods(fetchedMoods);

        if (fetchedMoods.length === 0) return;

        const emotionCounts = {};
        let totalSentimentScore = 0;

        fetchedMoods.forEach((m) => {
          const emotion = m.predictedEmotion?.toLowerCase() || "neutral";
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;

          if (m.sentimentLabel === "positive") totalSentimentScore += 1;
          else if (m.sentimentLabel === "negative") totalSentimentScore -= 1;
        });

        setPieData(Object.keys(emotionCounts).map(key => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: emotionCounts[key],
          color: CHART_COLORS[key] || "#94a3b8"
        })));

        const avg = totalSentimentScore / fetchedMoods.length;
        if (avg > 0.3) setAvgSentiment("Positive");
        else if (avg < -0.3) setAvgSentiment("Negative");
        else setAvgSentiment("Neutral");

        const trendMap = {};
        fetchedMoods.forEach((m) => {
          const date = new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          let score = 0;
          if (m.sentimentLabel === "positive") score = 1;
          else if (m.sentimentLabel === "negative") score = -1;

          if (!trendMap[date]) {
            trendMap[date] = { date, totalScore: score, count: 1 };
          } else {
            trendMap[date].totalScore += score;
            trendMap[date].count += 1;
          }
        });

        setTrendData(Object.values(trendMap).map(item => ({
          date: item.date,
          score: Number((item.totalScore / item.count).toFixed(2))
        })).reverse());

        if (fetchedMoods.length > 0) {
           setStreak(Math.min(fetchedMoods.length, 7)); 
        }

      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // 🚨 අලුත් Download Logic එක (html-to-image භාවිතා කර)
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      setIsDownloading(true);
      
      // html-to-image මගින් DOM එක පින්තූරයක් බවට පත් කිරීම
      const dataUrl = await toPng(reportRef.current, {
        quality: 1.0,
        pixelRatio: 2, // Quality එක වැඩි කිරීමට
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#f8fafc', // Dark/Light background fix
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // පින්තූරයේ අනුපාතය (Ratio) අනුව උස ගණනය කිරීම
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // A4 පිටුවේ පින්තූරය තැබීම
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      pdf.save("MindTuneX_Emotion_Report.pdf");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download PDF. See console for details.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-5xl space-y-10">
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-left-4 duration-700">
              <div>
                <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white transition-colors">
                  Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-600 dark:from-teal-400 dark:to-sky-400">Reports</span>
                </h1>
                <p className="mt-1 text-slate-500 dark:text-slate-400 transition-colors">
                  Detailed analytics and trends of your emotional progress
                </p>
              </div>

              <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading || loading || moods.length === 0}
                className="flex items-center justify-center gap-2 rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 px-6 py-3 text-sm font-semibold text-teal-600 dark:text-teal-400 shadow-xl shadow-sky-100/50 dark:shadow-none transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:bg-white dark:hover:bg-slate-700/80 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-teal-500 border-t-transparent"></span>
                    Generating PDF...
                  </span>
                ) : (
                  <>
                    <span className="text-xl">📥</span>
                    Download Full PDF Report
                  </>
                )}
              </button>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-100 dark:border-slate-700 border-t-teal-500 dark:border-t-teal-400"></div>
              </div>
            ) : (
              // 🚨 PDF එකට ගන්න ඕන ප්‍රදේශය මෙතනින් පටන් ගනී
              <div ref={reportRef} className="space-y-10 p-4 rounded-3xl">
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none p-6 transition-colors">
                    <p className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">Total Check-ins</p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-5xl font-light text-slate-800 dark:text-white transition-colors">{moods.length}</span>
                      <span className="text-sm text-teal-500 dark:text-teal-400 font-medium">All time</span>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none p-6 transition-colors">
                    <p className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">Average Sentiment</p>
                    <p className={`mt-4 text-4xl font-light transition-colors ${avgSentiment === 'Positive' ? 'text-emerald-500' : avgSentiment === 'Negative' ? 'text-rose-500' : 'text-sky-500'}`}>
                      {avgSentiment}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Based on recent data</p>
                  </div>

                  <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none p-6 transition-colors">
                    <p className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">Activity Level</p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-5xl font-light text-slate-800 dark:text-white transition-colors">{streak} Days</span>
                      <span className="text-sm text-teal-500 dark:text-teal-400 font-medium">Keep it up! 🔥</span>
                    </div>
                  </div>
                </div>

                {moods.length === 0 ? (
                  <div className="flex h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 transition-colors">
                    <span className="mb-4 text-6xl opacity-40 dark:opacity-30 grayscale">📈</span>
                    <p className="font-medium text-slate-500 dark:text-slate-400 text-center px-4">More mood entries needed to generate detailed charts</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    
                    <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none p-8 transition-colors flex flex-col min-h-[400px]">
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
                        Sentiment Trend Over Time
                      </h3>
                      <div className="h-72 w-full flex-1 relative">
                        {/* 🚨 isAnimationActive={false} දැම්මා PDF එකට Chart එක නිවැරදිව ගන්න */}
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.2} vertical={false}/>
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis 
                              domain={[-1, 1]} 
                              ticks={[-1, 0, 1]} 
                              tickFormatter={(val) => val === 1 ? 'Positive' : val === -1 ? 'Negative' : 'Neutral'}
                              stroke="#94a3b8" 
                              fontSize={12} 
                              tickLine={false} 
                              axisLine={false}
                            />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}/>
                            <Line 
                              isAnimationActive={false}
                              type="monotone" 
                              dataKey="score" 
                              stroke="#14b8a6" 
                              strokeWidth={4}
                              dot={{ r: 4, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }} 
                              activeDot={{ r: 8, strokeWidth: 0 }} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-xl shadow-sky-100/50 dark:shadow-none p-8 transition-colors flex flex-col min-h-[400px]">
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
                        Emotion Distribution
                      </h3>
                      <div className="h-72 w-full flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              isAnimationActive={false}
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}/>
                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b' }}/>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
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

export default ReportsPage;