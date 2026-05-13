import axios from "axios";

// JOURNAL API INSTANCE

const API = axios.create({
  baseURL:
    import.meta.env.VITE_JOURNAL_API_URL ||
    "http://localhost:5000/api/journals",

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
    console.error("❌ Journal Request Error:", error);
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
      console.error("🔥 Journal Server Error:", error.response?.data);
    }

    // Timeout
    else if (error.code === "ECONNABORTED") {
      console.error("⌛ Journal request timeout.");
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

// JOURNAL API FUNCTIONS

// Create Journal Entry
export const createJournalApi = async (payload) => {
  const response = await API.post("/", payload);
  return handleResponse(response);
};

// Get My Journals
export const getMyJournalsApi = async () => {
  const response = await API.get("/");
  return handleResponse(response);
};

// Get Single Journal
export const getJournalByIdApi = async (id) => {
  const response = await API.get(`/${id}`);
  return handleResponse(response);
};

// Update Journal
export const updateJournalApi = async (id, payload) => {
  const response = await API.put(`/${id}`, payload);
  return handleResponse(response);
};

// Delete Journal
export const deleteJournalApi = async (id) => {
  const response = await API.delete(`/${id}`);
  return handleResponse(response);
};
// EXPORT INSTANCE

export default API;