import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { getToken } from '@/utils/secureStore';
import {
    getCurrentUser,
    getPsychologist,
    patchCurrentUser
} from '@/services/users';


export default function ClientDetails() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [psychologist, setPsychologist] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const client = await getCurrentUser();
                setName(client.name)
                setEmail(client.email)
                if (client.psychologist) {
                    setPsychologist(client.psychologist)
                } else {
                    setPsychologist("Nenhum psicólogo cadastrado")
                }
            }
            catch (error) {
                console.error("Erro ao buscar cliente: ", error);
                setFeedbackMessage("Erro ao carregar os dados do cliente!")
                setFeedbackType("error")
            } finally {
                setIsLoading(false);
            }
        }
        fetchClient();
    }, [])

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await getToken("userToken");
            if (token) {
                setIsLoggedIn(true);
            } else {
                router.push("/login"); // Redireciona para a tela de login se não estiver logado
            }
        };

        checkLoginStatus();
    }, []);


    const handleSave = async () => {
        try {
            let psychologist_id = null
            if (psychologist !== "") {
                const psychologist_data = await getPsychologist({ id: null, email: psychologist })
                psychologist_id = psychologist_data.id
            }
            const client_edited = await patchCurrentUser(
                name !== "" ? name : null,
                email !== "" ? email : null,
                password !== "" ? password : null,
                psychologist_id
            )
            setName(client_edited.name)
            setEmail(client_edited.email)
            setPassword("")
            setPsychologist(client_edited.psychologist)

            setFeedbackMessage("As informações foram atualizadas com sucesso");
            setFeedbackType("success")

        } catch (error: any) {
            console.log("Erro ao atualizar client: ", error)

            const errorMessage = error.response?.data?.detail || "Erro ao atualizar as informações"
            setFeedbackMessage(errorMessage);
            setFeedbackType("error")
        }
    }

    const handleCancel = () => {
        router.push("/")
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Carregando Informações...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}> Editar conta</Text>

            {
                feedbackMessage !== "" && (
                    <Text
                        style={[
                            styles.feedbackMessage,
                            feedbackType === "success" ? styles.success : styles.error
                        ]}>
                        {feedbackMessage}
                    </Text>
                )
            }

            <TextInput
                style={styles.input}
                placeholder='Nome'
                value={name || ""}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder='E-mail'
                value={email || ""}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                placeholder='Senha'
                value={password || ""}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder='E-mail do psicólogo(a)'
                value={psychologist || ""}
                onChangeText={setPsychologist}
                keyboardType='email-address'
                autoCapitalize='none'
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: "#fff"
    },
    saveButton: {
        backgroundColor: "#6200ee",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 8
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    cancelButton: {
        backgroundColor: "#ccc",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#000",
    },
    loadingText: {
        textAlign: "center",
        color: "#666",
        fontSize: 16,
        marginTop: 32
    },
    feedbackMessage: {
        textAlign: "center",
        fontSize: 16,
        marginBottom: 16,
        padding: 8,
        borderRadius: 8,
    },
    success: {
        color: "#fff",
        backgroundColor: "#4CAF50"
    },
    error: {
        color: "#fff",
        backgroundColor: "#f44336"
    }
})