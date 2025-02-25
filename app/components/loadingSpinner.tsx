import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
//interfaces
import { LoadingSpinnerProps } from '../utils/interface'

const { width } = Dimensions.get('window')

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = 'Cargando...',
  color = '#0A1931',
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const opacityAnim = useRef(new Animated.Value(0.6)).current

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        // Rotación continua
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // Efecto de pulso
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        // Efecto de fade
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start()
  }, [])

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <BlurView intensity={20} style={styles.container}>
      <View style={styles.content}>
        <LinearGradient
          colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
          style={styles.gradientContainer}
        >
          <Animated.View
            style={[
              styles.spinnerContainer,
              {
                transform: [{ rotate: spin }, { scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <LinearGradient
              colors={[color, 'rgba(255,255,255,0.5)']}
              style={styles.spinner}
            />
          </Animated.View>
          <Animated.Text
            style={[
              styles.loadingText,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {text}
          </Animated.Text>
        </LinearGradient>
      </View>
    </BlurView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    width: width * 0.4,
    aspectRatio: 1,
    maxWidth: 200,
    maxHeight: 200,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(10, 25, 49, 0.95)',
  },
  spinnerContainer: {
    width: '60%',
    aspectRatio: 1,
    marginBottom: 15,
  },
  spinner: {
    flex: 1,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'transparent',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
})

export default LoadingSpinner
