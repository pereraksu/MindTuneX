import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/support",
});

// 🔐 Auto attach token
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

// 🤝 Get Personalized Support
export const getSupportApi = async (payload) => {
  const response = await API.post("/", payload);
  return response.data;
};