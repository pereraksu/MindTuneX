import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/insights",
});

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getWeeklyInsightsApi = async () => {
  const response = await API.get("/weekly", authConfig());
  return response.data;
};