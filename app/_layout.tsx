import { Stack } from 'expo-router'
import { useNotifications } from './hooks/useNotifications'

export default function RootLayout() {
  const expoPushToken = useNotifications()
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Ocultar encabezado por defecto
      }}
    ></Stack>
  )
}
