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
        options={{ title: "Cadastro", headerShown: true }} 
      />
      <Stack.Screen 
        name="index" 
        options={{ title: "Home", headerShown: false }} 
      />
      <Stack.Screen 
        name="therapist/dashboard"
        options={{ title: "Dashboard", headerShown: false }} 
      />
      <Stack.Screen 
        name="therapist/all-activities"
        options={{ title: "Todas as Atividades", headerShown: false }} 
      />
      <Stack.Screen 
        name="therapist/patient-activities"
        options={{ title: "Atividades do Paciente", headerShown: false }} 
      />
      <Stack.Screen
        name="therapist/allow-activities"
        options={{ title: "Permitir Atividades", headerShown: false }}
      />
      <Stack.Screen 
        name="patient/dashboard"
        options={{ title: "Dashboard", headerShown: false }} 
      />
      <Stack.Screen 
        name="patient/journaling"
        options={{ title: "RPD", headerShown: true }} 
      />
    </Stack>
  );
}
