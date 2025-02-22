import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
  Image,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import index_styles from './styles/indexStyle'
import { useRouter } from 'expo-router'

export default function Index() {
  const router = useRouter() // Hook para manejar la navegación

  const titleAnimation = useRef(new Animated.Value(0)).current
  const buttonAnimation = useRef(new Animated.Value(0)).current
  const buttonScale = useRef(new Animated.Value(1)).current
  const glowAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()

    // Animación continua del brillo
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [])

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start()
  }

  return (
    <View style={index_styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0A1931', '#0A1931', '#000000']}
        style={index_styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <BlurView intensity={20} style={index_styles.blurContainer}>
          <Image source={require('./assets/logo_partidos/logo_porti.png')} />
          <Animated.View
            style={[
              index_styles.titleContainer,
              {
                opacity: titleAnimation,
                transform: [
                  {
                    translateY: titleAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={index_styles.title}>
              Bienvenido a nuestra mejor red
            </Text>
            <Animated.View
              style={[
                index_styles.underline,
                {
                  opacity: glowAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ]}
            />
          </Animated.View>

          <Animated.View
            style={[
              index_styles.buttonContainer,
              {
                opacity: buttonAnimation,
                transform: [
                  {
                    translateY: buttonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                  { scale: buttonScale },
                ],
              },
            ]}
          >
            <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => router.push('/screens/public/Login')}
              style={index_styles.button}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={index_styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="rocket" size={24} color="#FFFFFF" />
                <Text style={index_styles.buttonText}>Explorar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </BlurView>
      </LinearGradient>
    </View>
  )
}
