import axios from "axios";
import { getToken } from "./secureStore";

const api = axios.create({
  baseURL: "http://localhost/api", // Substitua pela URL correta
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken("userToken");
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
  (error) => {
    if (error.response) {
      console.error("Erro na resposta da API:", error.response.data);
    } else if (error.request) {
      console.error("Nenhuma resposta do servidor:", error.request);
    } else {
      console.error("Erro ao configurar a requisição:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;