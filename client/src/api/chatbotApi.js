import axios from "axios";

// CHATBOT API INSTANCE

const API = axios.create({
  baseURL:
    import.meta.env.VITE_CHATBOT_API_URL ||
    "http://localhost:5000/api/chatbot",

  timeout: 20000,

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
    console.error("❌ Chatbot Request Error:", error);
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
      console.error("🔥 Chatbot Server Error:", error.response?.data);
    }

    // Timeout
    else if (error.code === "ECONNABORTED") {
      console.error("⌛ Chatbot request timeout.");
    }

    // Network Error
    else if (!error.response) {
      console.error("🌐 Network Error.");
    }

    return Promise.reject(error);
  }
);

// HELPER FUNCTION

const handleResponse = (response) => response.data;

// CHATBOT API FUNCTIONS

// Send Message
export const sendChatMessageApi = async (payload) => {
  const response = await API.post("/message", payload);
  return handleResponse(response);
};

// Get Chat History
export const getChatHistoryApi = async () => {
  const response = await API.get("/");
  return handleResponse(response);
};

// Clear Chat History (Optional Future Feature)
export const clearChatHistoryApi = async () => {
  const response = await API.delete("/clear");
  return handleResponse(response);
};
// EXPORT INSTANCEserver

export default API;