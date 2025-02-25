import React, { useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { API_URL } from '@env'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import {
  validateEmail,
  validateFullName,
  validatePhone,
} from '@/app/constants/validations'
import CustomModal from '@/app/components/customModal'
//styles
import noticias_styles from '@/app/styles/noticiasStyle'
import invitacion_styles from '@/app/styles/invitacion'
export default function Invitacion() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined

  // Estados del formulario
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [correo, setCorreo] = useState('')
  const [loading, setLoading] = useState(false)

  // Estado para el modal
  const [modal, setModal] = useState({
    visible: false,
    type: 'success' as 'success' | 'error',
    message: '',
  })

  // Función para mostrar el modal
  const showModal = (type: 'success' | 'error', message: string) => {
    setModal({ visible: true, type, message })
  }

  // Función para ocultar el modal
  const closeModal = () => {
    setModal({ ...modal, visible: false })
  }

  // Función para enviar datos a la API
  const handleEnviar = async () => {
    const nombreError = validateFullName(nombre) || ''
    const correoError = validateEmail(correo) || ''
    const telefonoError = validatePhone(telefono) || ''

    if (nombreError || correoError || telefonoError) {
      Alert.alert(
        'Error',
        `${nombreError}\n${correoError}\n${telefonoError}`.trim()
      )
      return
    }

    setLoading(true) // Activar indicador de carga

    try {
      const response = await fetch(`${API_URL}api/afiliar/agregar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_agregador: idUsuario,
          nombre,
          telefono,
          correo,
        }),
      })

      const result = await response.json()
      if (response.ok) {
        showModal('success', 'El usuario ha sido afiliado correctamente.')
        setNombre('')
        setTelefono('')
        setCorreo('')
      } else {
        showModal('error', result.message || 'No se pudo afiliar al usuario.')
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema con la solicitud.')
      console.error('Error al enviar datos:', error)
    } finally {
      setLoading(false) // Desactivar indicador de carga
    }
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={invitacion_styles.background}
    >
      {/* Modal de notificación */}
      <CustomModal
        visible={modal.visible}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />
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

      <View style={invitacion_styles.container}>
        {/* Logo */}
        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={invitacion_styles.logo}
        />

        {/* Título */}
        <Text style={invitacion_styles.title}>
          ¡Invita a tus familiares y amigos a formar parte!
        </Text>

        {/* Campos del formulario */}
        <View style={invitacion_styles.inputContainer}>
          <Ionicons
            name="person"
            size={24}
            color="#999"
            style={invitacion_styles.icon}
          />
          <TextInput
            style={invitacion_styles.input}
            placeholder="Nombre Completo"
            placeholderTextColor="#999"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>
        <View style={invitacion_styles.inputContainer}>
          <Ionicons
            name="call"
            size={24}
            color="#999"
            style={invitacion_styles.icon}
          />
          <TextInput
            style={invitacion_styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
          />
        </View>
        <View style={invitacion_styles.inputContainer}>
          <MaterialIcons
            name="email"
            size={24}
            color="#999"
            style={invitacion_styles.icon}
          />
          <TextInput
            style={invitacion_styles.input}
            placeholder="Correo Electrónico"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={correo}
            onChangeText={setCorreo}
          />
        </View>

        {/* Botón enviar */}
        <TouchableOpacity
          style={invitacion_styles.button}
          onPress={handleEnviar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={invitacion_styles.buttonText}>ENVIAR</Text>
          )}
        </TouchableOpacity>

        {/* Nota */}
        <Text style={invitacion_styles.note}>
          *Estoy de acuerdo en enviar la información de contacto de mi
          familiar/amigo para que sea contactado y se invite a realizar el
          proceso de afiliación.
        </Text>
      </View>
    </ImageBackground>
  )
}
