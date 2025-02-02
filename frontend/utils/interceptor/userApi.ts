import axios from "axios";
import Cookies from "js-cookie";

const API_BASE = process.env.USER_URL || "http://localhost:4201";

// Create an Axios instance
const userApi = axios.create({
  baseURL: API_BASE,
  withCredentials: true,  // This is already correct
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Token
userApi.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user) : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      // window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default userApi;
