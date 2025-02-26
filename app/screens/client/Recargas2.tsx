import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  TextInput,
  Modal,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { validatePhone } from '@/app/constants/validations' // Importación de la validación
import LoadingSpinner from '@/app/components/loadingSpinner'
import PagerView from 'react-native-pager-view'
//styles
import noticias_styles from '@/app/styles/noticiasStyle'
import reporte_styles from '@/app/styles/reporteStyle'
import recargas_dos_styles from '@/app/styles/recargas2Style'
import dashboard_styles from '@/app/styles/dashboardStyle'

interface Plan {
  cv_plan?: string
  imagen_movil1?: string
  nombre_comercial: string
  monto: number
  datos: string
  vigencia: string
  ticket: string
}

interface Props {
  planes: Plan[]
}

export default function Recargas2() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false) // Estado corregido
  const [planes, setPlanes] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [showPlans, setShowPlans] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false) // Estado para controlar la visibilidad del modal
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null) // Estado para almacenar el plan seleccionado

  const handlePhoneChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '') // Solo números
    setPhoneNumber(numericText)

    const validationError = validatePhone(numericText)
    setErrorMessage(validationError)
    setIsValid(validationError === null) // Si no hay error, el número es válido
  }

  const fetchPlanes = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://likephone.mx/api/getPlanes')
      if (!response.ok) {
        throw new Error('Error al obtener los planes')
      }
      const data = await response.json()
      setPlanes(data)
    } catch (error) {
      console.error('Error al obtener los planes:', error)
      setErrorMessage(
        'Error al cargar los planes. Inténtalo de nuevo más tarde.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    fetchPlanes()
    setShowPlans(true)
  }
  //carrusel de planes
  const chunkArray = (array: Plan[], size: number) => {
    return array.reduce((acc: Plan[][], _, i) => {
      if (i % size === 0) acc.push(array.slice(i, i + size))
      return acc
    }, [])
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={dashboard_styles.background}
    >
      <View style={noticias_styles.subcontainer}>
        {/* Botón de regresar */}
        <TouchableOpacity
          style={noticias_styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={noticias_styles.backText}>Regresar</Text>
        </TouchableOpacity>

        <Text style={noticias_styles.tituloNoticia}>Recargas 2</Text>

        {/* Logo del Partido */}
        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={noticias_styles.logo}
        />
      </View>
      {/* formulario de recarga */}
      <View>
        <View style={recargas_dos_styles.formContainer}>
          <Text style={recargas_dos_styles.title}>
            ¿A quién le realizarás la recarga?
          </Text>

          <View style={recargas_dos_styles.inputContainer}>
            <Ionicons
              name="call"
              size={24}
              color="#4E4E4E"
              style={recargas_dos_styles.inputIcon}
            />
            <TextInput
              style={recargas_dos_styles.input}
              placeholder="Número de teléfono"
              placeholderTextColor="#9B9B9B"
              keyboardType="numeric"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              maxLength={10}
            />
            {phoneNumber.length > 0 && (
              <TouchableOpacity
                style={recargas_dos_styles.clearButton}
                onPress={() => setPhoneNumber('')}
              >
                <Ionicons name="close-circle" size={20} color="#9B9B9B" />
              </TouchableOpacity>
            )}
          </View>

          {/* Mensaje de error basado en la validación */}
          {errorMessage && (
            <Text style={recargas_dos_styles.validationText}>
              {errorMessage}
            </Text>
          )}

          <TouchableOpacity disabled={!isValid} onPress={handleNext}>
            <LinearGradient
              colors={isValid ? ['#0068d1', '#00a0e9'] : ['#c7c7c7', '#e0e0e0']}
              style={[
                recargas_dos_styles.button,
                !isValid && recargas_dos_styles.buttonDisabled,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text
                style={[
                  recargas_dos_styles.buttonText,
                  !isValid && recargas_dos_styles.buttonTextDisabled,
                ]}
              >
                Siguiente
              </Text>
              {isValid && (
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={recargas_dos_styles.infoContainer}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#0068d1"
            />
            <Text style={recargas_dos_styles.infoText}>
              Ingresa el número de teléfono sin código de país ni espacios
            </Text>
          </View>
        </View>

        <View style={recargas_dos_styles.bottomBackground} />
      </View>
      {/* fin formulario de recarga */}

      {/* Mostrar tarjetas de planes después de ingresar el teléfono */}
      {showPlans && (
        <View style={recargas_dos_styles.plansContainer}>
          <Text style={recargas_dos_styles.plansTitle}>Selecciona tu plan</Text>

          {loading ? (
            <LoadingSpinner text="Cargando Planes...." color="#0068d1" />
          ) : (
            <PagerView style={recargas_dos_styles.pagerView} initialPage={0}>
              {chunkArray(planes, 2).map((pair, index) => (
                <View key={index} style={recargas_dos_styles.page}>
                  {pair.map((item, subIndex) => (
                    <View key={subIndex} style={recargas_dos_styles.card}>
                      {item.imagen_movil1 && (
                        <Image
                          source={{
                            uri: `https://crm.likephone.mx/public/img/${item.imagen_movil1}`,
                          }}
                          style={recargas_dos_styles.planImage}
                        />
                      )}
                      <Text style={recargas_dos_styles.planName}>
                        {item.nombre_comercial}
                      </Text>
                      <Text style={recargas_dos_styles.planPrice}>
                        💰 Precio: ${item.monto}
                      </Text>

                      <Text style={recargas_dos_styles.sectionTitle}>
                        Detalles del Plan
                      </Text>

                      <Text style={recargas_dos_styles.planDetails}>
                        📡 Datos: {(parseInt(item.datos, 10) / 1000).toFixed(0)}{' '}
                        GB por {item.vigencia} Días
                      </Text>

                      <TouchableOpacity
                        style={recargas_dos_styles.buttonTicket}
                        onPress={() => {
                          setSelectedPlan(item) // Almacenar el plan seleccionado
                          setIsModalVisible(true) // Mostrar el modal
                        }}
                      >
                        <Text style={recargas_dos_styles.buttonTxtTicket}>
                          Lo quiero
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))}
            </PagerView>
          )}
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)} // Cerrar el modal al presionar el botón de retroceso en Android
      >
        <View style={reporte_styles.modalOverlay}>
          <View style={reporte_styles.modalContent}>
            <Text style={reporte_styles.label}>
              ¿Estás seguro que quieres recargar a este número {phoneNumber}?
            </Text>
            <View style={reporte_styles.footer}>
              <TouchableOpacity
                style={reporte_styles.cancelButton}
                onPress={() => setIsModalVisible(false)} // Cerrar el modal al cancelar
              >
                <Text style={reporte_styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={reporte_styles.createButton}
                onPress={() => {
                  setIsModalVisible(false) // Cerrar el modal
                  // Navegar a la nueva pantalla con los parámetros necesarios
                  router.push({
                    pathname: '/screens/client/webview',
                    params: {
                      cv_plan: selectedPlan?.cv_plan || '',
                      phoneNumber: phoneNumber,
                    },
                  })
                }}
              >
                <Text style={reporte_styles.createButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  )
}
