import axios from "axios";

// ===== AXIOS INSTANCE =====
const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

// ===== REQUEST INTERCEPTOR (AUTO TOKEN) =====
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

// ===== RESPONSE INTERCEPTOR (GLOBAL ERROR HANDLING) =====
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ===== API FUNCTIONS =====
export const getAdminSummaryApi = async () => {
  const res = await API.get("/summary");
  return res.data;
};

export const getAdminUsersApi = async () => {
  const res = await API.get("/users");
  return res.data;
};

export const getHighRiskEntriesApi = async () => {
  const res = await API.get("/high-risk");
  return res.data;
};

export const getSupportUsersApi = async () => {
  const res = await API.get("/support-users");
  return res.data;
};

export const getSystemStatusApi = async () => {
  const res = await API.get("/system-status");
  return res.data;
};