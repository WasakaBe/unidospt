import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import dashboard_styles from '@/app/styles/dashboardStyle'
import noticias_styles from '@/app/styles/noticiasStyle'
import reporte_styles from '@/app/styles/reporteStyle'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { API_URL } from '@env'
import connectSocket from '@/app/auth/socket'
import LoadingSpinner from '@/app/components/loadingSpinner'
import CustomModal from '@/app/components/customModal'
interface Post {
  id_contenido: number
  autor: string
  descripcion: string
  fecha_publicacion: string
  foto_perfil: string
  nombre_partido: string
  ruta_imagen: string
}

export default function Conectate() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [bannedModalVisible, setBannedModalVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [postText, setPostText] = useState('')
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const limit = 10

  // 🔹 Estado para el modal de mensajes
  const [customModalVisible, setCustomModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'success' | 'error' | 'ban'>(
    'success'
  )
  const [modalMessage, setModalMessage] = useState('')

  useEffect(() => {
    if (idPartido && hasMorePosts && !loading) {
      fetchPosts()
    }
  }, [idPartido, currentPage])

  const fetchPosts = async () => {
    if (!hasMorePosts) return

    setLoading(true)
    try {
      const response = await fetch(
        `${API_URL}api/post/${idUsuario}?page=${currentPage}&limit=${limit}`
      )
      console.log('api post', response)

      const data = await response.json()

      if (response.ok && data.posts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...data.posts])
      } else {
        setHasMorePosts(false)
      }
    } catch (error) {
      console.error('Error en la petición:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      alert('Se requiere acceso a la cámara para tomar fotos.')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Se requiere acceso a la galería para seleccionar imágenes.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  const handleCreatePost = async () => {
    if (!postText || !idUsuario) {
      setModalType('error')
      setModalMessage('Todos los campos son obligatorios.')
      setCustomModalVisible(true)
      return
    }

    const formData = new FormData()
    formData.append('descripcion', postText)
    formData.append('id_usuario', idUsuario.toString())

    if (selectedImage) {
      const fileName = selectedImage.split('/').pop() || 'image.jpg'
      const fileType = fileName.split('.').pop() || 'jpg'

      formData.append('imagen', {
        uri: selectedImage,
        name: 'post_image.jpg',
        type: `image/${fileType}`,
      } as any)
    }

    try {
      const response = await fetch(`${API_URL}api/post/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      })
      const data = await response.json()

      if (response.ok) {
        setCustomModalVisible(true) // Muestra la modal de éxito
        setPostText('')
        setSelectedImage(null)

        // Recargar la lista de posts
        setCurrentPage(1) // Reiniciar la paginación
        setPosts([]) // Limpiar los posts existentes
        fetchPosts() // Volver a cargar los posts

        setTimeout(() => {
          setCustomModalVisible(false)
        }, 3000) // Cierra la modal automáticamente después de 3 segundos
      } else if (data.message === 'No puedes realizar publicaciones') {
        setBannedModalVisible(true)
      } else {
        Alert.alert('Error', data.message || 'Error desconocido')
      }
    } catch (error) {
      console.error('Error al crear post:', error)
      Alert.alert('Error', 'Ocurrió un error al crear el post.')
    }
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={dashboard_styles.background}
    >
      <View style={noticias_styles.subcontainer}>
        <TouchableOpacity
          style={noticias_styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={noticias_styles.backText}>Regresar</Text>
        </TouchableOpacity>
        <Text style={noticias_styles.tituloNoticia}>Conéctate</Text>
      </View>
      <TouchableOpacity
        style={styles.createPostButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.createPostText}>Crear Post </Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={reporte_styles.modalOverlay}>
          <View style={reporte_styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={reporte_styles.header}>
                <Text style={reporte_styles.headerTitle}>Nuevo POST</Text>
              </View>
              <View style={reporte_styles.form}>
                <View style={reporte_styles.inputGroup}>
                  <Text style={reporte_styles.label}>Descripcion </Text>
                  <TextInput
                    style={reporte_styles.input}
                    placeholder="Escribe tu publicación"
                    value={postText}
                    onChangeText={setPostText}
                  />
                </View>
                <View style={reporte_styles.imageSection}>
                  <Text style={reporte_styles.label}>Imagen</Text>
                  <TouchableOpacity
                    style={reporte_styles.imageButton}
                    onPress={handleTakePhoto}
                  >
                    <Ionicons name="camera" size={24} color="#fff" />
                    <Text style={reporte_styles.buttonText}>Tomar Foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={reporte_styles.imageButton}
                    onPress={handleSelectImage}
                  >
                    <Ionicons name="image" size={24} color="#fff" />
                    <Text style={reporte_styles.buttonText}>
                      Seleccionar desde Galería
                    </Text>
                  </TouchableOpacity>
                  {selectedImage ? (
                    <Image
                      source={{
                        uri: selectedImage,
                      }}
                      style={reporte_styles.previewImage}
                    />
                  ) : (
                    <View style={reporte_styles.imagePlaceholder}>
                      <MaterialIcons name="image" size={40} color="#ccc" />
                      <Text style={reporte_styles.placeholderText}>
                        Vista previa de imagen
                      </Text>
                    </View>
                  )}
                </View>

                <View style={reporte_styles.footer}>
                  <TouchableOpacity
                    style={reporte_styles.createButton}
                    onPress={handleCreatePost}
                  >
                    <Text style={reporte_styles.createButtonText}>
                      Publicar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={reporte_styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={reporte_styles.cancelButtonText}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 🔹 Modal de mensajes */}
      <CustomModal
        visible={customModalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setCustomModalVisible(false)}
      />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  postContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  postContent: {
    flex: 1,
  },
  author: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
  description: {
    fontSize: 14,
    marginTop: 5,
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginTop: 10,
  },
  createPostButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    margin: 10,
  },
  createPostText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'white',
  },
})
