import axios from "axios";

// SUPPORT API INSTANCE

const API = axios.create({
  baseURL:
    import.meta.env.VITE_SUPPORT_API_URL ||
    "http://localhost:5000/api/support",

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
    console.error("❌ Support Request Error:", error);
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

    // Validation Error
    else if (error.response?.status === 400) {
      console.warn("⚠️ Invalid support request.");
    }

    // Server Error
    else if (error.response?.status >= 500) {
      console.error("🔥 Support Server Error:", error.response?.data);
    }

    // Timeout
    else if (error.code === "ECONNABORTED") {
      console.error("⌛ Support request timeout.");
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

// SUPPORT API FUNCTIONS

// Get Personalized Support
export const getSupportApi = async (payload) => {
  const response = await API.post("/", payload);
  return handleResponse(response);
};

// Wellness Recommendations
export const getWellnessRecommendationsApi = async () => {
  const response = await API.get("/recommendations");
  return handleResponse(response);
};

// Crisis Support Resources
export const getCrisisResourcesApi = async () => {
  const response = await API.get("/crisis-resources");
  return handleResponse(response);
};

// AI Coping Suggestions
export const getCopingStrategiesApi = async (payload) => {
  const response = await API.post("/coping-strategies", payload);
  return handleResponse(response);
};
// EXPORT INSTANCE

export default API;