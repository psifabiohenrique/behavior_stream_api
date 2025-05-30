import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Switch,
    Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { theme } from "@/utils/theme";
import { Card } from "@/components/Card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { 
    getAllowedActivitiesByPatient, 
    toggleActivity, 
    AllowedActivity,
    getAvailableActivities,
    AvailableActivity
} from "@/services/allowedActivities";

export default function AllowActivities() {
    const router = useRouter();
    const { patientId } = useLocalSearchParams();
    const [allowedActivities, setAllowedActivities] = useState<AllowedActivity[]>([]);
    const [availableActivities, setAvailableActivities] = useState<AvailableActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [patientName, setPatientName] = useState("");

    useEffect(() => {
        if (patientId) {
            loadData();
        }
    }, [patientId]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [activitiesData, availableData] = await Promise.all([
                getAllowedActivitiesByPatient(parseInt(patientId as string)),
                getAvailableActivities()
            ]);
            
            setAllowedActivities(activitiesData);
            setAvailableActivities(availableData);
            
            // Definir nome do paciente se houver atividades
            if (activitiesData.length > 0) {
                setPatientName(activitiesData[0].patient_name);
            }
        } catch (error: any) {
            console.error("Erro ao carregar dados:", error);
            if (error.response?.status === 401) {
                router.push("/login");
            } else {
                Alert.alert("Erro", "Não foi possível carregar as atividades. Tente novamente.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleActivity = async (activityType: string, currentValue: boolean) => {
        setIsUpdating(activityType);
        try {
            const newValue = !currentValue;
            await toggleActivity(parseInt(patientId as string), activityType, newValue);
            
            // Atualizar estado local
            setAllowedActivities(prev => 
                prev.map(activity => 
                    activity.activity_type === activityType 
                        ? { ...activity, is_allowed: newValue }
                        : activity
                )
            );

            const activityLabel = availableActivities.find(a => a.value === activityType)?.label || activityType;
            Alert.alert(
                "Sucesso", 
                `${activityLabel} ${newValue ? 'permitida' : 'bloqueada'} para ${patientName}`
            );
        } catch (error: any) {
            console.error("Erro ao alterar atividade:", error);
            Alert.alert("Erro", "Não foi possível alterar a permissão da atividade. Tente novamente.");
        } finally {
            setIsUpdating(null);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const renderActivityItem = ({ item }: { item: AllowedActivity }) => {
        const isUpdatingThis = isUpdating === item.activity_type;
        
        return (
            <Card style={styles.activityCard}>
                <View style={styles.activityHeader}>
                    <View style={styles.activityInfo}>
                        <Text style={styles.activityTitle}>{item.activity_label}</Text>
                        <Text style={styles.activityDescription}>{item.activity_description}</Text>
                        <View style={styles.statusContainer}>
                            <View style={[
                                styles.statusIndicator,
                                { backgroundColor: item.is_allowed ? theme.colors.success : theme.colors.danger }
                            ]} />
                            <Text style={[
                                styles.statusText,
                                { color: item.is_allowed ? theme.colors.success : theme.colors.danger }
                            ]}>
                                {item.is_allowed ? "Permitida" : "Bloqueada"}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.switchContainer}>
                        <Switch
                            value={item.is_allowed}
                            onValueChange={() => handleToggleActivity(item.activity_type, item.is_allowed)}
                            disabled={isUpdatingThis}
                            trackColor={{ 
                                false: theme.colors.border, 
                                true: theme.colors.success 
                            }}
                            thumbColor={item.is_allowed ? theme.colors.white : theme.colors.textSecondary}
                        />
                        {isUpdatingThis && (
                            <Text style={styles.updatingText}>Atualizando...</Text>
                        )}
                    </View>
                </View>
            </Card>
        );
    };

    const renderEmptyActivities = () => (
        <EmptyState
            title="Nenhuma atividade configurada"
            message="Não há atividades configuradas para este paciente. As atividades serão criadas automaticamente quando necessário."
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Text style={styles.backButton}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Gerenciar Atividades</Text>
                <View style={styles.placeholder} />
            </View>

            {patientName ? (
                <View style={styles.patientInfo}>
                    <Text style={styles.patientLabel}>Paciente:</Text>
                    <Text style={styles.patientName}>{patientName}</Text>
                </View>
            ) : null}

            <View style={styles.content}>
                {isLoading ? (
                    <LoadingSpinner message="Carregando atividades..." />
                ) : allowedActivities.length === 0 ? (
                    renderEmptyActivities()
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>
                            Atividades Disponíveis ({allowedActivities.length})
                        </Text>
                        <Text style={styles.sectionDescription}>
                            Use os controles abaixo para permitir ou bloquear atividades para este paciente.
                        </Text>
                        <FlatList
                            data={allowedActivities}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderActivityItem}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.list}
                        />
                    </>
                )}
            </View>
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
        width: 60,
    },
    patientInfo: {
        backgroundColor: theme.colors.white,
        padding: theme.spacing.large,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    patientLabel: {
        fontSize: theme.fontSizes.small,
        color: theme.colors.textSecondary,
        fontWeight: "500",
        marginBottom: theme.spacing.xs,
    },
    patientName: {
        fontSize: theme.fontSizes.large,
        fontWeight: "bold",
        color: theme.colors.dark,
    },
    content: {
        flex: 1,
        padding: theme.spacing.large,
    },
    sectionTitle: {
        fontSize: theme.fontSizes.large,
        fontWeight: "bold",
        color: theme.colors.dark,
        marginBottom: theme.spacing.small,
    },
    sectionDescription: {
        fontSize: theme.fontSizes.medium,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.large,
        lineHeight: 20,
    },
    list: {
        paddingBottom: theme.spacing.large,
    },
    activityCard: {
        marginBottom: theme.spacing.medium,
    },
    activityHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    activityInfo: {
        flex: 1,
        marginRight: theme.spacing.medium,
    },
    activityTitle: {
        fontSize: theme.fontSizes.large,
        fontWeight: "bold",
        color: theme.colors.dark,
        marginBottom: theme.spacing.xs,
    },
    activityDescription: {
        fontSize: theme.fontSizes.medium,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.small,
        lineHeight: 18,
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: theme.spacing.small,
    },
    statusText: {
        fontSize: theme.fontSizes.small,
        fontWeight: "600",
    },
    switchContainer: {
        alignItems: "center",
    },
    updatingText: {
        fontSize: theme.fontSizes.small,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
        textAlign: "center",
    },
});