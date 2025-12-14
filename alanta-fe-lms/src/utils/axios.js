import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEY } from "./const";

/* ===============================
   BASE URL (HARUS /api)
================================ */
const BASE_URL =
  "https://learning-management-sy-git-ce316d-lintang-adya-alantas-projects.vercel.app/api";

/* ===============================
   PUBLIC AXIOS (NO TOKEN)
================================ */
const apiInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===============================
   AUTH AXIOS (WITH TOKEN)
================================ */
export const apiInstanceAuth = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===============================
   REQUEST INTERCEPTOR
================================ */
apiInstanceAuth.interceptors.request.use(
  (config) => {
    try {
      const session = secureLocalStorage.getItem(STORAGE_KEY);
      if (!session) return config;

      const parsed =
        typeof session === "string" ? JSON.parse(session) : session;

      const token = parsed?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => Promise.reject(error)
);

/* ===============================
   RESPONSE INTERCEPTOR
================================ */
apiInstanceAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired / invalid
    if (error?.response?.status === 401) {
      secureLocalStorage.removeItem(STORAGE_KEY);
      window.location.replace("/manager/sign-in");
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
