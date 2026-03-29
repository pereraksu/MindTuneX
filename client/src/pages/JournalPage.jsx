import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import JournalForm from "../components/journal/JournalForm";
import { useAuth } from "../context/AuthContext";

const JournalPage = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    // 🚀 මෙතන තමයි වෙනස කළේ! (dark:bg-slate-900 සහ transition එකතු කළා)
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar user={user} onLogout={logout} isAdmin={isAdmin} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-4xl">
            <JournalForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default JournalPage;