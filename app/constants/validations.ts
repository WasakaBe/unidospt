const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^\d{10}$/
  if (!phoneRegex.test(phone)) {
    return 'El teléfono debe contener 10 dígitos numéricos.'
  }
  return null
}

const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }
  return null
}
// ✅ Nueva validación para nombre completo
const validateFullName = (name: string): string | null => {
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,50}$/ // Letras y espacios, entre 5 y 50 caracteres
  if (!nameRegex.test(name)) {
    return 'El nombre debe contener solo letras y espacios, y tener entre 5 y 50 caracteres.'
  }
  return null
}

// ✅ Nueva validación para correo electrónico
const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Debe ingresar un correo electrónico válido.'
  }
  return null
}
// ✅ Exportación nombrada + default export
// ✅ Exportación nombrada + default export
export { validatePhone, validatePassword, validateFullName, validateEmail }
export default {
  validatePhone,
  validatePassword,
  validateFullName,
  validateEmail,
}
