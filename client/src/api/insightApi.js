import axios from "axios";
// INSIGHTS API INSTANCE

const API = axios.create({
  baseURL:
    import.meta.env.VITE_INSIGHTS_API_URL ||
    "http://localhost:5000/api/insights",

  timeout: 60000,

  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
// Auto Attach JWT Token

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    console.error("❌ Insights Request Error:", error);
    return Promise.reject(error);
  }
);
// RESPONSE INTERCEPTOR
// Global Error Handling

API.interceptors.response.use(
  (response) => response,

  (error) => {
    // Unauthorized
    if (error.response?.status === 401) {
      console.warn("⚠️ Session expired.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Forbidden
    else if (error.response?.status === 403) {
      console.warn("⛔ Access denied.");
    }

    // Server Error
    else if (error.response?.status >= 500) {
      console.error("🔥 Insights Server Error:", error.response?.data);
    }

    // Timeout
    else if (error.code === "ECONNABORTED") {
      console.error("⌛ Insights request timeout.");
    }

    // Network Error
    else if (!error.response) {
      console.error("🌐 Network Error.");
    }

    return Promise.reject(error);
  }
);

// HELPER

const handleResponse = (response) => response.data;

// INSIGHTS API FUNCTIONS

// Weekly Insights
export const getWeeklyInsightsApi = async () => {
  const response = await API.get("/weekly");
  return handleResponse(response);
};

// Monthly Insights (Future Feature)
export const getMonthlyInsightsApi = async () => {
  const response = await API.get("/monthly");
  return handleResponse(response);
};

// Emotion Trends (Future Feature)
export const getEmotionTrendsApi = async () => {
  const response = await API.get("/emotion-trends");
  return handleResponse(response);
};

// Wellness Score (Future Feature)
export const getWellnessScoreApi = async () => {
  const response = await API.get("/wellness-score");
  return handleResponse(response);
};

// EXPORT INSTANCE

export default API;