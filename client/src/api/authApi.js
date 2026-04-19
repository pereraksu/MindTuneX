import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// Auto attach token for protected routes like /me
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
  return response.data;
};

// Login
export const loginUserApi = async (userData) => {
  const response = await API.post("/login", userData);
  return response.data;
};

// Get current logged-in user
export const getMeApi = async () => {
  const response = await API.get("/me");
  return response.data;
};