import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
//interfaces
import { LocationData } from '../utils/interface'

export default function useMediaAndLocation() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)

  // Función para tomar una foto
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

  // Función para seleccionar una imagen de la galería
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

  // Función para obtener la ubicación actual
  const handleGetLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== 'granted') {
      alert(
        'Se requiere acceso a la ubicación para obtener la posición actual.'
      )
      return
    }

    const locationResult = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    })

    setLocation({
      latitude: locationResult.coords.latitude,
      longitude: locationResult.coords.longitude,
    })
  }

  return {
    selectedImage,
    setSelectedImage,
    location,
    setLocation,
    handleTakePhoto,
    handleSelectImage,
    handleGetLocation,
  }
}
