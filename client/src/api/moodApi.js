import axios from "axios";

// ======================================================
// MOOD API INSTANCE
// ======================================================

const API = axios.create({
  baseURL:
    import.meta.env.VITE_MOOD_API_URL ||
    "http://localhost:5000/api/moods",

  timeout: 20000,

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
    console.error("❌ Mood Request Error:", error);
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

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // ==========================
    // Forbidden
    // ==========================
    else if (error.response?.status === 403) {
      console.warn("⛔ Access denied.");
    }

    // ==========================
    // Validation Error
    // ==========================
    else if (error.response?.status === 400) {
      console.warn("⚠️ Invalid mood request.");
    }

    // ==========================
    // Server Error
    // ==========================
    else if (error.response?.status >= 500) {
      console.error("🔥 Mood Server Error:", error.response?.data);
    }

    // ==========================
    // Timeout
    // ==========================
    else if (error.code === "ECONNABORTED") {
      console.error("⌛ Mood request timeout.");
    }

    // ==========================
    // Network Error
    // ==========================
    else if (!error.response) {
      console.error("🌐 Network Error.");
    }

    return Promise.reject(error);
  }
);

// ======================================================
// HELPER
// ======================================================

const handleResponse = (response) => response.data;

// ======================================================
// MOOD API FUNCTIONS
// ======================================================

// 🧠 AI Prediction Only
export const predictMoodApi = async (payload) => {
  const response = await API.post("/predict", payload);
  return handleResponse(response);
};

// ⚡ Quick Mood Save
export const saveMoodApi = async (payload) => {
  const response = await API.post("/", payload);
  return handleResponse(response);
};

// ✍️ Journal Save + AI Analysis
export const saveJournalApi = async (payload) => {
  const response = await API.post("/journal", payload);
  return handleResponse(response);
};

// 📊 Get Mood History
export const getMyMoodsApi = async () => {
  const response = await API.get("/");
  return handleResponse(response);
};

// 📈 Mood Analytics (Future Feature)
export const getMoodAnalyticsApi = async () => {
  const response = await API.get("/analytics");
  return handleResponse(response);
};

// 🔥 Emotion Trends
export const getEmotionTrendsApi = async () => {
  const response = await API.get("/emotion-trends");
  return handleResponse(response);
};

// 🚨 Crisis Detection Logs
export const getRiskAlertsApi = async () => {
  const response = await API.get("/risk-alerts");
  return handleResponse(response);
};

// ======================================================
// EXPORT INSTANCE
// ======================================================

export default API;