// constants/logoPartidos.ts
const getLogoByIdPartido = (idPartido: number) => {
  switch (idPartido) {
    case 1:
      return require('../assets/logo_partidos/pan.jpg')
    case 2:
      return require('../assets/logo_partidos/pri.jpg')
    case 3:
      return require('../assets/logo_partidos/morena.jpg')
    case 4:
      return require('../assets/logo_partidos/logo_porti.png')
    case 5:
      return require('../assets/logo_partidos/pt.jpg')
    default:
      return require('../assets/logo_partidos/icono.png') // Logo genérico o predeterminado
  }
}

export default getLogoByIdPartido
