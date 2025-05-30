import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../utils/theme";
import { Button } from "./Button";

type EmptyStateProps = {
    title: string;
    message: string;
    actionText?: string;
    onActionPress?: () => void;
};

export const EmptyState: React.FC<EmptyStateProps> = ({ 
    title, 
    message, 
    actionText, 
    onActionPress 
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            {actionText && onActionPress && (
                <Button 
                    title={actionText} 
                    onPress={onActionPress}
                    color={theme.colors.primary}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing.xl,
        marginVertical: theme.spacing.large,
    },
    title: {
        fontSize: theme.fontSizes.large,
        fontWeight: "bold",
        color: theme.colors.dark,
        marginBottom: theme.spacing.small,
        textAlign: "center",
    },
    message: {
        fontSize: theme.fontSizes.medium,
        color: theme.colors.textSecondary,
        textAlign: "center",
        marginBottom: theme.spacing.large,
        lineHeight: 22,
    },
});