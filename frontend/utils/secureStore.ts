import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { User } from "@/models/user";

// Salva o token no SecureStore ou localStorage
export async function saveToken(key: string, value: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value); // Usa localStorage no navegador
  } else {
    await SecureStore.setItemAsync(key, value); // Usa SecureStore em dispositivos nativos
  }
}

// Busca o token do SecureStore ou localStorage
export async function getToken(key: string): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem(key); // Usa localStorage no navegador
    } else {
      return await SecureStore.getItemAsync(key); // Usa SecureStore em dispositivos nativos
    }
  } catch (error) {
    console.error("Erro ao obter o token:", error);
    return null;
  }
}

// Remove o token do SecureStore ou localStorage
export async function deleteToken(key: string) {
  if (Platform.OS === "web") {
    localStorage.removeItem(key); // Usa localStorage no navegador
  } else {
    await SecureStore.deleteItemAsync(key); // Usa SecureStore em dispositivos nativos
  }
}

export async function saveUserData(user: User) {
  const userData = JSON.stringify(user);
  if (Platform.OS === "web") {
    localStorage.setItem("currentUser", userData); // Usa localStorage no navegador
  } else {
    await SecureStore.setItemAsync("currentUser", userData); // Usa SecureStore em dispositivos nativos
  }
}

export async function getUserData(): Promise<User | null> {
  try {
    if (Platform.OS === "web") {
      const userData = localStorage.getItem("currentUser");
      console.log(`secureStore: userData -> ${userData}`);
      return userData ? new User(JSON.parse(userData)) : null; // Converte para instância de User
    } else {
      const userData = await SecureStore.getItemAsync("currentUser");
      return userData ? new User(JSON.parse(userData)) : null; // Converte para instância de User
    }
  } catch (error) {
    console.error("Erro ao obter os dados do usuário:", error);
    return null;
  }
}
