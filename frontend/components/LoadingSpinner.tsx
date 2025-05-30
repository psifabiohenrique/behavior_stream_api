import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { theme } from "../utils/theme";

type LoadingSpinnerProps = {
    message?: string;
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Carregando..." }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing.xl,
    },
    message: {
        marginTop: theme.spacing.medium,
        fontSize: theme.fontSizes.medium,
        color: theme.colors.textSecondary,
        textAlign: "center",
    },
});