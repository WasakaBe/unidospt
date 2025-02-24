import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router' // ✅ Reemplazo de navigation
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import { ProgressBar } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import {
  formatDate,
  calcularDiasRestantes,
  convertirAGB,
  restarSinRetorno,
} from '@/app/constants/functions'
import LoadingSpinner from '@/app/components/loadingSpinner'
const customColors = {
  blue: '#007bff',
  grey: '#6c757d',
  green: '#28a745',
}

interface PlanData {
  datos_iniciales: number
  datos: number
  fecha_datos_final: { date: string }
  mensajes_iniciales: number
  mensajes: number
  minutos_iniciales: number
  minutos: number
  offering_datos: string
}

export default function ConsultarSaldo() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined
  const userName = Array.isArray(params.userName)
    ? decodeURIComponent(params.userName[0]) // Si es un array, toma el primer elemento
    : decodeURIComponent(params.userName || 'Usuario') // Si es string o undefined, usa un valor por defecto

  const urlPlan = 'https://likephone.mx/api/SaldoUsuario/'
  const getPlanes = 'https://likephone.mx/api/getPlanes'
  const Telefono = '8124447352'

  const [datosPlan, setDatosPlan] = useState<PlanData | null>(null)
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [urlImagen, setUrlImagen] = useState(
    'https://likephone.mx/public/iconos/fondo1.png'
  )

  const fetchData = useCallback(async () => {
    try {
      const formdata = new FormData()
      formdata.append('numero', Telefono)

      const res = await fetch(urlPlan, {
        method: 'POST',
        body: formdata,
      })

      if (!res.ok) {
        throw new Error('Error al obtener los datos del plan')
      }

      const data: PlanData = await res.json()
      setDatosPlan(data)
    } catch (error) {
      console.error('Error en el servidor:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch(getPlanes)
      const data = await response.json()
      setPlans(data)
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la lista de planes.')
    }
  }

  useEffect(() => {
    fetchData()
    fetchPlans()
  }, [])

  useEffect(() => {
    if (datosPlan && plans.length > 0) {
      const planEncontrado = plans.find(
        (plan) => plan.offeringId === datosPlan.offering_datos
      )
      setUrlImagen(
        planEncontrado
          ? `https://crm.likephone.mx/public/img/${planEncontrado.imagen_movil2}`
          : 'https://likephone.mx/public/iconos/fondo1.png'
      )
    }
  }, [datosPlan, plans])

  if (loading) {
    return (
      <LoadingSpinner text="Cargando Consulta de saldo..." color="#FFD700" />
    )
  }

  const fecha = datosPlan?.fecha_datos_final?.date
  const fechaFormateada = fecha
    ? formatDate(fecha)
    : { day: '--', monthYear: '--' }
  const diasRestantes = fecha ? calcularDiasRestantes(fecha) : 0
  const gbInicial = convertirAGB(datosPlan?.datos_iniciales || 0)
  const Totalgb = convertirAGB(
    restarSinRetorno(datosPlan?.datos_iniciales || 0, datosPlan?.datos || 0)
  )
  const Mensaje = restarSinRetorno(
    datosPlan?.mensajes_iniciales || 0,
    datosPlan?.mensajes || 0
  )
  const Llamadas = restarSinRetorno(
    datosPlan?.minutos_iniciales || 0,
    datosPlan?.minutos || 0
  )

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={styles.background}
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.username}>¡Hola!,{userName}</Text>

        {/* Imagen del plan activo */}
        <View style={styles.planContainer}>
          <Image source={{ uri: urlImagen }} style={styles.bannerLike} />
        </View>

        {/* Expiration Info */}
        <View style={styles.expirationContainer}>
          <Text style={styles.expirationTitle}>Fecha que expira el plan</Text>
          <View style={styles.expirationDetails}>
            <View style={styles.expirationsubDetails}>
              <Text style={styles.date}>{fechaFormateada.day}</Text>
              <Text style={styles.month}>{fechaFormateada.monthYear}</Text>
            </View>
            <View style={styles.expirationsubDetails}>
              <Text style={styles.date}>{diasRestantes}</Text>
              <Text style={styles.month}>
                {' '}
                {diasRestantes === 1 ? 'Día' : 'Días'}
              </Text>
            </View>
          </View>
        </View>

        {/* Usage Details */}
        <View style={styles.usageContainer}>
          <Text style={styles.usageTitle}>Detalle del consumo</Text>
          <Text style={styles.usageTitle}>Inicial : {gbInicial}</Text>

          {/* Internet */}
          <Ionicons name="wifi" size={24} color="#000" />
          <Text style={styles.usageLabel}>Internet</Text>
          <ProgressBar
            progress={Math.min(
              restarSinRetorno(
                datosPlan?.datos_iniciales || 0,
                datosPlan?.datos || 0
              ) / Math.max(datosPlan?.datos_iniciales || 1, 1),
              1
            )}
            color={customColors.blue}
            style={styles.progressBar}
          />
          <Text style={styles.usageText}>{Totalgb}</Text>

          {/* SMS */}
          <Ionicons name="chatbox" size={24} color="#000" />
          <Text style={styles.usageLabel}>SMS</Text>
          <ProgressBar
            progress={Math.min(
              restarSinRetorno(
                datosPlan?.mensajes_iniciales || 0,
                datosPlan?.mensajes || 0
              ) / Math.max(datosPlan?.mensajes_iniciales || 1, 1),
              1
            )}
            color={customColors.grey}
            style={styles.progressBar}
          />
          <Text style={styles.usageText}>{Mensaje}</Text>

          {/* Llamadas */}
          <Ionicons name="phone-portrait-outline" size={24} color="#000" />
          <Text style={styles.usageLabel}>Llamadas</Text>
          <ProgressBar
            progress={Math.min(
              restarSinRetorno(
                datosPlan?.minutos_iniciales || 0,
                datosPlan?.minutos || 0
              ) / Math.max(datosPlan?.minutos_iniciales || 1, 1),
              1
            )}
            color={customColors.green}
            style={styles.progressBar}
          />
          <Text style={styles.usageText}>{Llamadas}</Text>
        </View>

        {/* Coverage Information */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Llamadas y SMS con Cobertura Nacional, Estados Unidos y Canadá
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  bannerLike: {
    width: 400,
    height: 200,
    objectFit: 'fill',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    marginTop: 16,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
  },
  planContainer: {
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: '#7f7ff183',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  expirationContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  expirationTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 24,
  },
  expirationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  expirationsubDetails: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  date: {
    fontSize: 30,
    color: 'blue',
    fontWeight: 'bold',
  },
  month: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  daysLeft: {
    fontSize: 22,
    color: 'blue',
    fontWeight: 'bold',
  },
  usageContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  usageTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  usageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  usageText: {
    fontSize: 14,
    textAlign: 'right',
    color: '#777',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  footerText: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 20,
  },
})
