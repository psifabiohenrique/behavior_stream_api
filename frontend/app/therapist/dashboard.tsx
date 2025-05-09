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
import { format } from "date-fns";

type Analysis = {
    title: string;
    id: number;
    date: string;
    antecedent: string;
    behavior: string;
    consequence: string;
};

export default function TherapistDashboard() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [analysis, setAnalysis] = useState<Analysis[]>([]);
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
        const fetchAnalysis = async (): Promise<Analysis[]> => {
            try {
                const result = await getJournaling();
                return result.data || [];
            } catch (error: any) {
                if (error.response?.status === 401) {
                    router.push("/login");
                }
                return [];
            }
        };

        const loadAnalysis = async () => {
            setIsLoading(true);
            const data = await fetchAnalysis();
            setAnalysis(data);
            setIsLoading(false);
        };

        loadAnalysis();
    }, []);

    const handleLogout = async () => {
        await deleteToken("userToken");
        setIsLoggedIn(false);
        router.push("/login");
    };

    const handleViewDetails = (id: string) => {
        router.push(`/therapist/details?id=${id}`);
    };

    const renderAnalysisCard = ({ item }: { item: Analysis }) => {
        const formattedDate = format(new Date(item.date), "dd/MM/yyyy");

        return (
            <View style={styles.card}>
                <Text style={styles.date}>{formattedDate}</Text>
                <Text style={styles.summary}>Título: {item.title}</Text>
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
        return null;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>

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
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
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
    logoutButton: {
        alignSelf: "flex-end",
        backgroundColor: "#ff4d4d",
        padding: 8,
        borderRadius: 4,
        marginBottom: 16,
    },
    logoutButtonText: { color: "#fff", fontWeight: "bold" },
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