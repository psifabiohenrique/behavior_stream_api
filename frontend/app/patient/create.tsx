import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker"; // Importa o react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Importa o estilo do react-datepicker
import { useRouter, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import {
  getJournalingById,
  createJournaling,
  patchJournaling,
  deleteJournaling,
} from "../../services/journaling";
import { getToken } from "../../utils/secureStore";
import { Journaling } from "../../models/journaling";

export default function CreateAnalysis() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [antecedent, setAntecedent] = useState("");
  const [behavior, setBehavior] = useState("");
  const [consequence, setConsequence] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [journalings, setJournalings] = useState<Journaling[]>([]);

  const router = useRouter();
  const { id } = useLocalSearchParams(); // Obtém o ID da análise (se estiver editando)

  // Verifica se o usuário está logado
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

  // Carrega os dados da análise se estiver no modo de edição
  useEffect(() => {
    const fetchAnalysis = async () => {
      if (id) {
        setIsEditing(true); // Define que estamos editando
        try {
          const analysis = await getJournalingById(id as string);
          setTitle(analysis.title);
          setDate(new Date(analysis.date)); // Define a data como um objeto Date
          setAntecedent(analysis.antecedent);
          setBehavior(analysis.behavior);
          setConsequence(analysis.consequence);
        } catch (error) {
          console.error("Erro ao carregar a análise:", error);
        }
      }
    };

    if (isLoggedIn) {
      fetchAnalysis();
    }
  }, [id, isLoggedIn]);

  const handleSave = async () => {
    try {
      // Converte a data para o formato ISO 8601 (YYYY-MM-DD)
      const formattedDate = format(date, "yyyy-MM-dd");

      if (isEditing) {
        // Atualiza a análise existente
        await patchJournaling(id as string, {
          title,
          date: formattedDate,
          antecedent,
          behavior,
          consequence,
        });
      } else {
        // Cria uma nova análise
        await createJournaling(
          title,
          formattedDate,
          antecedent,
          behavior,
          consequence
        );
      }
      router.push("/"); // Redireciona para a tela principal após salvar
    } catch (error) {
      console.error("Erro ao salvar a análise:", error);
    }
  };

  const handleCancel = () => {
    router.push("/"); // Redireciona para a tela principal
  };

  const handleDelete = async () => {
    try {
      if (id) {
        await deleteJournaling(id as string);
        router.push("/");
      }
    } catch (error) {
      console.error("Erro ao deletear a análise: ", error);
    }
  }

  const confirmDelete = () => {
    if (window.confirm("Tem certeza de que deseja excluir esta análise?")) {
      handleDelete();
    }
  }

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false); // Fecha o seletor de data
    if (selectedDate) {
      setDate(selectedDate); // Atualiza a data selecionada
    }
  };

  if (!isLoggedIn) {
    return null; // Evita renderizar o conteúdo enquanto verifica o login
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? "Editar Análise Funcional" : "Criar Análise Funcional"}
      </Text>
      {Platform.OS === "web" ? (
        // Usa react-datepicker na web
        <DatePicker
          selected={date}
          onChange={(selectedDate) => setDate(selectedDate || new Date())}
          dateFormat="dd-MM-yyyy"
          className="react-datepicker" // Adicione estilos personalizados, se necessário
        />
      ) : (
        // Usa DateTimePicker no Android/iOS
        <>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={showDatePickerModal}
          >
            <Text style={styles.dateButtonText}>
              {format(date, "dd-MM-yyyy")} {/* Exibe a data formatada */}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
            />
          )}
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Antecedente"
        value={antecedent}
        onChangeText={setAntecedent}
      />
      <TextInput
        style={styles.input}
        placeholder="Comportamento"
        value={behavior}
        onChangeText={setBehavior}
      />
      <TextInput
        style={styles.input}
        placeholder="Consequência"
        value={consequence}
        onChangeText={setConsequence}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {isEditing ? "Atualizar" : "Salvar"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={confirmDelete}
        >
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  dateButtonText: { fontSize: 16, color: "#000" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#6200ee",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: { color: "#000" },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});
