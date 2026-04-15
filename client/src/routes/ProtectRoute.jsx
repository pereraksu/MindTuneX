import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500 dark:border-slate-700 dark:border-t-orange-400" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authorized
  return children;
};

export default ProtectRoute;