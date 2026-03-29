import { Routes, Route, Navigate } from "react-router-dom";

// --- Pages (Public & User) ---
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import JournalPage from "./pages/JournalPage";
import SupportPage from "./pages/SupportPage";
import MoodAnalysis from "./pages/MoodAnalysis";
import ReportsPage from "./pages/ReportsPage";

// --- Admin Pages ---
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ManageUsersPage from "./pages/ManageUsersPage"; 
import RiskAlertsPage from "./pages/RiskAlertsPage";   
import SystemReportsPage from "./pages/SystemReportsPage"; // 🚀 අන්තිම පිටුවත් Import කළා

// --- Components ---
import MoodHistory from "./components/mood/MoodHistory";
import WeeklyInsightCard from "./components/mood/WeeklyInsightCard";

// --- Routes & Context ---
import ProtectRoute from "./routes/ProtectRoute";
import AdminRoute from "./routes/AdminRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Routes>
      {/* --- Root Redirect --- */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            isAdmin ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* --- Public Routes --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- User Routes --- */}
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

      {/* --- Admin Routes --- */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      
      {/* 🚀 Manage Users Route */}
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <ManageUsersPage />
          </AdminRoute>
        }
      />

      {/* 🚀 Risk Alerts Route */}
      <Route
        path="/admin/alerts"
        element={
          <AdminRoute>
            <RiskAlertsPage />
          </AdminRoute>
        }
      />

      {/* 🚀 System Reports Route (අලුත් පිටුවට යවයි) */}
      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <SystemReportsPage />
          </AdminRoute>
        }
      />

      {/* --- Fallback Redirects --- */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;