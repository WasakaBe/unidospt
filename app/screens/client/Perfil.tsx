import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import dashboard_styles from '@/app/styles/dashboardStyle'
import noticias_styles from '@/app/styles/noticiasStyle'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'

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

  const handleUpdateInfo = () => {
    // Aquí iría la lógica para actualizar la información
    alert('Información actualizada correctamente')
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={dashboard_styles.background}
    >
      <ScrollView style={styles.container}>
        <View style={noticias_styles.subcontainer}>
          {/* Botón de regresar */}
          <TouchableOpacity
            style={noticias_styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
            <Text style={noticias_styles.backText}>Regresar</Text>
          </TouchableOpacity>

          <Text style={noticias_styles.tituloNoticia}>Perfil</Text>

          {/* Logo del Partido */}
          <Image
            source={require('../../assets/logo_partidos/unidosPt.png')}
            style={noticias_styles.logo}
          />
        </View>

        <View style={styles.header}>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: userInfo.photoUrl }}
              style={styles.profilePhoto}
            />
            <TouchableOpacity style={styles.editPhotoButton}>
              <MaterialIcons name="photo-camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={userInfo.nombre}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, nombre: text })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellido Paterno</Text>
            <TextInput
              style={styles.input}
              value={userInfo.apellidoPaterno}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, apellidoPaterno: text })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellido Materno</Text>
            <TextInput
              style={styles.input}
              value={userInfo.apellidoMaterno}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, apellidoMaterno: text })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              value={userInfo.email}
              keyboardType="email-address"
              onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={userInfo.telefono}
              keyboardType="phone-pad"
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, telefono: text })
              }
            />
          </View>

          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateInfo}
          >
            <Text style={styles.updateButtonText}>Actualizar Información</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  photoContainer: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 60,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editPhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  formContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semitransparente
    margin: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },

  updateButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
