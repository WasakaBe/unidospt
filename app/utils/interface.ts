export interface Banner {
  id_imagen: number
  fecha_subida: string
  ruta_imagen: string
}

export interface CustomModalProps {
  visible: boolean
  type: 'success' | 'error' | 'ban'
  message: string
  onClose: () => void
  duration?: number
}

export interface HamburgerMenuProps {
  idUsuario: number | null
  idPartido: number | null
  userName: string
  userEmail: string
  phoneNumber: string
  userPhoto: string
}

export interface LoadingSpinnerProps {
  text?: string
  color?: string
}

export interface LocationData {
  latitude: number
  longitude: number
}

export interface Post {
  id_contenido: number
  usuario: string
  descripcion: string
  fecha_publicacion: string
  foto_perfil: string
  nombre_partido: string
  ruta_imagen: string
  id_partido: number
  usuario_reaccion: string | null // Campo de la API
  tipo_reaccion: string | null // Campo de la API
  reacciones: { tipo_reaccion: string; id_usuario: number }[] // Campo adicional para el frontend
}

export interface Comment {
  id: number
  id_contenido: number
  usuario: string
  fotoPerfil: string
  comentario: string
  fecha_comentario: string
  tiempo_transcurrido: string
}

export interface TipoServicio {
  id: number
  nombre: string
}

export interface DirectorioItem {
  id: number
  nombre: string
  apellido_paterno?: string
  apellido_materno?: string
  foto_perfil?: string
  nombre_servicio?: string
  descripcion?: string
  telefono?: string
  direccion_usuario?: string
}

export interface Noticia {
  NoticiaID: number
  Titulo: string
  Descripcion: string
  ImagenesAsociadas: string[]
  TipoNoticia: string
  NombrePartido: string
  TotalComentarios: number
  TotalReacciones: number
  reacciones?: Reaccion[] // 🔹 Se tipa explícitamente
}

export interface Reaccion {
  id_usuario: number
  tipo_reaccion: string
}

export interface Promo {
  idPromocion: number
  logo: string
  nombreNegocio: string
  tituloPromocion: string
  descripcionPromocion: string
  detalles: string
}

export interface LoginProps {
  onLogin?: (phone: string, password: string) => void
  onForgotPassword?: () => void
  onCreateAccount?: () => void
}
