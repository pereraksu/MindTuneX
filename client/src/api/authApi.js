import axios from "axios";

// AUTH AXIOS INSTANCE

const API = axios.create({
  baseURL:
    import.meta.env.VITE_AUTH_API_URL ||
    "http://localhost:5000/api/auth",

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
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
// Global Auth Error Handling

API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
// HELPER

const handleResponse = (response) => response.data;

// AUTH API FUNCTIONS

export const registerUserApi = async (userData) => {
  const response = await API.post("/register", userData);
  return handleResponse(response);
};

export const loginUserApi = async (userData) => {
  const response = await API.post("/login", userData);
  return handleResponse(response);
};

export const getMeApi = async () => {
  const response = await API.get("/me");
  return handleResponse(response);
};

export default API;