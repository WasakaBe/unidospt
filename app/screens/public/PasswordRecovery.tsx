import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import login_styles from '@/app/styles/loginStyle'
import { API_URL } from '@env'
import CustomModal from '@/app/components/customModal'
import { ActivityIndicator } from 'react-native-paper'
export default function PasswordRecovery() {
  const router = useRouter()
  const [useEmail, setUseEmail] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [step, setStep] = useState(1) // 1: ingresar correo/teléfono, 2: validar token

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  // Estado del modal
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'success' | 'error' | 'ban'>(
    'success'
  )
  const [modalMessage, setModalMessage] = useState('')

  // Función para mostrar el modal con el mensaje adecuado
  const showModal = (type: 'success' | 'error' | 'ban', message: string) => {
    setModalType(type)
    setModalMessage(message)
    setModalVisible(true)
  }

  const [keyboardVisible, setKeyboardVisible] = useState(false)
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    )
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    )

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start()

    return () => {
      keyboardWillShow.remove()
      keyboardWillHide.remove()
    }
  }, [])

  // Recuperación de contraseña (paso 1)
  const handleRecovery = async () => {
    if (!inputValue.trim()) {
      showModal(
        'error',
        `Por favor, ingrese su ${
          useEmail ? 'correo electrónico' : 'número telefónico'
        }.`
      )
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}api/userspartido/recover-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: useEmail ? 2 : 1,
            email: useEmail ? inputValue : null,
            telefono: useEmail ? null : inputValue,
          }),
        }
      )

      const data = await response.json()
      if (response.ok) {
        showModal('success', data.message)
        setStep(2) // Avanzar al paso de ingreso de token
      } else {
        console.log('Error', data.message || 'Ocurrió un error inesperado.')
      }
    } catch (error) {
      console.log('Error', 'No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  // Validación del token (paso 2)
  const handleValidateToken = async () => {
    if (!token.trim()) {
      showModal('error', 'Por favor, ingrese el token de validación.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}api/userspartido/validate-token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: useEmail ? inputValue : null,
            telefono: useEmail ? null : inputValue,
            token,
          }),
        }
      )

      const data = await response.json()
      if (response.ok) {
        showModal(
          'success',
          'Token validado correctamente. Ahora ingresa tu nueva contraseña.'
        )
        setStep(3) // Avanzar al paso de cambiar contraseña
      } else {
        showModal('error', data.message || 'Token incorrecto o expirado.')
      }
    } catch (error) {
      console.log('Error', 'No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  // Cambio de contraseña (paso 3)
  const handleChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      showModal('error', 'Por favor, ingrese ambas contraseñas.')
      return
    }

    if (newPassword !== confirmPassword) {
      showModal('error', 'Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}api/userspartido/change-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: useEmail ? inputValue : null,
            telefono: useEmail ? null : inputValue,
            nueva_contraseña: newPassword,
          }),
        }
      )

      const data = await response.json()
      if (response.ok) {
        showModal('success', 'Contraseña cambiada correctamente.')
        // Aquí podrías redirigir al usuario a la pantalla de inicio de sesión
        // **Redirige al Login después de 2 segundos**
        setTimeout(() => {
          setModalVisible(false)
          router.replace('/screens/public/Login') // Redirige a la pantalla de Login
        }, 2000)
      } else {
        showModal('error', data.message || 'Ocurrió un error.')
      }
    } catch (error) {
      console.log('Error', 'No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={login_styles.container}
    >
      <LinearGradient
        colors={['#0A1931', '#0A1931', '#000000']}
        style={login_styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <BlurView intensity={20} style={login_styles.blurContainer}>
          <Animated.View
            style={[
              login_styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={login_styles.titleContainer}>
              <Text style={login_styles.title}>
                {' '}
                {step === 1
                  ? 'Recuperar Contraseña'
                  : step === 2
                  ? 'Ingrese el Token'
                  : 'Ingrese su Nueva Contraseña'}
              </Text>
              <Animated.View style={login_styles.underline} />
            </View>

            <View style={login_styles.inputContainer}>
              <View style={login_styles.inputWrapper}>
                {step === 1 ? (
                  <TextInput
                    style={login_styles.input}
                    placeholder={
                      useEmail
                        ? 'Ingrese su correo electrónico'
                        : 'Ingrese su número telefónico'
                    }
                    placeholderTextColor="#aaa"
                    keyboardType={useEmail ? 'email-address' : 'phone-pad'}
                    value={inputValue}
                    onChangeText={setInputValue}
                  />
                ) : step === 2 ? (
                  <TextInput
                    style={login_styles.input}
                    placeholder="Ingrese el token de validación"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    value={token}
                    onChangeText={setToken}
                  />
                ) : (
                  <>
                    <TextInput
                      style={login_styles.input}
                      placeholder="Ingrese su nueva contraseña"
                      placeholderTextColor="#aaa"
                      secureTextEntry
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                    <TextInput
                      style={login_styles.input}
                      placeholder="Ingrese nuevamente la contraseña"
                      placeholderTextColor="#aaa"
                      secureTextEntry
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                  </>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={
                step === 1
                  ? handleRecovery
                  : step === 2
                  ? handleValidateToken
                  : handleChangePassword
              }
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? <ActivityIndicator color="#fff" /> : 'Continuar'}
              </Text>
            </TouchableOpacity>
            {step === 1 && (
              <TouchableOpacity onPress={() => setUseEmail(!useEmail)}>
                <Text style={styles.switchText}>
                  {useEmail
                    ? 'Recuperar por medio de teléfono'
                    : 'Recuperar por medio de correo'}
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </BlurView>
      </LinearGradient>

      {/* Modal de mensajes */}
      <CustomModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    color: '#fff',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#ff7f50',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
})
