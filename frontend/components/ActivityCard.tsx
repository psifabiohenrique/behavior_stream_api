import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format } from "date-fns";
import { theme } from "../utils/theme";
import { Card } from "./Card";

type Analysis = {
    title: string;
    id: number;
    date: string;
    antecedent: string;
    behavior: string;
    consequence: string;
};

type ActivityCardProps = {
    activity: Analysis;
    onViewDetails: () => void;
};

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onViewDetails }) => {
    const formattedDate = format(new Date(activity.date), "dd/MM/yyyy");

    return (
        <Card>
            <View style={styles.header}>
                <Text style={styles.title}>{activity.title}</Text>
                <Text style={styles.date}>{formattedDate}</Text>
            </View>
            
            <View style={styles.content}>
                <Text style={styles.summary} numberOfLines={2}>
                    {activity.behavior || "Sem descrição disponível"}
                </Text>
            </View>
            
            <TouchableOpacity 
                style={styles.button} 
                onPress={onViewDetails}
            >
                <Text style={styles.buttonText}>Ver Detalhes</Text>
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: theme.spacing.small,
    },
    title: {
        fontSize: theme.fontSizes.large,
        fontWeight: "bold",
        color: theme.colors.dark,
        marginBottom: theme.spacing.xs,
    },
    date: {
        fontSize: theme.fontSizes.small,
        color: theme.colors.textSecondary,
        fontWeight: "500",
    },
    content: {
        marginBottom: theme.spacing.medium,
    },
    summary: {
        fontSize: theme.fontSizes.medium,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.small,
        paddingHorizontal: theme.spacing.medium,
        borderRadius: theme.borderRadius.small,
        alignItems: "center",
    },
    buttonText: {
        color: theme.colors.white,
        fontSize: theme.fontSizes.medium,
        fontWeight: "600",
    },
});