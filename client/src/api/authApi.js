import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// Optional: auto attach token for protected auth routes like /me
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

// Register
export const registerUserApi = async (userData) => {
  const response = await API.post("/register", userData);
  return response;
};

// Login
export const loginUserApi = async (userData) => {
  const response = await API.post("/login", userData);
  return response;
};

// Get current logged-in user
export const getMeApi = async () => {
  const response = await API.get("/me");
  return response;
};