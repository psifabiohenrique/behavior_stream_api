import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../utils/theme";

type CardProps = {
    children: React.ReactNode;
    style?: ViewStyle;
};

export const Card: React.FC<CardProps> = ({ children, style }) => {
    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.medium,
        padding: theme.spacing.medium,
        marginBottom: theme.spacing.medium,
        ...theme.shadows.small,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
});