import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/journals",
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

// ➕ Create Journal Entry
export const createJournalApi = async (payload) => {
  const response = await API.post("/", payload);
  return response.data;
};

// 📖 Get My Journals
export const getMyJournalsApi = async () => {
  const response = await API.get("/");
  return response.data;
};