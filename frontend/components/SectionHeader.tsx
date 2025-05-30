import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../utils/theme";

type SectionHeaderProps = {
    title: string;
    actionText?: string;
    onActionPress?: () => void;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
    title, 
    actionText, 
    onActionPress 
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {actionText && onActionPress && (
                <TouchableOpacity onPress={onActionPress}>
                    <Text style={styles.actionText}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: theme.spacing.medium,
        marginTop: theme.spacing.large,
    },
    title: {
        fontSize: theme.fontSizes.large,
        fontWeight: "bold",
        color: theme.colors.dark,
    },
    actionText: {
        fontSize: theme.fontSizes.medium,
        color: theme.colors.primary,
        fontWeight: "600",
    },
});