import api from "../utils/api";
import { RoleChoices } from "@/models/roleChoices";
import { saveUserData } from "@/utils/secureStore";

export const createUser = async (name: string, email: string, password: string, role: RoleChoices = RoleChoices.Patient) => {
  // Formata os dados como JSON
  const data = {
    "name": name,
    "email": email,
    "role": role,
    "password": password,
  };

  const response = await api.post("/users/", data, {
    headers: {
      "Content-Type": "application/json", // Define o tipo correto como JSON
    },
  });

  return response.data; // Retorna os dados do cliente criado
};


export const getCurrentUser = async () => {
  const response = await api.get("/users/me", {
    headers: {
      "Content-Type": "application/json",
    }
  });

  const user = { ...response.data };
  await saveUserData(user); // Salva os dados completos do usuário
  return user;
};

export const patchCurrentUser = async (
  name: string | null = null,
  email: string | null = null,
  password: string | null = null,
  role: RoleChoices | null = null
) => {
  const data = { name, email, password, role }
  const response = await api.patch("/users", data)
  return response.data
}
