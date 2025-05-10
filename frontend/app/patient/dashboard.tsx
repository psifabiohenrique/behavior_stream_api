import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { getToken, deleteToken } from "../../utils/secureStore";
import { getJournaling } from "@/services/journaling";
import { theme } from "@/utils/theme";
import { format } from "date-fns";
import { Journaling } from "@/models/journaling";

export default function Dashboard() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [journalings, setJournalings] = useState<Journaling[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getToken("userToken");
      if (token) {
        setIsLoggedIn(true);
      } else {
        router.push("/login");
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const loadJournalings = async () => {
      setIsLoading(true);
      try {
        const data = await getJournaling();
        setJournalings(data);
      } catch (error) {
        console.error("Erro ao carregar os journalings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJournalings();
  }, []);

  const handleLogout = async () => {
    await deleteToken("userToken");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handleEditClient = () => {
    router.push("/register?isEditMode=true");
  };

  const handleViewDetails = (id: number) => {
    router.push(`/patient/journaling?id=${id}`);
  };

  const handleAddJournaling = () => {
    router.push("/patient/journaling");
  };

  const renderJournalingCard = ({ item }: { item: Journaling }) => {
    const formattedDate = item.date ? format(new Date(item.date), "dd/MM/yyyy") : "Sem data";

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title || "Sem título"}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.resume}>{item.resume || "Sem resumo"}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleViewDetails(item.id!)}
        >
          <Text style={styles.buttonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!isLoggedIn) {
    return null;
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
        <Text style={styles.loadingText}>Carregando journalings...</Text>
      ) : journalings.length === 0 ? (
        <Text style={styles.noDataText}>Nenhum journaling encontrado.</Text>
      ) : (
        <FlatList
          data={journalings}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={renderJournalingCard}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAddJournaling}
      >
        <Text style={styles.floatingButtonText}>+ Adicionar Journaling</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.light,
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.medium,
  },
  card: {
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
    marginBottom: theme.spacing.small,
  },
  date: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.dark,
    marginBottom: theme.spacing.small,
  },
  resume: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.dark,
    marginBottom: theme.spacing.medium,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.small,
    borderRadius: theme.borderRadius.small,
    alignItems: "center",
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    bottom: theme.spacing.medium,
    right: theme.spacing.medium,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    color: theme.colors.warning,
    fontSize: theme.fontSizes.medium,
    marginTop: theme.spacing.large,
  },
  noDataText: {
    textAlign: "center",
    color: theme.colors.danger,
    fontSize: theme.fontSizes.medium,
    marginTop: theme.spacing.large,
  },
  list: {
    paddingBottom: theme.spacing.medium,
  },
  logoutButton: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.danger,
    padding: theme.spacing.small,
    borderRadius: 4,
    marginBottom: theme.spacing.medium,
  },
  logoutButtonText: { color: theme.colors.white, fontWeight: "bold" },
  editButton: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.small,
    borderRadius: 4,
    marginBottom: theme.spacing.medium,
  },
  editButtonText: {
    color: theme.colors.white,
    fontWeight: "bold"
  },
});
