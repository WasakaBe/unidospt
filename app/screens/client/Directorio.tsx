import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Linking,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Banners from '@/app/components/banners'
import { API_URL } from '@env'
import LoadingSpinner from '@/app/components/loadingSpinner'
import CustomModal from '@/app/components/customModal'

//styles
import dashboard_styles from '@/app/styles/dashboardStyle'
import noticias_styles from '@/app/styles/noticiasStyle'
import directorio_styles from '@/app/styles/directorioStyle'
interface TipoServicio {
  id: number
  nombre: string
}

interface DirectorioItem {
  id: number
  nombre: string
  apellido_paterno?: string
  apellido_materno?: string
  foto_perfil?: string
  nombre_servicio?: string
  descripcion?: string
  telefono?: string
  direccion_usuario?: string
}

export default function Directorio() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined

  const [tiposServicios, setTiposServicios] = useState<TipoServicio[]>([])
  const [directorioData, setDirectorioData] = useState<DirectorioItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedService, setSelectedService] = useState<number | null>(null)

  // ✅ Estado del Modal
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'success' | 'error' | 'ban'>(
    'success'
  )
  const [modalMessage, setModalMessage] = useState('')

  // ✅ Función para mostrar el Modal
  const mostrarModal = (type: 'success' | 'error' | 'ban', message: string) => {
    setModalType(type)
    setModalMessage(message)
    setModalVisible(true)
  }

  // ✅ Función para abrir WhatsApp
  const abrirWhatsApp = (numero: string, mensaje?: string) => {
    if (!numero) {
      mostrarModal('error', 'Número de teléfono no disponible')
      return
    }

    let url = `whatsapp://send?phone=+52${numero}`
    if (mensaje) {
      url += `&text=${encodeURIComponent(mensaje)}`
    }

    Linking.openURL(url)
      .then(() => {
        console.log('WhatsApp abierto')
      })
      .catch(() => {
        mostrarModal('error', 'Asegúrate de tener WhatsApp instalado')
      })
  }

  // Obtener los tipos de servicio al montar el componente
  useEffect(() => {
    const fetchTiposServicios = async () => {
      try {
        const response = await fetch(`${API_URL}api/services`)
        const data = await response.json()

        if (response.ok && Array.isArray(data)) {
          setTiposServicios(data)
        } else {
          setError('Error al obtener los tipos de servicios')
        }
      } catch (err) {
        setError('Error de conexión con el servidor')
      }
    }

    fetchTiposServicios()
  }, [])

  // Obtener el directorio cuando se selecciona un servicio
  const fetchDirectorio = async (idServicio: number) => {
    setLoading(true)
    setSelectedService(idServicio)

    try {
      const response = await fetch(
        `${API_URL}api/services/directorio/${idPartido}/${idServicio}`
      )
      const data = await response.json()
      console.log('services', data)

      if (response.ok && Array.isArray(data.message)) {
        setDirectorioData(data.message)
      } else {
        setError('No hay datos disponibles')
        setDirectorioData([])
      }
    } catch (err) {
      setError('Error en la conexión con el servidor')
    } finally {
      setLoading(false)
    }
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
          onPress={() => {
            if (selectedService) {
              setSelectedService(null) // Regresa a la Sección 1
            } else {
              router.back()
            }
          }}
        >
          <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={noticias_styles.backText}>Regresar</Text>
        </TouchableOpacity>

        <Text style={noticias_styles.tituloNoticia}>
          Directorio de Servicios
        </Text>

        {/* Logo del Partido */}
        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={noticias_styles.logo}
        />
      </View>

      {/* SECCIÓN 1: Lista de Tipos de Servicios */}
      {!selectedService ? (
        <View>
          <Text style={directorio_styles.sectionTitle}>
            Seleccione un tipo de servicio
          </Text>
          <View style={directorio_styles.servicesContainer}>
            {tiposServicios.map((servicio) => (
              <TouchableOpacity
                key={servicio.id}
                style={directorio_styles.serviceButton}
                onPress={() => fetchDirectorio(servicio.id)}
              >
                <Text style={directorio_styles.serviceButtonText}>
                  {servicio.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <>
          {/* SECCIÓN 2: Lista de Directorio */}
          <Text style={directorio_styles.sectionTitle}>
            Resultados para:{' '}
            {tiposServicios.find((t) => t.id === selectedService)?.nombre}
          </Text>

          {loading ? (
            <LoadingSpinner text="Cargando Servicios..." color="#FFD700" />
          ) : (
            <FlatList
              data={directorioData}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={directorio_styles.containerDirectorio}
              renderItem={({ item }) => (
                <View style={directorio_styles.card}>
                  <View style={directorio_styles.imageSection}>
                    {item.foto_perfil ? (
                      <Image
                        source={{ uri: item.foto_perfil }}
                        style={directorio_styles.profileImage}
                      />
                    ) : (
                      <FontAwesome
                        name="user-circle"
                        size={150}
                        color="#000"
                        style={directorio_styles.defaultProfileIcon}
                      />
                    )}

                    <View style={directorio_styles.serviceBadge}>
                      <Text style={directorio_styles.serviceText}>
                        {item.nombre_servicio || 'Sin servicio'}
                      </Text>
                    </View>
                  </View>

                  <View style={directorio_styles.infoSection}>
                    <Text style={directorio_styles.name}>
                      {item.nombre} {item.apellido_paterno || ''}{' '}
                      {item.apellido_materno || ''}
                    </Text>

                    <Text style={directorio_styles.serviceDescription}>
                      {item.direccion_usuario || 'Dirección no disponible'}
                    </Text>
                    {/* 📲 BOTÓN DE WHATSAPP */}
                    <TouchableOpacity
                      style={directorio_styles.contactInfo}
                      onPress={() =>
                        abrirWhatsApp(
                          item.telefono || '',
                          `Hola ${item.nombre}, estoy interesado en tus servicios.`
                        )
                      }
                    >
                      <Ionicons
                        name="logo-whatsapp"
                        size={16}
                        color="#25D366"
                      />
                      <Text style={directorio_styles.phoneNumber}>
                        {item.telefono || 'Teléfono no disponible'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </>
      )}

      {/* Modal de Notificación */}
      <CustomModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />

      {/* Componente de Banners */}
      <Banners idPartido={Number(idPartido)} />
    </ImageBackground>
  )
}
