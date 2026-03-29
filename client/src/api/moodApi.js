import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/moods",
});

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const predictMoodApi = async (payload) => {
  const response = await API.post("/predict", payload, authConfig());
  return response.data;
};

export const saveMoodApi = async (payload) => {
  const response = await API.post("/", payload, authConfig());
  return response.data;
};

export const getMyMoodsApi = async () => {
  const response = await API.get("/", authConfig());
  return response.data;
};