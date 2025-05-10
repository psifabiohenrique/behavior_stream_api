import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { theme } from "../utils/theme";

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
};

export const FormField: React.FC<FormFieldProps> = ({ label, value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.medium,
  },
  label: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.dark,
    marginBottom: theme.spacing.small,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.light,
    padding: theme.spacing.medium,
    borderRadius: theme.spacing.small,
    backgroundColor: theme.colors.white,
  },
});