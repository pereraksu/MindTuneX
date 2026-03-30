import { useState, useEffect, useRef } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";

// 🚨 PDF හදන්න අවශ්‍ය Libraries
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

const SystemReportsPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // 🚨 PDF එක Download වෙද්දී Loading පෙන්නන්න සහ Content එක අල්ලගන්න
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef(null);

  // බොරුවට (Mock) Loading එකක් පෙන්නන්න හදපු එකක්
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // 🚨 PDF Generate කරන Function එක
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      setIsDownloading(true);
      
      // html-to-image මගින් DOM එක පින්තූරයක් බවට පත් කිරීම
      const dataUrl = await toPng(reportRef.current, {
        quality: 1.0,
        pixelRatio: 2, // Quality එක වැඩි කිරීමට
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#f8fafc',
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // පින්තූරයේ අනුපාතය (Ratio) අනුව උස ගණනය කිරීම
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // A4 පිටුවේ පින්තූරය තැබීම
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      pdf.save("MindTuneX_System_Report.pdf");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download PDF. See console for details.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <Sidebar forceAdmin={true} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            
            {/* --- Header Section --- */}
            <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl lg:p-8 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Analytics & Export
                  </p>
                  <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-slate-800 lg:text-4xl dark:text-white">
                    System <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Reports</span>
                  </h1>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Review platform usage, emotional trends, and export data for offline analysis.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/50">
                    📅 Last 30 Days
                  </button>
                  
                  {/* 🚨 Download Button එකට onClick එක සම්බන්ධ කළා */}
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isDownloading || loading}
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <span>📥</span> Export PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* --- Content Section --- */}
            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-white/60 bg-white/70 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-500 dark:border-slate-700 dark:border-t-violet-400"></div>
                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Generating reports...</p>
              </div>
            ) : (
              // 🚨 PDF එකට ගන්න ඕන කෑල්ල අල්ලගන්න ref={reportRef} මෙතනට දැම්මා
              <div ref={reportRef} className="space-y-6 p-2">
                
                {/* Top Metrics Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Platform Engagement</p>
                    <p className="mt-3 text-3xl font-bold text-slate-800 dark:text-white">+24%</p>
                    <p className="mt-1 text-sm text-emerald-500 font-medium">Increased journal entries this month</p>
                  </div>
                  <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Risk Mitigation</p>
                    <p className="mt-3 text-3xl font-bold text-slate-800 dark:text-white">12</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">High-risk alerts resolved this week</p>
                  </div>
                  <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Active Users</p>
                    <p className="mt-3 text-3xl font-bold text-slate-800 dark:text-white">85%</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Of registered users logged in recently</p>
                  </div>
                </div>

                {/* Main Report Area */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  
                  {/* Emotional Distribution (Visual UI) */}
                  <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Monthly Mood Distribution</h3>
                    <p className="mb-6 mt-1 text-sm text-slate-500 dark:text-slate-400">Overview of all logged emotions across the platform.</p>
                    
                    <div className="space-y-4">
                      {[
                        { label: "Positive (Joy, Calm)", val: 65, color: "bg-emerald-500" },
                        { label: "Neutral (Surprise, Neutral)", val: 20, color: "bg-sky-500" },
                        { label: "Negative (Stress, Sadness)", val: 15, color: "bg-rose-500" },
                      ].map((bar, i) => (
                        <div key={i}>
                          <div className="mb-1 flex justify-between text-sm">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{bar.label}</span>
                            <span className="font-bold text-slate-800 dark:text-white">{bar.val}%</span>
                          </div>
                          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className={`h-2.5 rounded-full ${bar.color}`} style={{ width: `${bar.val}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Exports / Logs */}
                  <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">System Logs</h3>
                    <p className="mb-4 mt-1 text-sm text-slate-500 dark:text-slate-400">Recent administrative actions and automated reports.</p>
                    
                    <div className="space-y-3">
                      {[
                        { title: "Weekly Risk Summary Generated", time: "2 hours ago", icon: "📑" },
                        { title: "Admin User Role Updated", time: "Yesterday", icon: "👤" },
                        { title: "Monthly Usage Stats Exported", time: "3 days ago", icon: "📊" },
                        { title: "System Maintenance Completed", time: "1 week ago", icon: "⚙️" },
                      ].map((log, i) => (
                        <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/50">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg dark:bg-slate-700">
                            {log.icon}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{log.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{log.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemReportsPage;