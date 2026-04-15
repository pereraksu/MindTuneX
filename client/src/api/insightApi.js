import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/insights",
});

// Auto attach token (best practice 🔥)
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

// Get Weekly Insights
export const getWeeklyInsightsApi = async () => {
  const response = await API.get("/weekly");
  return response.data;
};