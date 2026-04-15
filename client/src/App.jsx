import { Routes, Route, Navigate } from "react-router-dom";

// --- Public Pages ---
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// --- User Pages ---
import DashboardPage from "./pages/DashboardPage";
import JournalPage from "./pages/JournalPage";
import SupportPage from "./pages/SupportPage";
import MoodAnalysis from "./pages/MoodAnalysis";
import ReportsPage from "./pages/ReportsPage";

// --- Admin Pages ---
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ManageUsersPage from "./pages/ManageUsersPage";
import RiskAlertsPage from "./pages/RiskAlertsPage";
import SystemReportsPage from "./pages/SystemReportsPage";

// --- User Feature Pages / Components ---
import MoodHistory from "./components/mood/MoodHistory";
import WeeklyInsightCard from "./components/mood/WeeklyInsightCard";

// --- Routes & Context ---
import ProtectRoute from "./routes/ProtectRoute";
import AdminRoute from "./routes/AdminRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600 dark:border-slate-700 dark:border-t-sky-400" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading MindTuneX...
          </p>
        </div>
      </div>
    );
  }

  const homeRedirect = isAuthenticated
    ? isAdmin
      ? "/admin/dashboard"
      : "/dashboard"
    : "/login";

  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<Navigate to={homeRedirect} replace />} />

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={homeRedirect} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to={homeRedirect} replace />
          ) : (
            <RegisterPage />
          )
        }
      />

      {/* User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectRoute>
            <DashboardPage />
          </ProtectRoute>
        }
      />

      <Route
        path="/journal"
        element={
          <ProtectRoute>
            <JournalPage />
          </ProtectRoute>
        }
      />

      <Route
        path="/support"
        element={
          <ProtectRoute>
            <SupportPage />
          </ProtectRoute>
        }
      />

      <Route
        path="/mood-analysis"
        element={
          <ProtectRoute>
            <MoodAnalysis />
          </ProtectRoute>
        }
      />

      <Route
        path="/mood-history"
        element={
          <ProtectRoute>
            <MoodHistory />
          </ProtectRoute>
        }
      />

      <Route
        path="/insights"
        element={
          <ProtectRoute>
            <WeeklyInsightCard />
          </ProtectRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectRoute>
            <ReportsPage />
          </ProtectRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <ManageUsersPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/alerts"
        element={
          <AdminRoute>
            <RiskAlertsPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <SystemReportsPage />
          </AdminRoute>
        }
      />

      {/* Short redirect */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={homeRedirect} replace />} />
    </Routes>
  );
}

export default App;