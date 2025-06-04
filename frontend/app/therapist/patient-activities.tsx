import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getJournalingByPatientId } from "@/services/journaling";
import { theme } from "@/utils/theme";
import { ActivityCard } from "@/components/ActivityCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { Journaling } from "@/models/journaling";

export default function PatientActivities() {
    const router = useRouter();
    const { patientId } = useLocalSearchParams();
    const [analysis, setAnalysis] = useState<Journaling[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [patientName, setPatientName] = useState("");

    useEffect(() => {
        if (patientId) {
            loadPatientAnalysis();
        }
    }, [patientId]);

    const loadPatientAnalysis = async () => {
        setIsLoading(true);
        try {
            const result = await getJournalingByPatientId(patientId.toString());
            // Filtrar atividades do paciente específico
            // const patientAnalysis = result.data?.filter(
            //     (item: Journaling) => item.patient === parseInt(patientId as string)
            // ) || [];
            // console.log(result)
            // console.log("Filtered patient analysis:", patientAnalysis)
            setAnalysis(result);
            console.log("Patient analysis loaded:", result);
        } catch (error: any) {
            console.error("Erro ao carregar análises do paciente:", error);
            if (error.response?.status === 401) {
                router.push("/login");
            }
            console.log("An error occurred while loading patient analysis:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = (id: string) => {
        router.push(`/therapist/details?id=${id}` as any);
    };

    const handleBack = () => {
        router.back();
    };

    const renderActivityCard = ({ item }: { item: Journaling }) => (
        <ActivityCard
            activity={item}
            onViewDetails={() => handleViewDetails(item.id!.toString())}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Text style={styles.backButton}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Atividades do Paciente</Text>
                <View style={styles.placeholder} />
            </View>

            {isLoading ? (
                <LoadingSpinner message="Carregando atividades..." />
            ) : analysis.length === 0 ? (
                <EmptyState
                    title="Nenhuma atividade encontrada"
                    message="Este paciente ainda não registrou nenhuma atividade."
                />
            ) : (
                <FlatList
                    data={analysis}
                    keyExtractor={(item) => item.id!.toString()}
                    renderItem={renderActivityCard}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing.large,
        paddingTop: theme.spacing.xxl,
        backgroundColor: theme.colors.white,
        ...theme.shadows.small,
    },
    backButton: {
        fontSize: theme.fontSizes.medium,
        color: theme.colors.primary,
        fontWeight: "600",
    },
    title: {
        fontSize: theme.fontSizes.large,
        fontWeight: "bold",
        color: theme.colors.dark,
    },
    placeholder: {
        width: 60, // Para balancear o layout
    },
    list: {
        padding: theme.spacing.large,
    },
});