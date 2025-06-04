import axios from "axios";
import { getToken } from "./secureStore";
import { AuthService } from "@/services/auth";

const api = axios.create({
  // baseURL: "http://localhost:8000/api", // Substitua pela URL correta
  baseURL: "http://192.168.1.5:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  async (config) => {
    try {
      // const token = await getToken(AuthService.ACCESS_TOKEN_KEY);

      if (config.url?.includes("/token/refresh/")) return config;

      const token = await AuthService.getValidToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Erro ao recuperar o token:", error);
    }
    return config;
  },
  (error) => {
    console.error("Erro no interceptor de requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes("/token/")) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newTokenData = await AuthService.refreshToken();

        if (newTokenData && newTokenData.access) {
          processQueue(null, newTokenData.access);
          originalRequest.headers.Authorization = `Bearer ${newTokenData.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error("Falha ao renovar token");
        AuthService.logout();
      } finally {
        isRefreshing = false;
      }
      return Promise.reject(error);
    }
  }
);

export default api;
