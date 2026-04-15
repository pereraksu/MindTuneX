import { useState, useEffect, useRef } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SystemReportsPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef(null);

  const usageData = [
    { name: 'Mon', entries: 45, color: '#8b5cf6' },
    { name: 'Tue', entries: 52, color: '#a78bfa' },
    { name: 'Wed', entries: 38, color: '#8b5cf6' },
    { name: 'Thu', entries: 65, color: '#a78bfa' },
    { name: 'Fri', entries: 48, color: '#8b5cf6' },
    { name: 'Sat', entries: 25, color: '#c4b5fd' },
    { name: 'Sun', entries: 30, color: '#c4b5fd' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(reportRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const dateStr = new Date().toLocaleString();
      
      pdf.setFillColor(31, 41, 55); 
      pdf.rect(0, 0, 210, 40, 'F');
      
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      pdf.text("MindTuneX System Analytics", 15, 20);
      
      pdf.setFontSize(10);
      pdf.setTextColor(200, 200, 200);
      pdf.text(`Administrator: ${user?.fullName} | Generated: ${dateStr}`, 15, 30);
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 10, 45, pdfWidth, pdfHeight);
      pdf.save(`MindTuneX_System_Report_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans">
      <Sidebar forceAdmin={true} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-7xl space-y-8">
            
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-800 dark:text-white transition-colors">
                  Executive <span className="text-violet-600 dark:text-violet-400">Insights</span>
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Comprehensive overview of platform performance and user well-being.</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  // 🚨 මෙතනට ලස්සන Violet Shadow එකක් එකතු කළා
                  className="flex items-center gap-2 rounded-2xl bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-2xl shadow-violet-200 dark:shadow-violet-900/30 hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-700 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Preparing...
                    </span>
                  ) : (
                    <><span>📥</span> Export Executive Report</>
                  )}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex h-96 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-violet-500"></div>
              </div>
            ) : (
              <div ref={reportRef} className="space-y-8 p-2 bg-slate-50 dark:bg-slate-950 transition-colors">
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <StatusCard title="Server Status" value="Operational" color="text-emerald-500" dotColor="bg-emerald-500" />
                  <StatusCard title="AI Model API" value="Connected" color="text-emerald-500" dotColor="bg-emerald-500" />
                  <StatusCard title="Active Users" value="1,240" color="text-slate-800 dark:text-white" />
                  <StatusCard title="Database" value="Healthy" color="text-emerald-500" dotColor="bg-emerald-500" />
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 text-left">
                  <div className="lg:col-span-2 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none transition-all">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">User Engagement (Weekly Entries)</h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={usageData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1}/>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                          <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                          <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.9)'}} />
                          <Bar dataKey="entries" radius={[10, 10, 0, 0]} barSize={40}>
                            {usageData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none transition-all flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Mood Distribution</h3>
                      <div className="space-y-6">
                        <ProgressItem label="Positive" val={68} color="bg-emerald-400" />
                        <ProgressItem label="Neutral" val={18} color="bg-sky-400" />
                        <ProgressItem label="High Risk" val={14} color="bg-rose-500" />
                      </div>
                    </div>
                    <div className="mt-10 rounded-2xl bg-violet-50 dark:bg-violet-900/20 p-5 border border-violet-100 dark:border-violet-800">
                      <p className="text-[10px] font-black text-violet-700 dark:text-violet-400 uppercase tracking-widest">AI Insight</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">Engagement is rising. User safety metrics remain within stable thresholds.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/60 bg-white/80 shadow-xl shadow-slate-200/50 overflow-hidden dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none text-left">
                   <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">System Activity Logs</h3>
                   </div>
                   <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                      {[
                        { action: "Admin Report Export", user: "Sasini U.", status: "Success", time: "10:45 AM" },
                        { action: "Risk Alert Triggered", user: "User #402", status: "Notified", time: "09:12 AM" },
                        { action: "DB Maintenance", user: "System", status: "Completed", time: "01:00 AM" },
                      ].map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-5 px-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{log.action}</p>
                            <p className="text-xs text-slate-400 font-medium">{log.user}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-violet-600 dark:text-violet-400">{log.status}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{log.time}</p>
                          </div>
                        </div>
                      ))}
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

const StatusCard = ({ title, value, color, dotColor }) => (
  <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none text-left">
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{title}</p>
    <div className="flex items-center gap-2">
      {dotColor && <span className={`h-2 w-2 rounded-full ${dotColor} animate-pulse`}></span>}
      <p className={`text-xl font-black ${color}`}>{value}</p>
    </div>
  </div>
);

const ProgressItem = ({ label, val, color }) => (
  <div>
    <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
      <span>{label}</span>
      <span className="text-slate-800 dark:text-slate-200">{val}%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${val}%` }}></div>
    </div>
  </div>
);

export default SystemReportsPage;