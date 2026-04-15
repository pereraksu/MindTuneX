import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import JournalForm from "../components/journal/JournalForm";
import { useAuth } from "../context/AuthContext";

const JournalPage = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 transition-colors duration-500 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_25%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_25%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.10),transparent_30%)]" />

      <Sidebar />

      <div className="relative flex flex-1 flex-col">
        <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-5xl space-y-8">
            
            {/* Hero */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-2xl shadow-sky-100/40 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-700 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none lg:p-8">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-500 via-sky-500 to-cyan-500" />
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-teal-100/50 blur-3xl dark:bg-teal-900/20" />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                  Personal Reflection Space
                </p>

                <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-slate-800 dark:text-white lg:text-5xl">
                  Daily{" "}
                  <span className="bg-gradient-to-r from-teal-500 to-sky-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-sky-400">
                    Journal
                  </span>
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Take a moment to express your thoughts and feelings. Your journal
                  entry will be analyzed by the AI system to generate emotional
                  insights, mood patterns, and personalized support recommendations.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    ✍️ Private reflection
                  </span>
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-900/50 dark:bg-sky-900/20 dark:text-sky-300">
                    🤖 AI-powered analysis
                  </span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300">
                    📈 Insight generation
                  </span>
                </div>
              </div>
            </div>

            {/* Main Writing Area */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <div className="rounded-[2rem] border border-white/60 bg-white/75 p-3 shadow-2xl shadow-sky-100/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none lg:p-4">
                  <JournalForm />
                </div>
              </div>

              {/* Side Info Panel */}
              <div className="space-y-6">
                <InfoCard
                  title="Why journaling matters"
                  text="Writing regularly can help improve self-awareness, reduce stress, and reveal emotional triggers over time."
                  tone="sky"
                  icon="📘"
                />

                <InfoCard
                  title="Best practice"
                  text="Focus on honesty rather than perfection. Even a few lines about your day can generate valuable insights."
                  tone="emerald"
                  icon="✨"
                />

                <InfoCard
                  title="Pro tip"
                  text="Spending just five minutes each day journaling can support emotional regulation and help you build a healthy reflective habit."
                  tone="violet"
                  icon="💡"
                />
              </div>
            </div>

            {/* Bottom Note */}
            <div className="rounded-[1.75rem] border border-sky-100 bg-sky-50/80 p-6 text-sm text-sky-700 shadow-sm dark:border-sky-900/40 dark:bg-sky-900/20 dark:text-sky-300">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2 text-sky-500 dark:text-sky-400">
                Daily Reflection Reminder
              </p>
              The more consistently you write, the better the system can identify
              patterns in mood, emotional triggers, and recovery behaviour over time.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const InfoCard = ({ title, text, tone = "sky", icon = "ℹ️" }) => {
  const toneStyles = {
    sky: "border-sky-100 bg-sky-50/80 dark:border-sky-900/40 dark:bg-sky-900/20",
    emerald:
      "border-emerald-100 bg-emerald-50/80 dark:border-emerald-900/40 dark:bg-emerald-900/20",
    violet:
      "border-violet-100 bg-violet-50/80 dark:border-violet-900/40 dark:bg-violet-900/20",
  };

  return (
    <div className={`rounded-[1.75rem] border p-5 shadow-sm ${toneStyles[tone]}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-xl shadow-sm dark:bg-slate-800/80">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {text}
      </p>
    </div>
  );
};

export default JournalPage;