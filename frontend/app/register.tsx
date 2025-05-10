import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { createUser, getCurrentUser, patchCurrentUser } from "@/services/users";
import { RoleChoices } from "@/models/roleChoices";
import { Button } from "@/components/Button";
import { theme } from "@/utils/theme";
import { getToken } from "@/utils/secureStore";

export default function Register() {
  const { isEditMode } = useLocalSearchParams();
  const editMode = isEditMode === "true";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(RoleChoices.Patient);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  useEffect(() => {
    if (editMode) {
      (async () => {
        try {
          const user = await getCurrentUser();
          setName(user.name);
          setEmail(user.email);
          setRole(user.role);
        } catch (err) {
          setError("Erro ao carregar dados do usuário.");
        }
      })();
    }
  }, [editMode]);

  const handleSubmit = async () => {
    if (!editMode && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      if (editMode) {
        await patchCurrentUser(name, email, password || null, role);
        handleBack();
      } else {
        await createUser(name, email, password, role);
        router.push("/login");
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 409) {
          setError("E-mail já cadastrado. Tente usar outro e-mail.");
        } else {
          setError("Erro ao processar solicitação. Tente novamente mais tarde.");
        }
      } else {
        setError("Erro de conexão. Verifique sua internet.");
      }
    }
  };

  const handleBack = () => {
    if (role === RoleChoices.Therapist) {
      router.push("/therapist/dashboard");
    } else {
      router.push("/patient/dashboard");
    }
  };

  return (
    <View style={styles.container}>


      <Text style={styles.title}>{editMode ? "Editar Perfil" : "Criar Conta"}</Text>
      <Text style={styles.subtitle}>{editMode ? "Atualize seus dados" : "Preencha os campos para se cadastrar"}</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Perfil:</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={[styles.radio, role === RoleChoices.Patient && styles.selectedRadio]}
            onPress={() => setRole(RoleChoices.Patient)}
          >
            <Text style={styles.radioText}>Paciente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radio, role === RoleChoices.Therapist && styles.selectedRadio]}
            onPress={() => setRole(RoleChoices.Therapist)}
          >
            <Text style={styles.radioText}>Psicólogo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!editMode && (
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
      )}

      {!editMode && (
        <TextInput
          style={styles.input}
          placeholder="Confirme a senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
        />
      )}

      <Button title={editMode ? "Salvar" : "Criar Conta"} onPress={handleSubmit} />

      {!editMode && (
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginLinkText}>Já tenho uma conta</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.light,
    padding: theme.spacing.medium,
  },
  title: {
    fontSize: theme.fontSizes.xlarge,
    fontWeight: "bold",
    marginBottom: theme.spacing.small,
  },
  subtitle: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.dark,
    marginBottom: theme.spacing.large,
  },
  input: {
    width: "100%",
    padding: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.dark,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.medium,
    backgroundColor: theme.colors.white,
  },
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing.medium,
    textAlign: "center",
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.medium,
    width: "100%",
  },
  roleLabel: {
    marginRight: theme.spacing.medium,
    fontSize: theme.fontSizes.medium,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    marginRight: theme.spacing.small,
    padding: theme.spacing.small,
    borderWidth: 1,
    borderColor: theme.colors.dark,
    borderRadius: theme.borderRadius.small,
  },
  selectedRadio: {
    backgroundColor: theme.colors.primary,
  },
  radioText: {
    color: theme.colors.black,
  },
  loginLinkText: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.small,
    paddingTop: theme.spacing.medium,
    fontWeight: "bold",
  },
});
