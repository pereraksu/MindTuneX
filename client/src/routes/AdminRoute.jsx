import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  // 🚀 isAuthenticated සහ isAdmin යන දෙකම Context එකෙන් ලබාගන්න
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600"></div>
          <p className="text-sm font-medium text-slate-500 animate-pulse">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // 2. Login වී නොමැති නම් කෙලින්ම Login පිටුවට
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Admin ද නැද්ද යන්න පරීක්ෂා කිරීම
  // 🚀 අපි කලින් user.role බැලුවට වඩා මේ isAdmin value එක වඩාත් නිවැරදියි
  if (!isAdmin) {
    console.warn("Access Denied: Redirecting to user dashboard.");
    return <Navigate to="/dashboard" replace />;
  }

  // Admin නම් පමණක් අදාළ පිටුව පෙන්වන්න
  return children;
};

export default AdminRoute;