import api from "../utils/api";
import { saveUserData } from "../utils/secureStore";
import { getCurrentUser } from "./users";
import { saveToken } from "../utils/secureStore";

export const login = async (email: string, password: string) => {
  try {
    const formData = {
      "email": email,
      "password": password
    }

    const response = await api.post("/token/", formData, {
      headers: {
        "Content-Type": "application/json", // Define o tipo correto
      },
    });

    if (response.status === 200) {

      await saveToken("userToken", response.data.access);
      
      const userData = await getCurrentUser();
      await saveUserData(userData);
      return response.data;
    } else {
      throw new Error("Erro ao fazer login.");
    }

  } catch (error) {
    throw error;
  }
};