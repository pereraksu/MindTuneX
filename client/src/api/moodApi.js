import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/moods",
});

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// 1. AI එකෙන් විතරක් අඳුරගන්න (Prediction only)
export const predictMoodApi = async (payload) => {
  const response = await API.post("/predict", payload, authConfig());
  return response.data;
};

// 2. Dashboard එකේ Emoji Buttons සඳහා (Quick Check-in)
export const saveMoodApi = async (payload) => {
  const response = await API.post("/", payload, authConfig());
  return response.data;
};

// 3. Journal එකේ ලියන දේවල් AI හරහා සේව් කරන්න (අලුතින් එකතු කළා 🚀)
export const saveJournalApi = async (payload) => {
  // මෙතනදී පාර වෙන්නේ "/journal"
  const response = await API.post("/journal", payload, authConfig());
  return response.data;
};

// 4. සියලුම Moods ලබාගැනීම
export const getMyMoodsApi = async () => {
  const response = await API.get("/", authConfig());
  return response.data;
};