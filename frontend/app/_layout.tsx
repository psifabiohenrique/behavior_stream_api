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
        options={{ title: "Clientes", headerShown: false }} 
      />
      <Stack.Screen 
        name="create" 
        options={{ title: "Criar Análise", headerShown: false }} 
      />
      <Stack.Screen 
      name="editClient" 
      options={{ title: "Editar dados pessoais", headerShown: false }} 
    />
    </Stack>
  );
}
