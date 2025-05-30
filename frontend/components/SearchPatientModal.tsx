import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Alert,
    FlatList,
} from "react-native";
import { theme } from "../utils/theme";
import { Button } from "./Button";
import { Card } from "./Card";
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";
import { searchUsers } from "../services/users";
import { createRelationship } from "../services/relationships";
import { RoleChoices } from "../models/roleChoices";
import { getUserData } from "@/utils/secureStore";
import { User } from "@/models/user";


type Patient = {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
};

type SearchPatientModalProps = {
    visible: boolean;
    onClose: () => void;
    onPatientAdded: () => void;
};

export const SearchPatientModal: React.FC<SearchPatientModalProps> = ({
    visible,
    onClose,
    onPatientAdded,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Patient[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isAddingPatient, setIsAddingPatient] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            Alert.alert("Erro", "Digite um email ou nome para buscar");
            return;
        }

        setIsSearching(true);
        setHasSearched(true);
        try {
            const results = await searchUsers(searchQuery);
            // Filtrar apenas pacientes
            const patients = results.filter((user: Patient) => user.role === RoleChoices.Patient);
            setSearchResults(patients);
        } catch (error: any) {
            console.error("Erro ao buscar pacientes:", error);
            Alert.alert("Erro", "Erro ao buscar pacientes. Tente novamente.");
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddPatient = async (patient: Patient) => {
        setIsAddingPatient(true);
        try {
            let user: User | null = await getUserData();
            await createRelationship(patient.id, Number(user?.id));
            Alert.alert("Sucesso", `${patient.name} foi adicionado à sua lista de pacientes!`);
            
            // Limpar busca
            setSearchQuery("");
            setSearchResults([]);
            setHasSearched(false);
            
            onPatientAdded();
            onClose();
        } catch (error: any) {
            console.error("Erro ao adicionar paciente:", error);
            
            let errorMessage = "Erro ao adicionar paciente. Tente novamente.";
            if (error.response?.status === 409) {
                errorMessage = "Este paciente já está na sua lista.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            Alert.alert("Erro", errorMessage);
        } finally {
            setIsAddingPatient(false);
        }
    };

    const handleClose = () => {
        setSearchQuery("");
        setSearchResults([]);
        setHasSearched(false);
        onClose();
    };

    const renderPatientItem = ({ item }: { item: Patient }) => (
        <Card style={styles.patientCard}>
            <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{item.name}</Text>
                <Text style={styles.patientEmail}>{item.email}</Text>
                <View style={styles.statusContainer}>
                    <View style={[
                        styles.statusIndicator, 
                        { backgroundColor: item.is_active ? theme.colors.success : theme.colors.danger }
                    ]} />
                    <Text style={styles.statusText}>
                        {item.is_active ? "Ativo" : "Inativo"}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddPatient(item)}
                disabled={isAddingPatient}
            >
                <Text style={styles.addButtonText}>
                    {isAddingPatient ? "Adicionando..." : "Adicionar"}
                </Text>
            </TouchableOpacity>
        </Card>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Buscar Paciente</Text>
                    <TouchableOpacity onPress={handleClose}>
                        <Text style={styles.closeButton}>✕</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchSection}>
                    <Text style={styles.label}>Email ou nome do paciente</Text>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Digite o email ou nome do paciente"
                            autoCapitalize="none"
                            onSubmitEditing={handleSearch}
                        />
                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={handleSearch}
                            disabled={isSearching}
                        >
                            <Text style={styles.searchButtonText}>
                                {isSearching ? "Buscando..." : "Buscar"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.note}>
                        Digite o email ou nome do paciente que deseja adicionar à sua lista.
                    </Text>
                </View>

                <View style={styles.resultsSection}>
                    {isSearching ? (
                        <LoadingSpinner message="Buscando pacientes..." />
                    ) : hasSearched && searchResults.length === 0 ? (
                        <EmptyState
                            title="Nenhum paciente encontrado"
                            message="Não foi encontrado nenhum paciente com este email ou nome. Verifique se os dados estão corretos e se o usuário possui perfil de paciente."
                        />
                    ) : searchResults.length > 0 ? (
                        <>
                            <Text style={styles.resultsTitle}>
                                {searchResults.length} paciente(s) encontrado(s):
                            </Text>
                            <FlatList
                                data={searchResults}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderPatientItem}
                                showsVerticalScrollIndicator={false}
                            />
                        </>
                    ) : (
                        <View style={styles.instructionsContainer}>
                            <Text style={styles.instructionsTitle}>Como adicionar um paciente:</Text>
                            <Text style={styles.instructionsText}>
                                1. Digite o email ou nome do paciente{"\n"}
                                2. Clique em "Buscar"{"\n"}
                                3. Selecione o paciente na lista{"\n"}
                                4. Clique em "Adicionar"
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.actions}>
                    <Button
                        title="Cancelar"
                        onPress={handleClose}
                        color={theme.colors.textSecondary}
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
    searchSection: {
        marginBottom: theme.spacing.xl,
    },
    label: {
        fontSize: theme.fontSizes.medium,
        fontWeight: "600",
        color: theme.colors.dark,
        marginBottom: theme.spacing.small,
    },
    searchContainer: {
        flexDirection: "row",
        gap: theme.spacing.small,
        marginBottom: theme.spacing.small,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.medium,
        padding: theme.spacing.medium,
        fontSize: theme.fontSizes.medium,
        backgroundColor: theme.colors.white,
    },
    searchButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.large,
        borderRadius: theme.borderRadius.medium,
        justifyContent: "center",
        alignItems: "center",
    },
    searchButtonText: {
        color: theme.colors.white,
        fontSize: theme.fontSizes.medium,
        fontWeight: "600",
    },
    note: {
        fontSize: theme.fontSizes.small,
        color: theme.colors.textSecondary,
        fontStyle: "italic",
    },
    resultsSection: {
        flex: 1,
    },
    resultsTitle: {
        fontSize: theme.fontSizes.medium,
        fontWeight: "600",
        color: theme.colors.dark,
        marginBottom: theme.spacing.medium,
    },
    patientCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    patientInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: theme.fontSizes.medium,
        fontWeight: "bold",
        color: theme.colors.dark,
        marginBottom: theme.spacing.xs,
    },
    patientEmail: {
        fontSize: theme.fontSizes.small,
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
    addButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.small,
        paddingHorizontal: theme.spacing.medium,
        borderRadius: theme.borderRadius.small,
    },
    addButtonText: {
        color: theme.colors.white,
        fontSize: theme.fontSizes.medium,
        fontWeight: "600",
    },
    instructionsContainer: {
        padding: theme.spacing.large,
        alignItems: "center",
    },
    instructionsTitle: {
        fontSize: theme.fontSizes.large,
        fontWeight: "bold",
        color: theme.colors.dark,
        marginBottom: theme.spacing.medium,
        textAlign: "center",
    },
    instructionsText: {
        fontSize: theme.fontSizes.medium,
        color: theme.colors.textSecondary,
        lineHeight: 24,
        textAlign: "left",
    },
    actions: {
        paddingTop: theme.spacing.large,
    },
});