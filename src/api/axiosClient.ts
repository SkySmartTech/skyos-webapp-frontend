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

const resolveApiBaseUrl = (): string => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (typeof window !== "undefined") {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isLocal) {
      return "http://localhost:8000/api";
    }
  }

  return configuredBaseUrl || "http://localhost:8000/api";
};

export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    Accept: "application/json",
  },
});

// Add Bearer Token Automatically
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();

  if (token) {
    if (!config.headers) {
      config.headers = {};
    }

    if (typeof (config.headers as any).set === "function") {
      (config.headers as any).set("Authorization", `Bearer ${token}`);
    } else {
      (config.headers as Record<string, string | number | boolean>)["Authorization"] = `Bearer ${token}`;
    }
  }

  return config;
});

// Handle Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.dispatchEvent(new Event("skyos:unauthorized"));
    }

    return Promise.reject(error);
  },
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
