import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../utils/theme";
import { Card } from "./Card";

type StatsCardProps = {
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
};

export const StatsCard: React.FC<StatsCardProps> = ({ 
    title, 
    value, 
    subtitle, 
    color = theme.colors.primary 
}) => {
    return (
        <Card style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={[styles.value, { color }]}>{value}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        minHeight: 100,
        justifyContent: "center",
    },
    title: {
        fontSize: theme.fontSizes.small,
        color: theme.colors.textSecondary,
        textAlign: "center",
        marginBottom: theme.spacing.xs,
        fontWeight: "500",
    },
    value: {
        fontSize: theme.fontSizes.xxlarge,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: theme.fontSizes.small,
        color: theme.colors.textSecondary,
        textAlign: "center",
        fontStyle: "italic",
    },
});