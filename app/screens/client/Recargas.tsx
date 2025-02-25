import React, { useEffect, useState } from 'react'
import {
  FlatList,
  View,
  Alert,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  ImageBackground,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router' // ✅ Reemplazo de navigation
import CardPlan from '@/app/components/cardPlan'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
//styles
import noticias_styles from '@/app/styles/noticiasStyle'
import recarga_styles from '@/app/styles/recargasStyle'
import LoadingSpinner from '@/app/components/loadingSpinner'
interface Plan {
  cv_plan: number
  imagen_movil1: string
  nombre_comercial: string
  datos: string
  vigencia: string
  monto: number
  ticket: string
}

interface Recipient {
  label: string
  value: string
}

export default function Recargas() {
  const router = useRouter() // ✅ Reemplazo de `navigation`
  const params = useLocalSearchParams()
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined

  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [recipients, setRecipients] = useState<Recipient[]>([
    { label: 'Para Mi - 8126225958', value: '8126225958' },
    { label: 'Mamá - 8123456789', value: '8123456789' },
  ])
  const [selectedRecipient, setSelectedRecipient] =
    useState<string>('8126225958')
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async (): Promise<void> => {
    try {
      const response = await fetch('https://likephone.mx/api/getPlanes')
      const data: Plan[] = await response.json()
      setPlans(data)
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la lista de planes.')
      console.error('Error al obtener los planes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddRecipient = (): void => {
    Alert.prompt(
      'Nuevo destinatario',
      'Introduce el nombre y número del destinatario:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Agregar',
          onPress: (input: string | undefined) => {
            if (input) {
              const [name, phone] = input.split('-')
              if (name && phone) {
                setRecipients((prev) => [
                  ...prev,
                  {
                    label: `${name.trim()} - ${phone.trim()}`,
                    value: phone.trim(),
                  },
                ])
                Alert.alert('Éxito', 'Destinatario agregado correctamente.')
              } else {
                Alert.alert(
                  'Error',
                  "Formato incorrecto. Usa 'Nombre - Número'."
                )
              }
            } else {
              Alert.alert('Error', 'Entrada vacía.')
            }
          },
        },
      ],
      'plain-text'
    )
  }

  const toggleModal = (): void => {
    setIsModalVisible(!isModalVisible)
  }

  if (loading) {
    return (
      <View style={recarga_styles.loaderContainer}>
        <LoadingSpinner text="Cargando recargas...." color="#007BFF" />
      </View>
    )
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={recarga_styles.container}
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
      </View>

      {/* Selector de destinatarios */}
      <View style={recarga_styles.rechargeContainer}>
        <Text style={recarga_styles.rechargeText}>
          ¿A quién le harás recarga?
        </Text>
        <View style={recarga_styles.selectorRow}>
          <TouchableOpacity
            style={recarga_styles.pickerContainer}
            onPress={toggleModal}
          >
            <Text style={recarga_styles.pickerText}>
              {recipients.find((r) => r.value === selectedRecipient)?.label ||
                'Seleccionar destinatario'}
            </Text>
            <Ionicons name="chevron-down-outline" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            style={recarga_styles.addButton}
            onPress={handleAddRecipient}
          >
            <Ionicons name="add-circle-outline" size={24} color="#007BFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal para seleccionar destinatario */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <View style={recarga_styles.modalOverlay}>
          <View style={recarga_styles.modalContent}>
            <ScrollView>
              {recipients.map((recipient, index) => (
                <TouchableOpacity
                  key={index}
                  style={recarga_styles.modalItem}
                  onPress={() => {
                    setSelectedRecipient(recipient.value)
                    toggleModal()
                  }}
                >
                  <Text style={recarga_styles.modalItemText}>
                    {recipient.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Lista de planes */}
      <FlatList
        data={plans}
        keyExtractor={(item) => item.cv_plan.toString()}
        renderItem={({ item }) => (
          <CardPlan
            plan={item}
            onViewDetails={(plan) => console.log('Detalles del plan:', plan)}
          />
        )}
        contentContainerStyle={recarga_styles.listContainer}
      />
    </ImageBackground>
  )
}
