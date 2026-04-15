import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600 dark:border-slate-700 dark:border-t-sky-400" />
          <p className="text-sm font-medium text-slate-500 animate-pulse dark:text-slate-400">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin access granted
  return children;
};

export default AdminRoute;