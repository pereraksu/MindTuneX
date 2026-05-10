import axios from "axios";

// ======================================================
// AXIOS INSTANCE
// ======================================================

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api/admin",

  timeout: 60000,

  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// REQUEST INTERCEPTOR
// Auto Attach JWT Token
// ======================================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// ======================================================
// RESPONSE INTERCEPTOR
// Global Error Handling
// ======================================================

API.interceptors.response.use(
  (response) => response,

  (error) => {
    // ==========================
    // Unauthorized
    // ==========================
    if (error.response?.status === 401) {
      console.warn("⚠️ Session expired.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    // ==========================
    // Forbidden
    // ==========================
    else if (error.response?.status === 403) {
      console.warn("⛔ Access denied.");
    }

    // ==========================
    // Server Error
    // ==========================
    else if (error.response?.status >= 500) {
      console.error("🔥 Server Error:", error.response?.data);
    }

    // ==========================
    // Network Error
    // ==========================
    else if (error.code === "ECONNABORTED") {
      console.error("⌛ Request timeout.");
    }

    else if (!error.response) {
      console.error("🌐 Network Error.");
    }

    return Promise.reject(error);
  }
);

// ======================================================
// GENERIC GET REQUEST HELPER
// ======================================================

const fetchData = async (endpoint) => {
  try {
    const res = await API.get(endpoint);
    return res.data;
  } catch (error) {
    console.error(`❌ API Error (${endpoint}):`, error);
    throw error;
  }
};

// ======================================================
// ADMIN API FUNCTIONS
// ======================================================

export const getAdminSummaryApi = () =>
  fetchData("/summary");

export const getAdminUsersApi = () =>
  fetchData("/users");

export const getHighRiskEntriesApi = () =>
  fetchData("/high-risk");

export const getSupportUsersApi = () =>
  fetchData("/support-users");

export const getSystemStatusApi = () =>
  fetchData("/system-status");

// ======================================================
// CHATBOT STATS
// ======================================================

export const getChatbotStatsApi = () =>
  fetchData("/chatbot-stats");

// ======================================================
// EXPORT INSTANCE (optional)
// ======================================================

// ======================================================
// RISK ALERT ACTIONS
// ======================================================

export const markReviewedApi = async (id) => {
  const res = await API.patch(`/alerts/${id}/review`);
  return res.data;
};

export const contactUserApi = async (id) => {
  const res = await API.post(`/alerts/${id}/contact`);
  return res.data;
};

export default API;