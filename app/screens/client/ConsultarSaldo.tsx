import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
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
//styles
import consulta_saldo_styles from '@/app/styles/consultarSaldoStyle'

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
      style={consulta_saldo_styles.background}
    >
      <ScrollView style={consulta_saldo_styles.container}>
        {/* Header */}
        <View style={consulta_saldo_styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={consulta_saldo_styles.username}>¡Hola!,{userName}</Text>

        {/* Imagen del plan activo */}
        <View style={consulta_saldo_styles.planContainer}>
          <Image
            source={{ uri: urlImagen }}
            style={consulta_saldo_styles.bannerLike}
          />
        </View>

        {/* Expiration Info */}
        <View style={consulta_saldo_styles.expirationContainer}>
          <Text style={consulta_saldo_styles.expirationTitle}>
            Fecha que expira el plan
          </Text>
          <View style={consulta_saldo_styles.expirationDetails}>
            <View style={consulta_saldo_styles.expirationsubDetails}>
              <Text style={consulta_saldo_styles.date}>
                {fechaFormateada.day}
              </Text>
              <Text style={consulta_saldo_styles.month}>
                {fechaFormateada.monthYear}
              </Text>
            </View>
            <View style={consulta_saldo_styles.expirationsubDetails}>
              <Text style={consulta_saldo_styles.date}>{diasRestantes}</Text>
              <Text style={consulta_saldo_styles.month}>
                {' '}
                {diasRestantes === 1 ? 'Día' : 'Días'}
              </Text>
            </View>
          </View>
        </View>

        {/* Usage Details */}
        <View style={consulta_saldo_styles.usageContainer}>
          <Text style={consulta_saldo_styles.usageTitle}>
            Detalle del consumo
          </Text>
          <Text style={consulta_saldo_styles.usageTitle}>
            Inicial : {gbInicial}
          </Text>

          {/* Internet */}
          <Ionicons name="wifi" size={24} color="#000" />
          <Text style={consulta_saldo_styles.usageLabel}>Internet</Text>
          <ProgressBar
            progress={Math.min(
              restarSinRetorno(
                datosPlan?.datos_iniciales || 0,
                datosPlan?.datos || 0
              ) / Math.max(datosPlan?.datos_iniciales || 1, 1),
              1
            )}
            color={customColors.blue}
            style={consulta_saldo_styles.progressBar}
          />
          <Text style={consulta_saldo_styles.usageText}>{Totalgb} GB</Text>

          {/* SMS */}
          <Ionicons name="chatbox" size={24} color="#000" />
          <Text style={consulta_saldo_styles.usageLabel}>SMS</Text>
          <ProgressBar
            progress={Math.min(
              restarSinRetorno(
                datosPlan?.mensajes_iniciales || 0,
                datosPlan?.mensajes || 0
              ) / Math.max(datosPlan?.mensajes_iniciales || 1, 1),
              1
            )}
            color={customColors.grey}
            style={consulta_saldo_styles.progressBar}
          />
          <Text style={consulta_saldo_styles.usageText}>{Mensaje}</Text>

          {/* Llamadas */}
          <Ionicons name="phone-portrait-outline" size={24} color="#000" />
          <Text style={consulta_saldo_styles.usageLabel}>Llamadas</Text>
          <ProgressBar
            progress={Math.min(
              restarSinRetorno(
                datosPlan?.minutos_iniciales || 0,
                datosPlan?.minutos || 0
              ) / Math.max(datosPlan?.minutos_iniciales || 1, 1),
              1
            )}
            color={customColors.green}
            style={consulta_saldo_styles.progressBar}
          />
          <Text style={consulta_saldo_styles.usageText}>{Llamadas}</Text>
        </View>

        {/* Coverage Information */}
        <View style={consulta_saldo_styles.footer}>
          <Text style={consulta_saldo_styles.footerText}>
            Llamadas y SMS con Cobertura Nacional, Estados Unidos y Canadá
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}
