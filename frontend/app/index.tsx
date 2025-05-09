import React, { createContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getToken, getUserData } from "@/utils/secureStore";
import { User } from "@/models/user";

// Criação do contexto de autenticação
export const AuthContext = createContext({
  token: "",
  user: null,
});

export default function Main() {
  const router = useRouter();
  const [authState, setAuthState] = useState({
    token: "",
    user: new User(),
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await getToken("userToken");
        if (token) {
          const currentUser = await getUserData();
          console.log(currentUser);
          if (currentUser instanceof User) {
            setAuthState({ token, user: currentUser });

            // Redireciona com base na role do usuário
            if (currentUser.role === "patient") {
              router.push("/patient/dashboard");
            } else if (currentUser.role === "therapist") {
              router.push("/therapist/dashboard");
            } else {
              console.error("Role inválida.");
              router.push("/login");
            }
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Erro ao verificar o status de login:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <></>; // Pode ser substituído por um spinner ou tela de carregamento
  }

  return (
    <AuthContext.Provider value={authState}>
      {/* Renderiza o conteúdo da aplicação */}
    </AuthContext.Provider>
  );
}