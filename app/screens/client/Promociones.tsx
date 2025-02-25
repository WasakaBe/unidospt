import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import LoadingSpinner from '@/app/components/loadingSpinner'
import Banners from '@/app/components/banners'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { API_URL } from '@env'
//styles
import dashboard_styles from '@/app/styles/dashboardStyle'
import noticias_styles from '@/app/styles/noticiasStyle'
import promocion_styles from '@/app/styles/promocionesStyle'
//interfaces
import { Promo } from '@/app/utils/interface'

export default function Promociones() {
  const router = useRouter() // ✅ Reemplazo de `navigation`
  const params = useLocalSearchParams()
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmExitModalVisible, setConfirmExitModalVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutos en segundos
  const [promociones, setPromociones] = useState<Promo[]>([])
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined // Especificamos el tipo correcto

    if (modalVisible) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timer) clearInterval(timer) // Evitamos problemas con valores undefined
            setModalVisible(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setTimeLeft(900)
    }

    return () => {
      if (timer) clearInterval(timer) // Nos aseguramos de limpiar el intervalo correctamente
    }
  }, [modalVisible])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }

  useEffect(() => {
    if (!idPartido) return

    const fetchPromociones = async () => {
      try {
        const response = await fetch(`${API_URL}api/promociones/${idPartido}`)
        const data = await response.json()
        console.log('promociones', data.promociones)

        if (data.success && data.promociones.length > 0) {
          setPromociones(data.promociones) // ✅ Asignar correctamente las promociones al estado
          console.log(data.promociones)
        } else {
          console.log('No se encontraron promociones.')
        }
      } catch (error) {
        console.error('Error obteniendo promociones:', error)
        console.log('Hubo un problema al obtener las promociones.')
      } finally {
        setLoading(false)
      }
    }

    fetchPromociones()
  }, [idPartido])

  const registerClick = async (idPromocion: number) => {
    try {
      const response = await fetch(
        `${API_URL}api/promociones/click/${idPromocion}`,
        {
          method: 'POST',
        }
      )
      const data = await response.json()
      console.log('Click registrado:', data)
    } catch (error) {
      console.error('Error al registrar el clic:', error)
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
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={noticias_styles.backText}>Regresar</Text>
        </TouchableOpacity>

        <Text style={noticias_styles.tituloNoticia}>
          Promociones y Descuentos
        </Text>

        {/* Logo del Partido */}
        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={noticias_styles.logo}
        />
      </View>

      <View style={promocion_styles.container}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          promociones.map((promo) => (
            <View
              key={promo.idPromocion}
              style={promocion_styles.ticketContainer}
            >
              <View style={promocion_styles.ticketEdge}>
                {[...Array(3)].map((_, i) => (
                  <View key={`left-${i}`} style={promocion_styles.toothLeft} />
                ))}
              </View>

              <View style={promocion_styles.mainContent}>
                <View style={promocion_styles.header}>
                  {promo.logo ? (
                    <Image
                      source={{ uri: promo.logo }}
                      style={{ width: 40, height: 40, resizeMode: 'contain' }}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="calendar"
                      size={18}
                      color="#666"
                    />
                  )}

                  <Text style={promocion_styles.restaurantName}>
                    {promo.nombreNegocio}
                  </Text>
                </View>

                {/* Línea separadora */}
                <View style={promocion_styles.separatorTop} />

                <View style={promocion_styles.promoContainer}>
                  <Text style={promocion_styles.promoTitle}>
                    {promo.tituloPromocion}
                  </Text>

                  <Text style={promocion_styles.promoDescription}>
                    {promo.detalles}
                  </Text>
                </View>
                {/* Línea separadora */}
                <View style={promocion_styles.separatorTop} />
                <View style={promocion_styles.detailsContainer}>
                  <View style={promocion_styles.dateInfo}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={18}
                      color="#666"
                    />
                    <Text style={promocion_styles.dateText}>
                      Valido : {promo.descripcionPromocion}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={promocion_styles.button}
                    onPress={() => {
                      setSelectedPromo(promo)
                      setModalVisible(true)
                      registerClick(promo.idPromocion)
                    }}
                  >
                    <Text style={promocion_styles.buttonText}>PEDIR AHORA</Text>
                  </TouchableOpacity>
                </View>

                <View style={promocion_styles.separator} />
              </View>

              <View style={promocion_styles.ticketEdge}>
                {[...Array(3)].map((_, i) => (
                  <View
                    key={`right-${i}`}
                    style={promocion_styles.toothRight}
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={promocion_styles.modalContainer}>
          <View style={promocion_styles.ticketContainerModal}>
            {/* Borde derecho dentado */}
            <View style={promocion_styles.ticketEdge}>
              {[...Array(3)].map((_, i) => (
                <View key={`right-${i}`} style={promocion_styles.toothLeft} />
              ))}
            </View>
            <View style={promocion_styles.mainContent}>
              {selectedPromo && (
                <>
                  {/* Imagen de la promoción */}
                  <Image
                    source={{ uri: selectedPromo.logo }}
                    style={{ width: 60, height: 100, resizeMode: 'contain' }}
                  />

                  {/* Título y descripción */}
                  <Text style={promocion_styles.promoTitle}>
                    {selectedPromo.tituloPromocion}
                  </Text>
                  <Text style={promocion_styles.promoDescription}>
                    {selectedPromo.descripcionPromocion}
                  </Text>

                  {/* Tiempo restante */}
                  <Text style={promocion_styles.warningText}>
                    Este cupón es válido por 15 minutos, después de ello se
                    tomará como usado.
                  </Text>
                  <Text style={promocion_styles.timerText}>
                    Tiempo restante: {formatTime(timeLeft)}
                  </Text>

                  {/* Botón de salir */}
                  <TouchableOpacity
                    style={promocion_styles.buttonModal}
                    onPress={() => setConfirmExitModalVisible(true)}
                  >
                    <Text style={promocion_styles.buttonText}>Salir</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            {/* Borde derecho dentado */}
            <View style={promocion_styles.ticketEdge}>
              {[...Array(3)].map((_, i) => (
                <View key={`right-${i}`} style={promocion_styles.toothRight} />
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmExitModalVisible}
        onRequestClose={() => setConfirmExitModalVisible(false)}
      >
        <View style={promocion_styles.modalContainer}>
          <View style={promocion_styles.confirmContainer}>
            <Text style={promocion_styles.confirmText}>
              ¿Estás seguro de salir?
            </Text>
            <View style={promocion_styles.buttonRow}>
              <TouchableOpacity
                style={promocion_styles.confirmButtonSi}
                onPress={() => {
                  setConfirmExitModalVisible(false)
                  setModalVisible(false)
                }}
              >
                <Text style={promocion_styles.buttonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={promocion_styles.confirmButton}
                onPress={() => setConfirmExitModalVisible(false)}
              >
                <Text style={promocion_styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Componente de Banners */}
      <Banners idPartido={Number(idPartido)} />
    </ImageBackground>
  )
}
