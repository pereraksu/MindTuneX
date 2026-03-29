import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

export const registerUserApi = async (userData) => {
  const response = await API.post("/register", userData);
  return response.data;
};

export const loginUserApi = async (userData) => {
  const response = await API.post("/login", userData);
  return response.data;
};

export const getMeApi = async (token) => {
  const response = await API.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};