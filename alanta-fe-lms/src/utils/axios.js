import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEY } from "./const";

// ✅ HARDCODE dengan /api di akhir
const baseURL = "https://learning-management-sy-git-ce316d-lintang-adya-alantas-projects.vercel.app/api";

const apiInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiInstanceAuth = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstanceAuth.interceptors.request.use(
  (config) => {
    try {
      const session = secureLocalStorage.getItem(STORAGE_KEY);
      if (!session) return config;

      const sessionData =
        typeof session === "string" ? JSON.parse(session) : session;

      const token = sessionData?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch {
      return config;
    }
  },
  (error) => Promise.reject(error)
);

apiInstanceAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      secureLocalStorage.removeItem(STORAGE_KEY);
      window.location.href = "/manager/sign-in";
    }
    return Promise.reject(error);
  }
);

export default apiInstance;