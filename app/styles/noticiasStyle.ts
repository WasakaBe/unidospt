import { Dimensions, StyleSheet } from 'react-native'
const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.92
const noticias_styles = StyleSheet.create({
  tituloNoticia: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    width: width / 2,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  subcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
  },
  logo: {
    width: 130,
    height: 30,
    alignSelf: 'center',
    marginBottom: 20,
  },
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: width * 0.04,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 350,
    width: '100%',
  },
  image: {
    width: width,
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  partidoBadge: {
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  fecha: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    lineHeight: 28,
  },
  descripcion: {
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 22,
  },
  descripcionCollapsed: {
    marginBottom: 8,
  },
  expandButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  expandButtonText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  interactionText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },

  //aquui van los estilos de la modal de comentarios
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CE1126',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
  },
  commentsList: {
    flex: 1,
  },
  commentContainer: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  username: {
    fontWeight: 'bold',
    marginLeft: 12,
    marginRight: 12,
    color: '#333',
  },
  commentText: {
    color: '#333',
    flex: 1,
  },
  commentFooter: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
    marginRight: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    marginLeft: 12,
  },
  publishButton: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishButtonDisabled: {
    opacity: 0.5,
    backgroundColor: 'white',
  },
  publishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  publishButtonTextDisabled: {
    color: '#999',
  },

  //estilos del view donde muestra el texto que no hay comentarios
  containerNoText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  iconNoText: { marginBottom: 16, opacity: 0.9 },
  mainText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
})

export default noticias_styles
