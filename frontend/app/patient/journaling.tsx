import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import {
  getJournalingById,
  createJournaling,
  patchJournaling,
  deleteJournaling,
} from "../../services/journaling";
import { getToken } from "../../utils/secureStore";
import { theme } from "../../utils/theme";
import { FormField } from "../../components/FormField";
import { DatePickerField } from "../../components/DatePickerField";

export default function CreateJournaling() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    resume: "",
    date: "",
    situation: "",
    emotions: "",
    thoughts: "",
    bodyFeelings: "",
    behavior: "",
    consequences: "",
    evidenceFavorable: "",
    evidenceUnfavorable: "",
    alternativeThoughts: "",
    alternativeBehaviors: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getToken("userToken");
      if (token) {
        setIsLoggedIn(true);
      } else {
        router.push("/login");
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const fetchJournaling = async () => {
      if (id) {
        setIsEditing(true);
        try {
          const journaling = await getJournalingById(id as string);
          setFormData({
            title: journaling.title || "",
            resume: journaling.resume || "",
            date: journaling.date || format(new Date(), "YYYY-MM-DD"),
            situation: journaling.situation || "",
            emotions: journaling.emotions || "",
            thoughts: journaling.thoughts || "",
            bodyFeelings: journaling.body_feelings || "",
            behavior: journaling.behavior || "",
            consequences: journaling.consequences || "",
            evidenceFavorable: journaling.evidence_favorable || "",
            evidenceUnfavorable: journaling.evidence_unfavorable || "",
            alternativeThoughts: journaling.alternative_thoughts || "",
            alternativeBehaviors: journaling.alternative_behaviors || "",
          });
        } catch (error) {
          console.error("Erro ao carregar a RPD:", error);
        }
      }
    };

    if (isLoggedIn) {
      fetchJournaling();
    }
  }, [id, isLoggedIn]);

  const handleSave = async () => {
    try {
      const journalingData = {
        ...formData,
      };

      if (isEditing) {
        await patchJournaling(id as string, journalingData);
      } else {
        await createJournaling(journalingData);
      }
      router.push("/patient/dashboard");
    } catch (error) {
      console.error("Erro ao salvar a RDP:", error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Define the keys of formData as a union type
  type FormDataKeys = keyof typeof formData;

  // Update your fields array to use this type
  const fields: { label: string; field: FormDataKeys }[] = [
    { label: "Título", field: "title" },
    { label: "Resumo", field: "resume" },
    { label: "Situação", field: "situation" },
    { label: "Emoções", field: "emotions" },
    { label: "Pensamentos", field: "thoughts" },
    { label: "Sensações Corporais", field: "bodyFeelings" },
    { label: "Comportamento", field: "behavior" },
    { label: "Consequências", field: "consequences" },
    { label: "Evidências Favoráveis", field: "evidenceFavorable" },
    { label: "Evidências Desfavoráveis", field: "evidenceUnfavorable" },
    { label: "Pensamentos Alternativos", field: "alternativeThoughts" },
    { label: "Comportamentos Alternativos", field: "alternativeBehaviors" },
  ];

  if (!isLoggedIn) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isEditing ? "Editar RPD" : "Criar RPD"}</Text>

      <DatePickerField
        label="Data"
        value={formData.date}
        onChange={(value) => handleChange("date", value)}
      />

      {fields.map(({ label, field }) => (
        field !== "date" && (
          <FormField
            key={field}
            label={label}
            value={formData[field]}
            onChangeText={(value) => handleChange(field, value)}
          />
        )
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {isEditing ? "Atualizar" : "Salvar"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.medium },
  title: {
    fontSize: theme.fontSizes.xlarge,
    fontWeight: "bold",
    marginBottom: theme.spacing.medium,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: theme.spacing.small,
    alignItems: "center",
    marginBottom: theme.spacing.small,
  },
  saveButtonText: { color: theme.colors.white, fontWeight: "bold" },
});
