// Para formatear fecha Ejem: 15 febrero del 2025
const formatDate = (dateString: string): { day: number; monthYear: string } => {
  const months: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  const date: Date = new Date(dateString) // Convertir la cadena en un objeto de fecha
  const day: number = date.getDate() // Obtener el día
  const month: string = months[date.getMonth()] // Obtener el mes
  const year: number = date.getFullYear() // Obtener el año

  return { day, monthYear: `${month} del ${year}` }
}

// Para calcular días Ejem: 8 Días
const calcularDiasRestantes = (fechaObjetivo: string | Date): number => {
  const hoy: Date = new Date() // Obtener la fecha actual
  hoy.setHours(0, 0, 0, 0) // Establecer a medianoche para evitar diferencias de horas

  const objetivo: Date = new Date(fechaObjetivo)
  objetivo.setHours(0, 0, 0, 0) // Ajustar a medianoche

  // Calcular la diferencia en milisegundos y convertir a días
  const diferencia: number =
    (objetivo.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)

  return Math.max(Math.ceil(diferencia), 0) // Devolver el número de días restantes, asegurando que no sea negativo
}

// Convierte a GB
const convertirAGB = (mb: number): string => {
  if (!mb || isNaN(mb)) return '0 GB' // Validación para evitar errores

  const gb: number = mb / 1024 // 1 GB = 1024 MB
  return gb.toFixed(1) // Redondear a 1 decimal
}

const restarSinRetorno = (a: number, b: number): number => {
  return a - b
}

export { formatDate, calcularDiasRestantes, convertirAGB, restarSinRetorno }
