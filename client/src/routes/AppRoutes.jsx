import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

// User Pages
import Dashboard from "../pages/Dashboard";
import JournalPage from "../pages/JournalPage";
import MoodAnalysis from "../pages/MoodAnalysis";
import MoodHistory from "../components/mood/MoodHistory";
import WeeklyInsights from "../components/mood/WeeklyInsights";
import SupportPage from "../pages/SupportPage";
import ReportsPage from "../pages/ReportsPage";
import ChatbotPage from "../pages/ChatbotPage";

// Admin Pages
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ManageUsersPage from "../pages/ManageUsersPage";
import RiskAlertsPage from "../pages/RiskAlertsPage";
import SystemReportsPage from "../pages/SystemReportsPage";

// Route Guards
import AdminRoute from "./AdminRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/mood-analysis" element={<MoodAnalysis />} />
        <Route path="/mood-history" element={<MoodHistory />} />
        <Route path="/insights" element={<WeeklyInsights />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />

        {/* Admin */}
        <Route
          path="/admin"
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;