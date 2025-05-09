import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ title: "Login", headerShown: false }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ title: "Cadastro", headerShown: false }} 
      />
      <Stack.Screen 
        name="index" 
        options={{ title: "Home", headerShown: false }} 
      />
      <Stack.Screen 
        name="patient/create" 
        options={{ title: "Criar RPD", headerShown: false }} 
      />
      <Stack.Screen 
        name="therapist/dashboard"
        options={{ title: "Dashboard", headerShown: false }} 
      />
      <Stack.Screen 
        name="patient/dashboard"
        options={{ title: "Dashboard", headerShown: false }} 
      />
    </Stack>
  );
}
