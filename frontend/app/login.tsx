import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { login } from "../services/auth";
import { saveToken } from "../utils/secureStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const data = await login(email, password); // Chama o backend e retorna o token
      if (data.access_token) {
        await saveToken("userToken", data.access_token); // Salva o token no SecureStore
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Criar nova conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 16, borderRadius: 8 },
  button: { backgroundColor: "#6200ee", padding: 16, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  registerButton: { marginTop: 16, alignItems: "center" },
  registerButtonText: { color: "#6200ee", fontWeight: "bold" },
  error: { color: "red", marginBottom: 16 },
});
