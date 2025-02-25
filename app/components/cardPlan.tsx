import React from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

// Definir los tipos para las propiedades del plan y las funciones
interface Plan {
  imagen_movil1: string
  nombre_comercial: string
  datos: string // Se asume que viene como string, ya que se usa parseInt
  vigencia: string // Se asume que incluye caracteres no numéricos
  monto: number
}

interface CardPlanProps {
  plan: Plan
  onViewDetails: (plan: Plan) => void
}

const CardPlan: React.FC<CardPlanProps> = ({ plan, onViewDetails }) => {
  return (
    <View style={styles.card}>
      {/* Imagen del producto */}
      <Image
        source={{
          uri: `https://crm.likephone.mx/public/img/${plan.imagen_movil1}`,
        }}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Detalles del producto */}
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {plan.nombre_comercial}
        </Text>
        <Text style={styles.size}>
          {(parseInt(plan.datos, 10) / 1000).toFixed(0)}GB por{' '}
          {plan.vigencia.replace(/\D/g, '')} Días
        </Text>
        <Text style={styles.price}>${plan.monto}</Text>
      </View>

      {/* Botón para ver detalles 
      <TouchableOpacity
        style={styles.button}
        onPress={() => onViewDetails(plan)}
      >
        <Text style={styles.buttonText}>Detalles</Text>
      </TouchableOpacity>*/}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 13,
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    alignItems: 'center',
  },
  image: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 10,
    marginRight: 20,
    backgroundColor: '#f9f9f9',
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  size: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
})

export default CardPlan
