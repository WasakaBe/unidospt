import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Animated,
  Modal,
  KeyboardAvoidingView,
  TextInput,
  Platform,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { API_URL } from '@env'
import LoadingSpinner from '@/app/components/loadingSpinner'
import dashboard_styles from '@/app/styles/dashboardStyle'
import noticias_styles from '@/app/styles/noticiasStyle'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  FontAwesome,
} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import Banners from '@/app/components/banners'
import CustomModal from '@/app/components/customModal'

export default function Noticias() {
  const router = useRouter() // ✅ Reemplazo de `navigation`
  const params = useLocalSearchParams()
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined

  const [loading, setLoading] = useState<boolean>(true)
  const [noticias, setNoticias] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const limit = 10

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedNoticia, setSelectedNoticia] = useState<any>(null)
  const [comentarios, setComentarios] = useState<any[]>([])
  const [loadingComentarios, setLoadingComentarios] = useState<boolean>(false)

  const [newComment, setNewComment] = useState('')
  const [reaccionesUsuario, setReaccionesUsuario] = useState<{
    [key: number]: boolean
  }>({})

  // Estados para el CustomModal
  const [modalMessage, setModalMessage] = useState<string>('')
  const [modalType, setModalType] = useState<'success' | 'error' | 'ban'>(
    'success'
  )
  const [customModalVisible, setCustomModalVisible] = useState(false)

  const lastFetchTime = useRef<number>(0) // 📌 Mueve el useRef aquí, fuera de useEffect

  const scaleAnim = useRef(new Animated.Value(1)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [])

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start()
  }

  useEffect(() => {
    let isMounted = true // Para evitar actualizar estado si el componente se desmonta

    const fetchNoticias = async () => {
      const now = Date.now()
      if (now - lastFetchTime.current < 10000) return // ⏳ Evita peticiones en menos de 10s

      try {
        console.log('📡 Obteniendo noticias...')
        const response = await fetch(
          `${API_URL}api/noticias/partido/${idPartido}?page=${page}&limit=${limit}`
        )
        const data = await response.json()

        if (isMounted && data.success && data.noticias) {
          setNoticias((prevNoticias) => {
            const noticiasIds = new Set(prevNoticias.map((n) => n.NoticiaID))
            const nuevasNoticias = data.noticias.filter(
              (n: any) => !noticiasIds.has(n.NoticiaID)
            )
            return nuevasNoticias.length > 0
              ? [...nuevasNoticias, ...prevNoticias]
              : prevNoticias
          })
          lastFetchTime.current = now // ✅ Guarda el tiempo de la última actualización
        }
      } catch (error) {
        console.error('❌ Error al obtener noticias:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchNoticias() // 📡 Carga inicial de noticias

    const interval = setInterval(fetchNoticias, 10000) // ⏳ Polling cada 30s

    return () => {
      isMounted = false
      clearInterval(interval) // 🧹 Limpia el intervalo al desmontar
    }
  }, [idPartido, page])

  // Función para obtener comentarios de una noticia específica
  const fetchComentarios = async (noticiaId: number) => {
    setLoadingComentarios(true)
    setComentarios([])
    setSelectedNoticia(noticiaId)
    setModalVisible(true)

    try {
      const response = await fetch(
        `${API_URL}api/noticias/comentarios/${noticiaId}?page=1&limit=10`
      )
      const data = await response.json()

      if (data.success) {
        setComentarios(data.comentarios)
      } else {
        console.warn('No se encontraron comentarios')
      }
    } catch (error) {
      console.error('Error al obtener comentarios:', error)
    } finally {
      setLoadingComentarios(false)
    }
  }
  // Función para manejar la publicación del comentario
  const handleAddComment = async () => {
    if (!newComment.trim()) return
    if (!idUsuario || !selectedNoticia) {
      console.error('❌ Error: idUsuario o selectedNoticia están indefinidos.')
      return
    }
    try {
      setLoadingComentarios(true)
      console.log(`📩 Enviando comentario: ${newComment}`)
      console.log(
        `🔍 idUsuario: ${idUsuario}, selectedNoticia: ${selectedNoticia}`
      )
      // Enviar comentario a la API
      const response = await fetch(
        `${API_URL}api/noticias/comentario/${selectedNoticia}/${idUsuario}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comentario: newComment,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el comentario')
      }

      // Agregar el nuevo comentario a la lista local
      const nuevoComentario = {
        ComentarioID: data.comentario.ComentarioID,
        idnoticia: data.comentario.idnoticia,
        id_usuario: data.comentario.id_usuario,
        NombreUsuario: data.comentario.NombreUsuario,
        Comentario: data.comentario.comentario,
        FechaComentario: data.comentario.FechaComentario,
      }

      setComentarios((prevComentarios) => [nuevoComentario, ...prevComentarios])
      setNewComment('') // Limpiar el campo después de agregar el comentario
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Error al enviar comentario:', error.message)
      } else {
        console.error('❌ Error desconocido al enviar comentario:', error)
      }
    } finally {
      setLoadingComentarios(false)
    }
  }

  const handleReaction = async (noticiaId: number) => {
    if (!idUsuario) {
      console.error('❌ Error: idUsuario no está definido.')
      return
    }

    // Verifica si el usuario ya reaccionó a esta noticia
    if (reaccionesUsuario[noticiaId]) {
      // Mostrar el modal si ya ha reaccionado
      setModalType('error')
      setModalMessage('Ya has reaccionado a esta noticia.')
      setCustomModalVisible(true)
      return
    }

    try {
      const response = await fetch(
        `${API_URL}api/noticias/reaccion/${noticiaId}/${idUsuario}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo_reaccion: 'love' }),
        }
      )

      const data = await response.json()

      if (!data.success) {
        setModalType('error')
        setModalMessage('Hubo un error al reaccionar. Inténtalo más tarde.')
        setCustomModalVisible(true)
        return
      }

      // Actualizar el estado de noticias y marcar que el usuario ya reaccionó
      setNoticias((prevNoticias) =>
        prevNoticias.map((noticia) =>
          noticia.NoticiaID === noticiaId
            ? { ...noticia, TotalReacciones: data.totalReacciones }
            : noticia
        )
      )

      // Marcar esta noticia como reaccionada por el usuario
      setReaccionesUsuario((prev) => ({ ...prev, [noticiaId]: true }))
      // Mostrar el modal de éxito
      setModalType('success')
      setModalMessage('¡Has reaccionado con éxito!')
      setCustomModalVisible(true)
    } catch (error) {
      console.error('❌ Error al registrar la reacción:', error)
      setModalType('error')
      setModalMessage('Error al procesar la reacción.')
      setCustomModalVisible(true)
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

        <Text style={noticias_styles.tituloNoticia}>Noticias</Text>

        {/* Logo del Partido */}
        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={noticias_styles.logo}
        />
      </View>

      {/* Componente de Banners */}
      <Banners idPartido={Number(idPartido)} />

      {loading ? (
        <LoadingSpinner text="Cargando noticias..." color="#FFD700" />
      ) : (
        <FlatList
          data={noticias}
          keyExtractor={(item) => item.NoticiaID.toString()}
          renderItem={({ item }) => (
            <Animated.View
              style={[
                noticias_styles.container,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <TouchableOpacity activeOpacity={0.97} onPress={handlePress}>
                <View style={noticias_styles.imageContainer}>
                  <Image
                    source={{ uri: item.ImagenesAsociadas[0] }}
                    style={noticias_styles.image}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={noticias_styles.gradient}
                  />
                  <View style={noticias_styles.badgeContainer}>
                    <View style={noticias_styles.badge}>
                      <FontAwesome5
                        name="newspaper"
                        size={12}
                        color="#FFF"
                        style={noticias_styles.badgeIcon}
                      />
                      <Text style={noticias_styles.badgeText}>
                        {item.TipoNoticia}
                      </Text>
                    </View>
                    {item.NombrePartido && (
                      <View
                        style={[
                          noticias_styles.badge,
                          noticias_styles.partidoBadge,
                        ]}
                      >
                        <FontAwesome5
                          name="shield-alt"
                          size={12}
                          color="#FFF"
                          style={noticias_styles.badgeIcon}
                        />
                        <Text style={noticias_styles.badgeText}>
                          {item.NombrePartido}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={noticias_styles.content}>
                  <Text style={noticias_styles.titulo}>{item.Titulo}</Text>
                  <Text style={noticias_styles.descripcion}>
                    {item.Descripcion}
                  </Text>

                  <View style={noticias_styles.footer}>
                    <TouchableOpacity
                      style={noticias_styles.interactionButton}
                      onPress={() => fetchComentarios(item.NoticiaID)}
                    >
                      <MaterialCommunityIcons
                        name="comment-outline"
                        size={22}
                        color="#4A90E2"
                      />
                      <Text style={noticias_styles.interactionText}>
                        {item.TotalComentarios}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={noticias_styles.interactionButton}
                      onPress={() => handleReaction(item.NoticiaID)}
                    >
                      <Ionicons
                        name={
                          reaccionesUsuario[item.NoticiaID]
                            ? 'heart'
                            : 'heart-outline'
                        } // Si reaccionó, cambia el icono
                        size={22}
                        color={
                          reaccionesUsuario[item.NoticiaID]
                            ? '#E74C3C'
                            : '#E74C3C'
                        } // Si reaccionó, el icono es rojo relleno
                      />
                      <Text style={noticias_styles.interactionText}>
                        {item.TotalReacciones}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}

      {/* Modal de comentarios */}
      {/* Modal de comentarios */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={noticias_styles.modalContainer}>
          <View style={noticias_styles.modalContent}>
            <View style={noticias_styles.modalHeader}>
              <Text style={noticias_styles.modalTitle}>Comentarios</Text>
              <TouchableOpacity
                style={noticias_styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#CE1126" />
              </TouchableOpacity>
            </View>

            {loadingComentarios ? (
              <LoadingSpinner text="Cargando comentarios..." color="#FFD700" />
            ) : (
              <FlatList
                data={comentarios}
                keyExtractor={(item) => item.ComentarioID.toString()}
                style={noticias_styles.commentsList}
                renderItem={({ item }) => (
                  <View style={noticias_styles.commentContainer}>
                    <FontAwesome name="user-circle" size={24} color="#000" />
                    <Text style={noticias_styles.username}>
                      {item.NombreUsuario} :
                    </Text>
                    <Text style={noticias_styles.commentText}>
                      {item.Comentario}
                    </Text>
                    <Text style={noticias_styles.timeAgo}>
                      {new Date(item.FechaComentario).toLocaleDateString(
                        'es-MX',
                        {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </Text>
                  </View>
                )}
                ListEmptyComponent={
                  <View style={noticias_styles.containerNoText}>
                    <MaterialCommunityIcons
                      name="chat-remove-outline"
                      size={64}
                      color="#CE1126"
                      style={noticias_styles.iconNoText}
                    />
                    <Text style={noticias_styles.mainText}>
                      No hay comentarios
                    </Text>
                    <Text style={noticias_styles.subText}>
                      Sé el primero en iniciar la conversación
                    </Text>
                  </View>
                }
              />
            )}

            {/* Input para agregar comentario */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={noticias_styles.inputContainer}
            >
              <FontAwesome name="user-circle" size={24} color="#000" />
              <TextInput
                style={noticias_styles.input}
                placeholder="Agregar un comentario..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity
                onPress={handleAddComment}
                disabled={!newComment.trim()}
                style={[
                  noticias_styles.publishButton,
                  !newComment.trim() && noticias_styles.publishButtonDisabled,
                ]}
              >
                <Text
                  style={[
                    noticias_styles.publishButtonText,
                    !newComment.trim() &&
                      noticias_styles.publishButtonTextDisabled,
                  ]}
                >
                  Publicar
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>

      {/* Custom Modal */}
      <CustomModal
        visible={customModalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setCustomModalVisible(false)}
      />
    </ImageBackground>
  )
}
