import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { getToken, deleteToken } from "../../utils/secureStore";
import { getJournaling } from "@/services/journaling";
import { getPatients, deleteRelationship, getRelationships, Relationship } from "@/services/relationships";
import { theme } from "@/utils/theme";
import { SectionHeader } from "@/components/SectionHeader";
import { PatientCard } from "@/components/PatientCard";
import { ActivityCard } from "@/components/ActivityCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { SearchPatientModal } from "@/components/SearchPatientModal";
import { StatsCard } from "@/components/StatsCard";
import { User } from "@/models/user";
import { Journaling } from "@/models/journaling";

// type Analysis = {
//     title: string;
//     id: number;
//     date: string;
//     antecedent: string;
//     behavior: string;
//     consequence: string;
// };

export default function TherapistDashboard() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [analysis, setAnalysis] = useState<Journaling[]>([]);
    const [patients, setPatients] = useState<User[]>([]);
    const [relationships, setRelationships] = useState<Relationship[]>([]);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);
    const [isLoadingPatients, setIsLoadingPatients] = useState(true);
    const [showAddPatientModal, setShowAddPatientModal] = useState(false);

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
        if (isLoggedIn) {
            loadAnalysis();
            loadPatients();
        }
    }, [isLoggedIn]);

    const loadAnalysis = async () => {
        setIsLoadingAnalysis(true);
        try {
            const result = await getJournaling();
            setAnalysis(result.data || []);
        } catch (error: any) {
            console.error("Erro ao carregar análises:", error);
            if (error.response?.status === 401) {
                router.push("/login");
            }
        } finally {
            setIsLoadingAnalysis(false);
        }
    };

    const loadPatients = async () => {
        setIsLoadingPatients(true);
        try {
            const [patientsData, relationshipsData] = await Promise.all([
                getPatients(),
                getRelationships()
            ]);
            setPatients(patientsData);
            setRelationships(relationshipsData);
        } catch (error: any) {
            console.error("Erro ao carregar pacientes:", error);
            if (error.response?.status === 401) {
                router.push("/login");
            }
        } finally {
            setIsLoadingPatients(false);
        }
    };

    const handleLogout = async () => {
        await deleteToken("userToken");
        setIsLoggedIn(false);
        router.push("/login");
    };

    const handleViewDetails = (id: string) => {
        router.push(`/therapist/details?id=${id}` as any);
    };

    const handleViewPatientActivities = (patientId: number) => {
        // Navegar para uma tela específica de atividades do paciente
        router.push(`/therapist/patient-activities?patientId=${patientId}` as any);
    };

    const handleAllowActivities = (patientId: number) => {
        router.push(`/therapist/allow-activities?patientId=${patientId}` as any);
    };

    const handleRemovePatient = (patientId: number, patientName: string) => {
        // Encontrar o relacionamento correspondente
        const relationship = relationships.find(r => r.patient === patientId);
        if (!relationship) {
            Alert.alert("Erro", "Relacionamento não encontrado.");
            return;
        }

        Alert.alert(
            "Remover Paciente",
            `Tem certeza que deseja remover ${patientName} da sua lista de pacientes?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Remover", 
                    style: "destructive",
                    onPress: () => removePatient(relationship.id)
                }
            ]
        );
    };

    const removePatient = async (relationshipId: number) => {
        try {
            await deleteRelationship(relationshipId);
            await loadPatients(); // Recarregar lista
            Alert.alert("Sucesso", "Paciente removido com sucesso!");
        } catch (error) {
            console.error("Erro ao remover paciente:", error);
            Alert.alert("Erro", "Não foi possível remover o paciente. Tente novamente.");
        }
    };

    const handlePatientAdded = () => {
        loadPatients(); // Recarregar lista de pacientes
    };

    const renderPatientCard = ({ item }: { item: User }) => (
        <PatientCard
            patient={item}
            onViewActivities={() => handleViewPatientActivities(item.id!)}
            onAllowActivities={() => handleAllowActivities(item.id!)}
            onRemove={() => handleRemovePatient(item.id!, item.name!)}
        />
    );

    const renderActivityCard = ({ item }: { item: Journaling }) => (
        <ActivityCard
            activity={item}
            onViewDetails={() => handleViewDetails(item.id!.toString())}
        />
    );

    // Calcular estatísticas
    const totalPatients = patients.length;
    const activePatients = patients.filter(p => p.is_active!).length;
    const totalActivities = analysis.length;
    const recentActivities = analysis.filter(a => {
        const activityDate = a.date ? new Date(a.date) : "Sem data";
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return activityDate >= weekAgo;
    }).length;

    if (!isLoggedIn) {
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dashboard do Terapeuta</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Sair</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Seção de Estatísticas */}
                <SectionHeader title="Resumo" />
                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <StatsCard
                            title="Total de Pacientes"
                            value={totalPatients}
                            color={theme.colors.primary}
                        />
                        <StatsCard
                            title="Pacientes Ativos"
                            value={activePatients}
                            color={theme.colors.success}
                        />
                    </View>
                    <View style={styles.statsRow}>
                        <StatsCard
                            title="Total de Atividades"
                            value={totalActivities}
                            color={theme.colors.info}
                        />
                        <StatsCard
                            title="Esta Semana"
                            value={recentActivities}
                            color={theme.colors.warning}
                        />
                    </View>
                </View>

                {/* Seção de Pacientes */}
                <SectionHeader
                    title="Meus Pacientes"
                    actionText="Buscar Paciente"
                    onActionPress={() => setShowAddPatientModal(true)}
                />

                {isLoadingPatients ? (
                    <LoadingSpinner message="Carregando pacientes..." />
                ) : patients.length === 0 ? (
                    <EmptyState
                        title="Nenhum paciente cadastrado"
                        message="Busque pacientes existentes para começar a acompanhar suas atividades e progresso."
                        actionText="Buscar Primeiro Paciente"
                        onActionPress={() => setShowAddPatientModal(true)}
                    />
                ) : (
                    <FlatList
                        data={patients}
                        keyExtractor={(item) => item.id!.toString()}
                        renderItem={renderPatientCard}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                {/* Seção de Atividades Recentes */}
                <SectionHeader
                    title="Atividades Recentes"
                    actionText={analysis.length > 0 ? "Ver Todas" : undefined}
                    onActionPress={analysis.length > 0 ? () => router.push("/therapist/all-activities" as any) : undefined}
                />

                {isLoadingAnalysis ? (
                    <LoadingSpinner message="Carregando atividades..." />
                ) : analysis.length === 0 ? (
                    <EmptyState
                        title="Nenhuma atividade encontrada"
                        message="Quando seus pacientes começarem a registrar atividades, elas aparecerão aqui."
                    />
                ) : (
                    <FlatList
                        data={analysis.slice(0, 5)} // Mostrar apenas as 5 mais recentes
                        keyExtractor={(item) => item.id!.toString()}
                        renderItem={renderActivityCard}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </ScrollView>

            {/* Modal para buscar e adicionar paciente */}
            <SearchPatientModal
                visible={showAddPatientModal}
                onClose={() => setShowAddPatientModal(false)}
                onPatientAdded={handlePatientAdded}
            />
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
    headerTitle: {
        fontSize: theme.fontSizes.xlarge,
        fontWeight: "bold",
        color: theme.colors.dark,
    },
    logoutButton: {
        backgroundColor: theme.colors.danger,
        paddingVertical: theme.spacing.small,
        paddingHorizontal: theme.spacing.medium,
        borderRadius: theme.borderRadius.small,
    },
    logoutButtonText: {
        color: theme.colors.white,
        fontSize: theme.fontSizes.medium,
        fontWeight: "600",
    },
    content: {
        flex: 1,
        padding: theme.spacing.large,
    },
    statsContainer: {
        marginBottom: theme.spacing.large,
    },
    statsRow: {
        flexDirection: "row",
        gap: theme.spacing.medium,
        marginBottom: theme.spacing.medium,
    },
});