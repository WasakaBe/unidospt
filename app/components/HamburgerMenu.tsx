import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialIcons, Feather } from '@expo/vector-icons'

interface HamburgerMenuProps {
  idUsuario: number | null
  idPartido: number | null
  userName: string
  userEmail: string
  phoneNumber: string
  userPhoto: string
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  idUsuario,
  idPartido,
  userName,
  userEmail,
  phoneNumber,
  userPhoto,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const router = useRouter()
  const slideAnim = useState(new Animated.Value(-300))[0]

  const toggleMenu = () => {
    const toValue = isMenuVisible ? -300 : 0
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start()
    setIsMenuVisible(!isMenuVisible)
  }

  const handleLogout = async () => {
    try {
      // Eliminar el token de AsyncStorage
      await AsyncStorage.removeItem('userToken')
      console.log('✅ Sesión cerrada correctamente')

      // Redirigir al usuario a la pantalla de login
      router.replace('/screens/public/Login')
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error)
    }
  }

  return (
    <View style={styles.container}>
      {/* Botón para abrir el menú */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <MaterialIcons
          name={isMenuVisible ? 'close' : 'menu'}
          size={32}
          color="#333"
        />
      </TouchableOpacity>

      {/* Modal que actúa como menú */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <Animated.View
            style={[
              styles.menuPanel,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={styles.menuContent}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  if (idUsuario && idPartido) {
                    router.push({
                      pathname: '/screens/client/Perfil',
                      params: {
                        idUsuario: idUsuario.toString(),
                        idPartido: idPartido.toString(),
                        userName,
                        userEmail,
                        phoneNumber,
                        userPhoto,
                      },
                    })
                    toggleMenu() // Cerrar el menú después de navegar
                  } else {
                    console.error(
                      '❌ No se puede navegar: idUsuario o idPartido no están definidos'
                    )
                  }
                }}
              >
                <Feather name="user" size={24} color="#333" />
                <Text style={styles.menuText}>Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Feather name="log-out" size={24} color="#FF4444" />
                <Text style={[styles.menuText, styles.logoutText]}>
                  Cerrar Sesión
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1003, // Asegúrate de que el botón esté por encima del Modal
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: '100%',
    backgroundColor: 'white',
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuContent: {
    marginTop: 100,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FFF5F5',
  },
  logoutText: {
    color: '#FF4444',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1001,
  },
})

export default HamburgerMenu
