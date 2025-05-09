import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { theme } from "../utils/theme";

type ButtonProps = {
    title: string;
    onPress: () => void;
    color?: string;
};

export const Button: React.FC<ButtonProps> = ({ title, onPress, color }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: color || theme.colors.primary }]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: theme.spacing.medium,
        borderRadius: theme.spacing.small,
        alignItems: "center",
    },
    buttonText: {
        color: theme.colors.white,
        fontSize: theme.fontSizes.medium,
        fontWeight: "bold",
    },
});