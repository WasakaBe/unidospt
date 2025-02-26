import React from 'react'
import { WebView } from 'react-native-webview'
import { useLocalSearchParams } from 'expo-router'

export default function WebViewScreen() {
  const { cv_plan, phoneNumber } = useLocalSearchParams<{
    cv_plan: string
    phoneNumber: string
  }>()

  return (
    <WebView
      originWhitelist={['*']}
      source={{
        uri: `https://likephone.mx/api/AppLikephoneTarjeta/${cv_plan}/${phoneNumber}`,
      }}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={(event) => {
        const { data } = event.nativeEvent
        console.log(data) // Manejar la respuesta del WebView
      }}
    />
  )
}
