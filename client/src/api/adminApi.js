import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAdminSummaryApi = async () => {
  const response = await API.get("/summary", authConfig());
  return response.data;
};

export const getAdminUsersApi = async () => {
  const response = await API.get("/users", authConfig());
  return response.data;
};

export const getHighRiskEntriesApi = async () => {
  const response = await API.get("/high-risk", authConfig());
  return response.data;
};

export const getSupportUsersApi = async () => {
  const response = await API.get("/support-users", authConfig());
  return response.data;
};