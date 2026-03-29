import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/journals",
});

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createJournalApi = async (payload) => {
  const response = await API.post("/", payload, authConfig());
  return response.data;
};

export const getMyJournalsApi = async () => {
  const response = await API.get("/", authConfig());
  return response.data;
};