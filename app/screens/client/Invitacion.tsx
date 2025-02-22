import React, { useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { API_URL } from '@env'
import noticias_styles from '@/app/styles/noticiasStyle'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import {
  validateEmail,
  validateFullName,
  validatePhone,
} from '@/app/constants/validations'
import CustomModal from '@/app/components/customModal'

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
      style={styles.background}
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

      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={styles.logo}
        />

        {/* Título */}
        <Text style={styles.title}>
          ¡Invita a tus familiares y amigos a formar parte!
        </Text>

        {/* Campos del formulario */}
        <View style={styles.inputContainer}>
          <Ionicons name="person" size={24} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre Completo"
            placeholderTextColor="#999"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="call" size={24} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="email"
            size={24}
            color="#999"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={correo}
            onChangeText={setCorreo}
          />
        </View>

        {/* Botón enviar */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleEnviar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>ENVIAR</Text>
          )}
        </TouchableOpacity>

        {/* Nota */}
        <Text style={styles.note}>
          *Estoy de acuerdo en enviar la información de contacto de mi
          familiar/amigo para que sea contactado y se invite a realizar el
          proceso de afiliación.
        </Text>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
})
