const partidoBackgrounds = {
  pan: require('../assets/fondo_partidos/pan.png'),
  pri: require('../assets/fondo_partidos/pri.png'),
  morena: require('../assets/fondo_partidos/morena.png'),
  fondoXti: require('../assets/fondo_partidos/fondo_xti.png'),
  unidosPt: require('../assets/fondo_partidos/unidos_pt.png'),
}

// Función para obtener el fondo según el id_partido
const getBackgroundByIdPartido = (idPartido: number) => {
  switch (idPartido) {
    case 1:
      return partidoBackgrounds.pan
    case 2:
      return partidoBackgrounds.pri
    case 3:
      return partidoBackgrounds.morena
    case 4:
      return partidoBackgrounds.fondoXti
    case 5:
      return partidoBackgrounds.unidosPt
    default:
      return partidoBackgrounds.fondoXti // Fondo predeterminado
  }
}
export default getBackgroundByIdPartido
