import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/moods",
});

// 🔐 Auto attach token (GLOBAL FIX)
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

// 🧠 1. AI Prediction Only
export const predictMoodApi = async (payload) => {
  const response = await API.post("/predict", payload);
  return response.data;
};

// ⚡ 2. Quick Mood Save (no AI)
export const saveMoodApi = async (payload) => {
  const response = await API.post("/", payload);
  return response.data;
};

// ✍️ 3. Journal Save + AI Analysis (MAIN FEATURE 🔥)
export const saveJournalApi = async (payload) => {
  const response = await API.post("/journal", payload);
  return response.data;
};

// 📊 4. Get My Mood History
export const getMyMoodsApi = async () => {
  const response = await API.get("/");
  return response.data;
};