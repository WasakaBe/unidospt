import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Ocultar encabezado por defecto
      }}
    ></Stack>
  )
}
