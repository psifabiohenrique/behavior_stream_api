import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { getToken, deleteToken } from "../utils/secureStore";
import { getAnalyses } from "@/services/analyses";
import { format } from "date-fns";

type Analysis = {
  title: string;
  id: number;
  date: string;
  antecedent: string;
  behavior: string;
  consequence: string;
};

export default function Main() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento

  // Verifica se o usuário está logado
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getToken("userToken");
      if (token) {
        setIsLoggedIn(true);
      } else {
        router.push("/login"); // Redireciona para a tela de login se não estiver logado
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const fetchAnalysis = async (): Promise<Analysis[]> => {
      try {
        const result = await getAnalyses();
        return result.data || [];
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push("/login");
        }
        return [];
      }
    };

    const loadAnalysis = async () => {
      setIsLoading(true); // Inicia o carregamento
      const data = await fetchAnalysis();
      setAnalysis(data);
      setIsLoading(false); // Finaliza o carregamento
    };

    loadAnalysis();
  }, []);

  useEffect(() => {
  }, [analysis]);

  useEffect(() => {
  }, [isLoading]);

  const handleLogout = async () => {
    await deleteToken("userToken"); // Remove o token do SecureStore
    setIsLoggedIn(false);
    router.push("/login"); // Redireciona para a tela de login
  };

  const handleEditClient = () => {
    router.push("/editClient")
  }
  const handleViewDetails = (id: string) => {
    router.push(`/create?id=${id}`);
  };

  const handleAddAnalysis = () => {
    router.push("/create");
  };

  const renderAnalysisCard = ({ item }: { item: Analysis }) => {
    // Converte a string de data para um objeto Date e formata
    const formattedDate = format(new Date(item.date), "dd/MM/yyyy");

    return (
      <View style={styles.card}>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.summary}>Titulo: {item.title}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleViewDetails(item.id.toString())}
        >
          <Text style={styles.buttonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!isLoggedIn) {
    return null; // Evita renderizar o conteúdo enquanto verifica o login
  }

  return (
    <View style={styles.container}>

      <View style={styles.headerButtons}>
        
        <TouchableOpacity style={styles.editButton} onPress={handleEditClient}>
          <Text style={styles.editButtonText}>Editar Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>

      </View>

      {isLoading ? (
        <Text style={styles.loadingText}>Carregando análises...</Text>
      ) : analysis.length === 0 ? (
        <Text style={styles.noAnalysisText}>
          Não existem análises cadastradas ainda.
        </Text>
      ) : (
        <FlatList
          data={analysis}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAnalysisCard}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAddAnalysis}
      >
        <Text style={styles.floatingButtonText}>+ Adicionar Análise</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16
  },
  card: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 8,
  },
  date: { fontWeight: "bold", marginBottom: 8 },
  summary: { marginBottom: 8 },
  button: { backgroundColor: "#6200ee", padding: 8, borderRadius: 4 },
  buttonText: { color: "#fff" },
  floatingButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#6200ee",
    padding: 16,
    borderRadius: 50,
  },
  floatingButtonText: { color: "#fff", fontWeight: "bold" },
  logoutButton: {
    alignSelf: "flex-end",
    backgroundColor: "#ff4d4d",
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  logoutButtonText: { color: "#fff", fontWeight: "bold" },
  editButton: {
    alignSelf: "flex-end",
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 4,
    marginBottom: 16
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  list: { paddingBottom: 16 },
  noAnalysisText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginTop: 32,
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 32,
  },
});
