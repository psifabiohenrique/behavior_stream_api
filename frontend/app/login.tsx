import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthService } from "../services/auth";
import { saveToken } from "../utils/secureStore";
import { Button } from "../components/Button";
import { theme } from "../utils/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const data = await AuthService.login(email, password); // Chama o backend e retorna o token
      if (data.access) {
        await saveToken("userToken", data.access); // Salva o token no SecureStore
        router.push("/"); // Redireciona para a tela principal
      } else {
        setError("Erro ao obter o token. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  const handleRegister = () => {
    router.push("/register"); // Redireciona para a tela de registro
    console.log("Fui para registro0")
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Criar nova conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: theme.spacing.medium },
  title: { fontSize: theme.fontSizes.xlarge, fontWeight: "bold", marginBottom: theme.spacing.medium },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.light,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    borderRadius: theme.spacing.small,
    backgroundColor: theme.colors.white,
  },
  registerButton: { marginTop: theme.spacing.medium, alignItems: "center" },
  registerButtonText: { color: theme.colors.primary, fontWeight: "bold" },
  error: { color: theme.colors.danger, marginBottom: theme.spacing.medium },
});
