import { useState, useEffect } from 'react'
import * as Notifications from 'expo-notifications'
import { registerForPushNotificationsAsync } from '../utils/notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null)

  useEffect(() => {
    async function fetchToken() {
      const userId = await AsyncStorage.getItem('userId') // Obtener userId del almacenamiento

      if (!userId) {
        console.log('⚠️ No hay usuario autenticado, no se registrará el token.')
        return
      }

      const token = await registerForPushNotificationsAsync()
      if (token) {
        setExpoPushToken(token)
        await saveTokenToBackend(userId, token) // Guardar el token con el userId
      }
    }

    fetchToken()

    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📩 Notificación recibida:', notification)
      }
    )

    return () => subscription.remove()
  }, [])

  return expoPushToken
}

// 👉 Función para guardar el token en el backend con el `idUsuario`
async function saveTokenToBackend(userId: string, token: string) {
  try {
    const response = await fetch(
      'https://likephone-back.vercel.app/api/notifications/register-token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token }),
      }
    )

    const data = await response.json()
    console.log('✅ Token registrado en el backend:', data)
  } catch (error) {
    console.error('❌ Error al registrar el token:', error)
  }
}
