// src/api/axiosClient.ts

import axios, { type InternalAxiosRequestConfig } from "axios";

const TOKEN_KEY = "skyos_token";

// =======================
// Token Helpers
// =======================

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// =======================
// Laravel API
// =======================

export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
});

// Add Bearer Token Automatically
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      config.headers.set(
        "Authorization",
        `Bearer ${token}`
      );
    }

    return config;
  }
);

// Handle Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.dispatchEvent(
        new Event("skyos:unauthorized")
      );
    }

    return Promise.reject(error);
  }
);

// =======================
// Siluta Andon PHP API
// =======================

export const phpClient = axios.create({
  baseURL: import.meta.env.VITE_PHP_API_URL || "https://siluandon.lk/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default apiClient;