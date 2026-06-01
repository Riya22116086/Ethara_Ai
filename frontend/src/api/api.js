import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Extract FastAPI validation details or standard HTTP message
    const message =
      error.response?.data?.detail ||
      error.message ||
      "An unexpected error occurred.";
    
    // Display error notification
    toast.error(message);
    
    return Promise.reject(error);
  }
);

export default api;
