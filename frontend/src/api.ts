import axios from "axios";

const api = axios.create({
    baseURL: "https://kod-bank-backend.vercel.app/api",
    withCredentials: true,
});

export default api;
