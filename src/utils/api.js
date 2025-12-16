import axios from "axios";

const API = axios.create({
  baseURL: "https://ellehacks-backend.onrender.com/api",
});

export default API;
