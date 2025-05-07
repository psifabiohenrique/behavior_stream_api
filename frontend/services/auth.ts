import api from "../utils/api";

export const login = async (email: string, password: string) => {
  try {
    // Formata os dados como application/x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post("/auth/client/token", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Define o tipo correto
      },
    });
    
    return response.data; // Retorna os dados do backend (ex.: token, usuário)
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};