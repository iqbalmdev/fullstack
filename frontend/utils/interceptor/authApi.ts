import axios from "axios";
import Cookies from "js-cookie";


const API_BASE = process.env.NODE_ENV === 'development' ?"http://localhost:5001" : 'https://fullstack-1-gjel.onrender.com'

// Create an Axios instance
const authApi = axios.create({
  baseURL: API_BASE, // Ensure this matches the server's base URL
  withCredentials: true, // Ensure cookies are sent with the request
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Token
authApi.interceptors.request.use(
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
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "/"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default authApi;
