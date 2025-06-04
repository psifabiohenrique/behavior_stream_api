import api from "../utils/api";
import { RoleChoices } from "@/models/roleChoices";
import { User } from "@/models/user";
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

export const getUserById = async (userId: number): Promise<User> => {
  const response = await api.get(`/users/${userId}`, {
    headers: { "Content-Type": "application/json" }
  });
  return response.data;
}

export const patchCurrentUser = async (
  name: string | null = null,
  email: string | null = null,
  password: string | null = null,
  role: RoleChoices | null = null
) => {
  const currentUser = await getCurrentUser(); // Obtém o ID do usuário atual
  const data = { name, email, password, role };
  const response = await api.patch(`/users/${currentUser.id}/`, data); // Inclui o ID na URL
  return response.data;
};

export const searchUsersByEmail = async (email: string) => {
  const response = await api.get(`/users/search/?email=${encodeURIComponent(email)}`, {
    headers: {
      "Content-Type": "application/json",
    }
  });
  return response.data;
};

export const searchUsersByName = async (name: string) => {
  const response = await api.get(`/users/search/?name=${encodeURIComponent(name)}`, {
    headers: {
      "Content-Type": "application/json",
    }
  });
  return response.data;
};

export const searchUsers = async (query: string) => {
  const response = await api.get(`/users/search/?q=${encodeURIComponent(query)}`, {
    headers: {
      "Content-Type": "application/json",
    }
  });
  return response.data;
};
