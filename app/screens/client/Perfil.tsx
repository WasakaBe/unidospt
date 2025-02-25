import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import dashboard_styles from '@/app/styles/dashboardStyle'
import noticias_styles from '@/app/styles/noticiasStyle'
import perfil_styles from '@/app/styles/perfilStyle'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { API_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomModal from '@/app/components/customModal'
import useMediaAndLocation from '@/app/hooks/useMediaAndLocation'
export default function Perfil() {
  const router = useRouter()
  const params = useLocalSearchParams()
  // Recibir los datos del usuario desde los parámetros
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined
  const userName = params.userName as string
  const userEmail = params.userEmail as string
  const phoneNumber = params.phoneNumber as string
  const userPhoto = params.userPhoto as string

  const [userInfo, setUserInfo] = useState({
    photoUrl: userPhoto,
    nombre: userName.split(' ')[0] || '',
    apellidoPaterno: userName.split(' ')[1] || '',
    apellidoMaterno: userName.split(' ')[2] || '',
    email: userEmail,
    telefono: phoneNumber,
  })

  const [loading, setLoading] = useState(false)

  // Estado para el CustomModal
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'success' | 'error'>('success')
  const [modalMessage, setModalMessage] = useState('')

  // Hook para manejar imágenes
  const { selectedImage, handleSelectImage } = useMediaAndLocation()

  // ✅ Cargar datos del usuario desde AsyncStorage al entrar en la pantalla
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData')
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData)
          setUserInfo((prev) => ({
            ...prev,
            ...parsedUserData,
            photoUrl: parsedUserData.photoUrl || userPhoto, // Si no hay foto en AsyncStorage, usar la predeterminada
          }))
        } else {
          setUserInfo((prev) => ({ ...prev, photoUrl: userPhoto }))
        }
      } catch (error) {
        console.error('❌ Error al cargar los datos del usuario:', error)
      }
    }

    loadUserData()
  }, [])

  // ✅ Función para actualizar la información del usuario
  const handleUpdateInfo = async () => {
    if (
      !userInfo.nombre ||
      !userInfo.apellidoPaterno ||
      !userInfo.apellidoMaterno ||
      !userInfo.email
    ) {
      setModalType('error')
      setModalMessage('Todos los campos son obligatorios')
      setModalVisible(true)
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('id', idUsuario!.toString())
      formData.append('nombre', userInfo.nombre)
      formData.append('apellido_paterno', userInfo.apellidoPaterno)
      formData.append('apellido_materno', userInfo.apellidoMaterno)
      formData.append('correo', userInfo.email)

      if (selectedImage) {
        const fileName = selectedImage.split('/').pop() || 'profile.jpg'
        const fileType = fileName.split('.').pop() || 'jpg'

        formData.append('foto_perfil', {
          uri: selectedImage,
          name: fileName,
          type: `image/${fileType}`,
        } as any)
      }

      const response = await fetch(`${API_URL}api/userspartido/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        console.log(data.message || 'Error al actualizar el perfil')
      }

      // 🔹 Guardar los datos actualizados en AsyncStorage
      const updatedUserData = {
        ...userInfo,
        photoUrl: selectedImage || userInfo.photoUrl,
      }
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData))

      // 🔹 Actualizar el estado local inmediatamente
      setUserInfo(updatedUserData)

      // 🔥 Mostrar modal de éxito
      setModalType('success')
      setModalMessage('Información actualizada correctamente')
      setModalVisible(true)

      // 🔹 Actualizar foto en la interfaz
      if (selectedImage) {
        setUserInfo((prev) => ({ ...prev, photoUrl: selectedImage }))
      }
    } catch (error: unknown) {
      let errorMessage = 'Hubo un problema con la actualización'

      if (error instanceof Error) {
        errorMessage = error.message
      }

      console.log('Error', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={dashboard_styles.background}
    >
      <ScrollView style={perfil_styles.container}>
        <View style={noticias_styles.subcontainer}>
          {/* Botón de regresar */}
          <TouchableOpacity
            style={noticias_styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
            <Text style={noticias_styles.backText}>Regresar</Text>
          </TouchableOpacity>

          <Text style={noticias_styles.tituloNoticia}>Perfil </Text>

          {/* Logo del Partido */}
          <Image
            source={require('../../assets/logo_partidos/unidosPt.png')}
            style={noticias_styles.logo}
          />
        </View>

        <View style={perfil_styles.header}>
          <View style={perfil_styles.photoContainer}>
            <Image
              source={{ uri: selectedImage || userInfo.photoUrl }}
              style={perfil_styles.profilePhoto}
            />
            <TouchableOpacity
              style={perfil_styles.editPhotoButton}
              onPress={handleSelectImage}
            >
              <MaterialIcons name="photo-camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={perfil_styles.formContainer}>
          <Text style={perfil_styles.sectionTitle}>Información Personal</Text>

          <View style={perfil_styles.inputGroup}>
            <Text style={perfil_styles.label}>Nombre</Text>
            <TextInput
              style={perfil_styles.input}
              value={userInfo.nombre}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, nombre: text })
              }
            />
          </View>

          <View style={perfil_styles.inputGroup}>
            <Text style={perfil_styles.label}>Apellido Paterno</Text>
            <TextInput
              style={perfil_styles.input}
              value={userInfo.apellidoPaterno}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, apellidoPaterno: text })
              }
            />
          </View>

          <View style={perfil_styles.inputGroup}>
            <Text style={perfil_styles.label}>Apellido Materno</Text>
            <TextInput
              style={perfil_styles.input}
              value={userInfo.apellidoMaterno}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, apellidoMaterno: text })
              }
            />
          </View>

          <View style={perfil_styles.inputGroup}>
            <Text style={perfil_styles.label}>Correo Electrónico</Text>
            <TextInput
              style={perfil_styles.input}
              value={userInfo.email}
              keyboardType="email-address"
              onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
            />
          </View>

          <View style={perfil_styles.inputGroup}>
            <Text style={perfil_styles.label}>Teléfono</Text>
            <TextInput
              style={perfil_styles.input}
              value={userInfo.telefono}
              keyboardType="phone-pad"
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, telefono: text })
              }
            />
          </View>

          <TouchableOpacity
            style={[perfil_styles.updateButton, loading && { opacity: 0.6 }]}
            onPress={handleUpdateInfo}
            disabled={loading}
          >
            <Text style={perfil_styles.updateButtonText}>
              {' '}
              {loading ? 'Actualizando...' : 'Actualizar Información'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ✅ Custom Modal */}
      <CustomModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </ImageBackground>
  )
}
