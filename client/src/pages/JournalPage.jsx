import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import JournalForm from "../components/journal/JournalForm";
import { useAuth } from "../context/AuthContext";

const JournalPage = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-4xl space-y-8">
            
            {/* Header Section */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-700">
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white">
                Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-600 dark:from-teal-400 dark:to-sky-400">Journal</span>
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Feel free to express your thoughts. Our AI will analyze your entry to provide personalized support and insights. ✨
              </p>
            </div>

            {/* Journal Writing Area */}
            <div className="rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-2xl p-2 lg:p-4">
               <JournalForm />
            </div>

            {/* Tip of the day */}
            <div className="rounded-2xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/50 p-6 text-sm text-sky-700 dark:text-sky-300">
              <p className="font-semibold uppercase tracking-wider text-xs mb-2">Pro Tip 💡</p>
              Research shows that spending just 5 minutes a day journaling can significantly reduce stress levels. Try to make it a daily habit! 🗓️
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default JournalPage;