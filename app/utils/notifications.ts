import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

// Configuración para manejar notificaciones en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

// Función para registrar y obtener el token de notificaciones
export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  let token: string | null = null

  // Verificar si el dispositivo es físico
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      alert('No se pudo obtener permisos para las notificaciones push.')
      return null
    }

    // Obtener el token de Expo
    const tokenData = await Notifications.getExpoPushTokenAsync()
    token = tokenData.data
    console.log('Token de Notificación:', token)
  } else {
    alert('Las notificaciones push solo funcionan en dispositivos físicos.')
  }

  // Configuración específica para Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  return token
}
