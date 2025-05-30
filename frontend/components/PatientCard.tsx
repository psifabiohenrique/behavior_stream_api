import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../utils/theme";
import { Card } from "./Card";
import { User } from "../models/user";

type PatientCardProps = {
    patient: User;
    onViewActivities?: () => void;
    onAllowActivities?: () => void;
    onRemove?: () => void;
};

export const PatientCard: React.FC<PatientCardProps> = ({ 
    patient, 
    onViewActivities, 
    onAllowActivities,
    onRemove 
}) => {
    return (
        <Card>
            <View style={styles.header}>
                <View style={styles.patientInfo}>
                    <Text style={styles.name}>{patient.name}</Text>
                    <Text style={styles.email}>{patient.email}</Text>
                    <View style={styles.statusContainer}>
                        <View style={[
                            styles.statusIndicator, 
                            { backgroundColor: patient.is_active ? theme.colors.success : theme.colors.danger }
                        ]} />
                        <Text style={styles.statusText}>
                            {patient.is_active ? "Ativo" : "Inativo"}
                        </Text>
                    </View>
                </View>
            </View>
            
            <View style={styles.actions}>
                {onViewActivities && (
                    <TouchableOpacity 
                        style={[styles.button, styles.primaryButton]} 
                        onPress={onViewActivities}
                    >
                        <Text style={styles.primaryButtonText}>Ver Atividades</Text>
                    </TouchableOpacity>
                )}
                {onAllowActivities && (
                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={onAllowActivities}
                    >
                        <Text style={styles.primaryButtonText}>Gerenciar Atividades</Text>
                    </TouchableOpacity>
                )}
                {onRemove && (
                    <TouchableOpacity 
                        style={[styles.button, styles.dangerButton]} 
                        onPress={onRemove}
                    >
                        <Text style={styles.dangerButtonText}>Remover</Text>
                    </TouchableOpacity>
                )}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: theme.spacing.medium,
    },
    patientInfo: {
        flex: 1,
    },
    name: {
        fontSize: theme.fontSizes.large,
        fontWeight: "bold",
        color: theme.colors.dark,
        marginBottom: theme.spacing.xs,
    },
    email: {
        fontSize: theme.fontSizes.medium,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.small,
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
        color: theme.colors.textSecondary,
        fontWeight: "500",
    },
    actions: {
        flexDirection: "row",
        gap: theme.spacing.small,
    },
    button: {
        flex: 1,
        paddingVertical: theme.spacing.small,
        paddingHorizontal: theme.spacing.medium,
        borderRadius: theme.borderRadius.small,
        alignItems: "center",
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
    },
    secondaryButton: {
        backgroundColor: theme.colors.secondary,
    },
    primaryButtonText: {
        color: theme.colors.white,
        fontSize: theme.fontSizes.medium,
        fontWeight: "600",
    },
    dangerButton: {
        backgroundColor: theme.colors.danger,
    },
    dangerButtonText: {
        color: theme.colors.white,
        fontSize: theme.fontSizes.medium,
        fontWeight: "600",
    },
});