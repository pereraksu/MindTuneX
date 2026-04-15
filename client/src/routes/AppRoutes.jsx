import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "../pages/Home";

// User Pages
import Dashboard from "../pages/Dashboard";
import JournalPage from "../pages/JournalPage";
import MoodAnalysis from "../pages/MoodAnalysis";
import MoodHistory from "../components/mood/MoodHistory";
import WeeklyInsights from "../components/mood/WeeklyInsights";
import SupportPage from "../pages/SupportPage";

// Admin Pages
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ManageUsersPage from "../pages/ManageUsersPage";
import RiskAlertsPage from "../pages/RiskAlertsPage";

// Route Guards
import AdminRoute from "./AdminRoute";

// (Optional) Add this later if needed
// import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* ================= USER ROUTES ================= */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/mood-analysis" element={<MoodAnalysis />} />
        <Route path="/mood-history" element={<MoodHistory />} />
        <Route path="/insights" element={<WeeklyInsights />} />
        <Route path="/support" element={<SupportPage />} />

        {/* ================= ADMIN ROUTES ================= */}
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

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;