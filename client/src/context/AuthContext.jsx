import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMeApi, loginUserApi, registerUserApi } from "../api/authApi";

const AuthContext = createContext(null);

const extractUser = (responseData) => {
  if (!responseData) return null;
  return responseData.user || responseData.data?.user || responseData.data || responseData;
};

const isUserAdmin = (user) => {
  if (!user) return false;

  const role = user.role || user.user?.role;
  if (typeof role === "string" && role.toLowerCase() === "admin") return true;

  if (user.isAdmin === true || user.user?.isAdmin === true) return true;

  return false;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Load current logged-in user ───
  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      const res = await getMeApi();
      const userData = extractUser(res?.data);

      if (!userData) {
        localStorage.removeItem("token");
        setUser(null);
        return;
      }

      setUser(userData);
    } catch (error) {
      console.error("Failed to load user:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ─── Register ───
  const register = async (formData) => {
    const res = await registerUserApi(formData);
    const responseData = res?.data;

    if (responseData?.token) {
      localStorage.setItem("token", responseData.token);
    }

    const userData = extractUser(responseData);
    if (userData) {
      setUser(userData);
    }

    return responseData;
  };

  // ─── Login ───
  const login = async (formData) => {
    const res = await loginUserApi(formData);
    const responseData = res?.data;

    if (responseData?.token) {
      localStorage.setItem("token", responseData.token);
    }

    const userData = extractUser(responseData);
    if (userData) {
      setUser(userData);
    }

    return responseData;
  };

  // ─── Logout ───
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      register,
      login,
      logout,
      loadUser,
      isAuthenticated: !!user,
      isAdmin: isUserAdmin(user),
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600 dark:border-slate-700 dark:border-t-sky-400" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Loading your session...
            </p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};