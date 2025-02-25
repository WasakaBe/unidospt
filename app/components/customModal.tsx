import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Vibration,
} from 'react-native'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons'
//interfaces
import { CustomModalProps } from '../utils/interface'
const { width } = Dimensions.get('window')

const getModalConfig = (type: 'success' | 'error' | 'ban') => {
  switch (type) {
    case 'success':
      return {
        icon: (size: number) => (
          <MaterialIcons name="check-circle" size={size} color="#4CAF50" />
        ),
        colors: ['#4CAF50', '#45a049'],
        borderColor: '#388E3C',
        title: '¡Éxito!',
      }
    case 'error':
      return {
        icon: (size: number) => (
          <MaterialIcons name="error" size={size} color="#F44336" />
        ),
        colors: ['#F44336', '#d32f2f'],
        borderColor: '#C62828',
        title: 'Error',
      }
    case 'ban':
      return {
        icon: (size: number) => (
          <FontAwesome5 name="ban" size={size} color="#FF9800" />
        ),
        colors: ['#FF9800', '#F57C00'],
        borderColor: '#EF6C00',
        title: 'Cuenta Suspendida',
      }
    default:
      return {
        icon: (size: number) => (
          <MaterialIcons name="info" size={size} color="#2196F3" />
        ),
        colors: ['#2196F3', '#1976D2'],
        borderColor: '#1565C0',
        title: 'Información',
      }
  }
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  type,
  message,
  onClose,
  duration = 3000,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.3)).current
  const modalConfig = getModalConfig(type)

  useEffect(() => {
    if (visible) {
      Vibration.vibrate(100)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start()

      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose()
        }, duration)
        return () => clearTimeout(timer)
      }
    }
  }, [visible])

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose()
    })
  }

  if (!visible) return null

  return (
    <Modal transparent visible={visible} animationType="none">
      <BlurView intensity={20} style={styles.container}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={[
              styles.modalContent,
              { borderColor: modalConfig.borderColor },
            ]}
          >
            <View style={styles.iconContainer}>{modalConfig.icon(50)}</View>

            <Text style={styles.title}>{modalConfig.title}</Text>
            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </BlurView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 25, 49, 0.95)',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 5,
    width: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
})

export default CustomModal
