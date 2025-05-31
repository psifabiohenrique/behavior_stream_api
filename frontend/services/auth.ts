import api from "../utils/api";
import { deleteToken, getToken, saveUserData } from "../utils/secureStore";
import { getCurrentUser } from "./users";
import { saveToken } from "../utils/secureStore";

interface AuthResponse {
  access: string;
  refresh: string;
}

export class AuthService {
  public static ACCESS_TOKEN_KEY = "accessToken";
  public static REFRESH_TOKEN_KEY = "refreshToken";

  public static async login(
    email: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const formData = {
        email: email,
        password: password,
      };

      const response = await api.post("/token/", formData, {
        headers: {
          "Content-Type": "application/json", // Define o tipo correto
        },
      });

      if (response.status === 200) {
        await saveToken(this.ACCESS_TOKEN_KEY, response.data.access);
        await saveToken(this.REFRESH_TOKEN_KEY, response.data.refresh);

        const userData = await getCurrentUser();
        await saveUserData(userData);
        return response.data;
      } else {
        throw new Error("Erro ao fazer login.");
      }
    } catch (error) {
      throw error;
    }
  }

  static async refreshToken(): Promise<AuthResponse> {
    const refreshToken = await getToken(this.REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      throw new Error("No refresh token found.");
    }

    try {
      const response = await api.post("/token/refresh/", {
        refresh: refreshToken,
      });

      if (response.status !== 200) {
        this.logout();
        throw new Error("Falha ao recarregar token");
      }

      const data = response.data;
      await saveToken(this.ACCESS_TOKEN_KEY, data.access);

      if (data.refresh) {
        await saveToken(this.REFRESH_TOKEN_KEY, data.refresh);
      }

      return data;
    } catch (error) {
      this.logout();
      throw new Error("Falha ao salvar recarregar o token");
    }
  }

  static async getValidToken(): Promise<string | null> {
    let token = await getToken(this.ACCESS_TOKEN_KEY);

    if (!token) {
      return null;
    }

    // Verificar se o token está próximo do vencimento
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      // Se o token já expirou
      if (payload.exp <= currentTime) {
        const refreshData = await this.refreshToken();
        return refreshData.access;
      }

      // Se expira em menos de 5 minutos, renovar
      if (payload.exp - currentTime < 300) {
        try {
          const refreshData = await this.refreshToken();
          return refreshData.access;
        } catch (error) {
          console.warn(
            "Falha ao renovar token preventivamente, usando token atual"
          );
          return token;
        }
      }
      return token;
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      try {
        const refreshData = await this.refreshToken();
        return refreshData.access;
      } catch (refreshError) {
        console.error(
          "Erro ao tentar renovar token após erro de decodificação:",
          refreshError
        );
        this.logout();
        return null;
      }
    }
  }

  static async logout(): Promise<void> {
    await deleteToken(this.REFRESH_TOKEN_KEY);
    await deleteToken(this.ACCESS_TOKEN_KEY);
  }
}
