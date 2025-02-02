import axios from "axios";
import Cookies from "js-cookie";
import {appEnv} from "../../app/config/varibales"


// Create an Axios instance
console.log(appEnv.AUTH_URL,"see au url")
const authApi = axios.create({
  baseURL: appEnv.AUTH_URL, // Ensure this matches the server's base URL
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
