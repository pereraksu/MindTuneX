import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/support",
});

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getSupportApi = async (payload) => {
  const response = await API.post("/", payload, authConfig());
  return response.data;
};