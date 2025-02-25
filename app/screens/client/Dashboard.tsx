import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import getLogoByIdPartido from '@/app/constants/logoPartidos'
import colors from '@/app/constants/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { decode as atob } from 'base-64'
import LoadingSpinner from '@/app/components/loadingSpinner'
import Banners from '@/app/components/banners'
import HamburgerMenu from '@/app/components/HamburgerMenu'

//styles
import dashboard_styles from '@/app/styles/dashboardStyle'

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [idUsuario, setIdUsuario] = useState<number | null>(null)
  const [idPartido, setIdPartido] = useState<number | null>(null)
  const [userName, setUserName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [userPhoto, setUserPhoto] = useState('')
  const [userEmail, setUserEmail] = useState('')

  console.log(userData?.id_usuario)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken') // Verificar que 'userToken' es la clave correcta

        if (!token) {
          console.error('❌ No se encontró un token almacenado')
          return
        }

        console.log('✅ Token obtenido:', token)

        const payload = JSON.parse(atob(token.split('.')[1]))

        if (!payload.id || !payload.id_partido) {
          console.error('❌ Error: Token no contiene id de usuario o partido')
          return
        }

        console.log('🔹 ID Usuario:', payload.id)
        console.log('🔹 ID Partido:', payload.id_partido)

        setIdUsuario(payload.id)
        setIdPartido(payload.id_partido)
        setUserName(
          `${payload.nombre} ${payload.a_paterno} ${payload.a_materno}` ||
            'Usuario'
        )
        setUserEmail(payload.correo || '')

        setPhoneNumber(payload.telefono)
        setUserPhoto(payload.foto_perfil || '')

        setUserData(payload) // Guardar todos los datos del usuario
        setLoading(false)
      } catch (error) {
        console.error('❌ Error al obtener los datos del usuario:', error)
      }
    }

    fetchUserData()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          const storedUserData = await AsyncStorage.getItem('userData')

          if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData)
            setUserName(
              `${parsedUserData.nombre} ${parsedUserData.apellidoPaterno} ${parsedUserData.apellidoMaterno}`
            )
            setUserPhoto(parsedUserData.photoUrl)
          }
        } catch (error) {
          console.error('❌ Error al cargar datos actualizados:', error)
        }
      }

      fetchUserData()
    }, []) // Se ejecuta cuando el Dashboard vuelve a estar en foco
  )

  if (loading) {
    return (
      <View style={dashboard_styles.loadingContainer}>
        <LoadingSpinner text="Cargando Dashboard..." color="#FFD700" />
      </View>
    )
  }

  // 🔥 Obtener color según el partido del usuario
  const partidoColors =
    colors[userData?.nombre_partido as keyof typeof colors] || colors.LIKEPHONE

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={dashboard_styles.background}
    >
      <HamburgerMenu
        idUsuario={idUsuario}
        idPartido={idPartido}
        userName={userName}
        userEmail={userEmail}
        phoneNumber={phoneNumber}
        userPhoto={userPhoto}
      />
      <View>
        <View style={dashboard_styles.header}>
          <Image
            source={require('../../assets/logo_partidos/unidosPt.png')}
            style={dashboard_styles.logo}
          />
        </View>

        <View style={dashboard_styles.profileContainer}>
          <Image
            source={{ uri: userPhoto }}
            style={dashboard_styles.profileImage}
          />
          <Text style={dashboard_styles.userName}>¡Hola {userName}!</Text>
          <Text style={dashboard_styles.phoneNumber}>{phoneNumber}</Text>
        </View>
        <View style={dashboard_styles.divider} />
        {/* Botones principales */}
        <View style={dashboard_styles.buttonRow}>
          <TouchableOpacity
            style={[
              dashboard_styles.mainButton,
              { backgroundColor: partidoColors.primary },
            ]}
            onPress={() => {
              if (idUsuario && idPartido) {
                router.push({
                  pathname: '/screens/client/Noticias',
                  params: {
                    idUsuario: idUsuario.toString(),
                    idPartido: idPartido.toString(),
                  },
                })
              } else {
                console.error(
                  '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                )
              }
            }}
          >
            <View style={dashboard_styles.headerIcons}>
              <Image
                source={require('../../assets/iconos/NOTICIASPT.png')}
                style={dashboard_styles.iconos}
              />
            </View>
            <Text style={dashboard_styles.buttonText}>Noticias </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              dashboard_styles.mainButton,
              { backgroundColor: partidoColors.primary },
            ]}
            onPress={() => {
              if (idUsuario && idPartido) {
                router.push({
                  pathname: '/screens/client/Reporte',
                  params: {
                    idUsuario: idUsuario.toString(),
                    idPartido: idPartido.toString(),
                  },
                })
              } else {
                console.error(
                  '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                )
              }
            }}
          >
            <View style={dashboard_styles.headerIcons}>
              <Image
                source={require('../../assets/iconos/REPORTECIUDADANO.png')}
                style={dashboard_styles.iconos}
              />
            </View>
            <Text style={dashboard_styles.buttonText}>Reporte ciudadano</Text>
          </TouchableOpacity>
        </View>

        {/* Botones secundarios */}
        {/* Botones secundarios en 3x3 */}
        <View style={dashboard_styles.buttonGrid}>
          <TouchableOpacity
            style={dashboard_styles.secondaryButton}
            onPress={() => {
              if (idUsuario && idPartido) {
                router.push({
                  pathname: '/screens/client/Promociones',
                  params: {
                    idUsuario: idUsuario.toString(),
                    idPartido: idPartido.toString(),
                  },
                })
              } else {
                console.error(
                  '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                )
              }
            }}
          >
            <View style={dashboard_styles.headerIcons}>
              <Image
                source={require('../../assets/iconos/PROMOCIONESYDESCUENTOS.png')}
                style={dashboard_styles.iconos}
              />
            </View>
            <Text style={dashboard_styles.secondaryButtonText}>
              Promociones y descuentos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={dashboard_styles.secondaryButton}
            onPress={() => {
              if (idUsuario && idPartido) {
                router.push({
                  pathname: '/screens/client/Directorio',
                  params: {
                    idUsuario: idUsuario.toString(),
                    idPartido: idPartido.toString(),
                  },
                })
              } else {
                console.error(
                  '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                )
              }
            }}
          >
            <View style={dashboard_styles.headerIcons}>
              <Image
                source={require('../../assets/iconos/DIRECTORIODESERVICIOS.png')}
                style={dashboard_styles.iconos}
              />
            </View>
            <Text style={dashboard_styles.secondaryButtonText}>
              Directorio Servicios
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={dashboard_styles.secondaryButton}
            onPress={() => {
              if (idUsuario && idPartido) {
                router.push({
                  pathname: '/screens/client/Conectate',
                  params: {
                    idUsuario: idUsuario.toString(),
                    idPartido: idPartido.toString(),
                  },
                })
              } else {
                console.error(
                  '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                )
              }
            }}
          >
            <View style={dashboard_styles.headerIcons}>
              <Image
                source={require('../../assets/iconos/CONECTATE.png')}
                style={dashboard_styles.iconos}
              />
            </View>
            <Text style={dashboard_styles.secondaryButtonText}>Conéctate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={dashboard_styles.secondaryButton}
            onPress={() => {
              if (idUsuario && idPartido) {
                router.push({
                  pathname: '/screens/client/Invitacion',
                  params: {
                    idUsuario: idUsuario.toString(),
                    idPartido: idPartido.toString(),
                  },
                })
              } else {
                console.error(
                  '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                )
              }
            }}
          >
            <View style={dashboard_styles.headerIcons}>
              <Image
                source={getLogoByIdPartido(userData?.id_partido)}
                style={dashboard_styles.iconos}
              />
            </View>
            <Text style={dashboard_styles.secondaryButtonText}>
              Invita a ser parte de
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={dashboard_styles.secondaryButton}
            onPress={() => {
              if (idUsuario && idPartido) {
                router.push({
                  pathname: '/screens/client/Recargas',
                  params: {
                    idUsuario: idUsuario.toString(),
                    idPartido: idPartido.toString(),
                  },
                })
              } else {
                console.error(
                  '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                )
              }
            }}
          >
            <View style={dashboard_styles.headerIcons}>
              <Image
                source={require('../../assets/iconos/RECARGAAQUI.png')}
                style={dashboard_styles.iconos}
              />
            </View>
            <Text style={dashboard_styles.secondaryButtonText}>Recargas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={dashboard_styles.secondaryButton}
            onPress={() => {
              if (idUsuario && idPartido) {
                router.push({
                  pathname: '/screens/client/ConsultarSaldo',
                  params: {
                    idUsuario: idUsuario.toString(),
                    idPartido: idPartido.toString(),
                    userName: encodeURIComponent(userName), // Enviamos el nombre completo
                  },
                })
              } else {
                console.error(
                  '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                )
              }
            }}
          >
            <View style={dashboard_styles.headerIcons}>
              <Image
                source={require('../../assets/iconos/CONSULTAR SALDO.png')}
                style={dashboard_styles.iconos}
              />
            </View>
            <Text style={dashboard_styles.secondaryButtonText}>
              Consultar Saldo
            </Text>
          </TouchableOpacity>
        </View>
        {/* Componente de Banners */}
        <Banners idPartido={Number(idPartido)} />
      </View>
    </ImageBackground>
  )
}
