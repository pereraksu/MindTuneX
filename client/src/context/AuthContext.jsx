import { createContext, useContext, useEffect, useState } from "react";
import { getMeApi, loginUserApi, registerUserApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── පද්ධතියට ඇතුළු වූ පරිශීලකයාගේ දත්ත ලබා ගැනීම ───
  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await getMeApi(token);
      
      // Backend එකෙන් එන data structure එක අනුව userData සකස් කිරීම
      const userData = res.data?.user || res.data;
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

  // ─── Register Logic ───
  const register = async (formData) => {
    const res = await registerUserApi(formData);
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      const userData = res.data?.user || res.data;
      setUser(userData);
    }
    return res.data;
  };

  // ─── Login Logic ───
  const login = async (formData) => {
    const res = await loginUserApi(formData);
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      const userData = res.data?.user || res.data;
      setUser(userData);
    }
    return res.data;
  };

  // ─── Logout Logic ───
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // ─── Admin Check Logic ───
  const checkAdminStatus = () => {
    if (!user) return false;
    const role = user.role || user.user?.role;
    if (role && role.toLowerCase() === "admin") return true;
    if (user.isAdmin === true || user.user?.isAdmin === true) return true;
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: checkAdminStatus(),
      }}
    >
      {!loading ? children : (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// 🚀 මෙන්න මෙතන තමයි fix එක තියෙන්නේ. 
// ESLint warning එක අයින් කරන්න මේ line එක අනිවාර්යයි:
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};