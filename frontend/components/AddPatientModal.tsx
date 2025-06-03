// ARQUIVO OBSOLETO - SUBSTITUÍDO POR SearchPatientModal.tsx
// Este arquivo foi substituído pelo SearchPatientModal.tsx que implementa
// a funcionalidade de buscar pacientes existentes ao invés de criar novos usuários.

import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Alert,
} from "react-native";
import { theme } from "../utils/theme";
import { Button } from "./Button";
import { createUser } from "../services/users";
import { createRelationship } from "../services/relationships";
import { RoleChoices } from "../models/roleChoices";
import { getUserData } from "@/utils/secureStore";
import { router } from "expo-router";

type AddPatientModalProps = {
    visible: boolean;
    onClose: () => void;
    onPatientAdded: () => void;
};

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
    visible,
    onClose,
    onPatientAdded,
}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert("Erro", "Todos os campos são obrigatórios");
            return;
        }

        setIsLoading(true);
        try {
            // Criar o usuário paciente
            const newUser = await createUser(name, email, password, RoleChoices.Patient);
            
            // Criar o relacionamento
            const user = await getUserData()
            if (!user) {
                router.push("/login");
                throw new Error("Usuário não encontrado")
            };
            await createRelationship(newUser.id, user.id!);
            
            Alert.alert("Sucesso", "Paciente adicionado com sucesso!");
            
            // Limpar formulário
            setName("");
            setEmail("");
            setPassword("");
            
            onPatientAdded();
            onClose();
        } catch (error: any) {
            console.error("Erro ao adicionar paciente:", error);
            
            let errorMessage = "Erro ao adicionar paciente. Tente novamente.";
            if (error.response?.status === 409) {
                errorMessage = "E-mail já cadastrado. Use outro e-mail.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            Alert.alert("Erro", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setName("");
        setEmail("");
        setPassword("");
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Adicionar Novo Paciente</Text>
                    <TouchableOpacity onPress={handleClose}>
                        <Text style={styles.closeButton}>✕</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Nome completo</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Digite o nome do paciente"
                        autoCapitalize="words"
                    />

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Digite o e-mail do paciente"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Senha temporária</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Digite uma senha temporária"
                        secureTextEntry
                    />

                    <Text style={styles.note}>
                        O paciente poderá alterar a senha após o primeiro login.
                    </Text>
                </View>

                <View style={styles.actions}>
                    <Button
                        title="Cancelar"
                        onPress={handleClose}
                        color={theme.colors.textSecondary}
                    />
                    <Button
                        title={isLoading ? "Adicionando..." : "Adicionar Paciente"}
                        onPress={handleSubmit}
                        color={theme.colors.primary}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.large,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: theme.spacing.xl,
        paddingTop: theme.spacing.large,
    },
    title: {
        fontSize: theme.fontSizes.xlarge,
        fontWeight: "bold",
        color: theme.colors.dark,
    },
    closeButton: {
        fontSize: theme.fontSizes.xlarge,
        color: theme.colors.textSecondary,
        fontWeight: "bold",
    },
    form: {
        flex: 1,
    },
    label: {
        fontSize: theme.fontSizes.medium,
        fontWeight: "600",
        color: theme.colors.dark,
        marginBottom: theme.spacing.small,
        marginTop: theme.spacing.medium,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.medium,
        padding: theme.spacing.medium,
        fontSize: theme.fontSizes.medium,
        backgroundColor: theme.colors.white,
    },
    note: {
        fontSize: theme.fontSizes.small,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.small,
        fontStyle: "italic",
    },
    actions: {
        flexDirection: "row",
        gap: theme.spacing.medium,
        paddingTop: theme.spacing.large,
    },
});