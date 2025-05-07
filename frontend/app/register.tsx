import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { createClient } from "@/services/clients";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // Estado para exibir mensagens de erro
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const client = await createClient(name, email, password);
      // Redirecionar para a tela de login após cadastro bem-sucedido
      router.push("/login");
    } catch (err: any) {
      if (err.response) {
        // Verifica o código de status do erro
        if (err.response.status === 409) {
          setError("E-mail já cadastrado. Tente usar outro e-mail.");
        } else {
          setError("Erro ao criar conta. Tente novamente mais tarde.");
        }
      } else {
        setError("Erro de conexão. Verifique sua internet.");
      }
    }
  };

  const handleGoToLogin = () => {
    // Redirecionar para a tela de login
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Preencha os campos para se cadastrar</Text>

      {/* Exibe mensagem de erro, se houver */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Campo de Nome */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />

      {/* Campo de E-mail */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Campo de Senha */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.showPasswordButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.showPasswordText}>
            {showPassword ? "Ocultar" : "Mostrar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Campo de Confirmação de Senha */}
      <TextInput
        style={styles.input}
        placeholder="Confirme a senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
      />

      {/* Botão Criar Conta */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Criar Conta</Text>
      </TouchableOpacity>

      {/* Link Já Tenho uma Conta */}
      <TouchableOpacity onPress={handleGoToLogin}>
        <Text style={styles.loginLinkText}>Já tenho uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
  },
  showPasswordButton: {
    marginLeft: 8,
  },
  showPasswordText: {
    color: "#6200ee",
    fontWeight: "bold",
  },
  registerButton: {
    width: "100%",
    padding: 16,
    backgroundColor: "#6200ee",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLinkText: {
    color: "#6200ee",
    fontSize: 14,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
});
