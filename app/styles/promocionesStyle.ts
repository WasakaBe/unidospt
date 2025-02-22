import { StyleSheet } from 'react-native'

const promocion_styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  ticketContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    maxWidth: 620,
    height: 250,
  },
  ticketEdge: {
    width: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  toothRight: {
    width: 25,
    height: 20,
    backgroundColor: 'red',
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    marginTop: -20,
    marginLeft: -5,
  },
  toothLeft: {
    width: 25,
    height: 20,
    backgroundColor: 'red',
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    marginTop: -20,
  },
  mainContent: {
    padding: 15,
    alignItems: 'center',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#1a1a1a',
    letterSpacing: 2,
  },
  separatorTop: {
    height: 1,
    backgroundColor: 'yellow',
    marginVertical: 10,
    borderRadius: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  promoContainer: {
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 5,
    letterSpacing: 1,
  },
  promoHighlight: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#e63946',
    marginVertical: 5,
  },
  promoDescription: {
    fontSize: 14,
    color: '#666',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  detailsContainer: {
    marginVertical: 5,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dateText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
    width: 250,
    letterSpacing: 0.5,
  },
  ticketNumber: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginTop: 5,
    width: 150,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },

  //modal de ticket

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  ticketContainerModal: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    maxWidth: 320,
  },

  warningText: {
    fontSize: 16,
    color: '#e63946',
    marginVertical: 10,
    paddingHorizontal: 15,
    lineHeight: 22,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginVertical: 10,
  },
  logoModal: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  buttonModal: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 4,
    marginTop: 5,
    marginBottom: 5,
  },

  //estilos de la modal de confirmacion
  confirmContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  confirmButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 4,
    marginHorizontal: 10,
  },
  confirmButtonSi: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 4,
    marginHorizontal: 10,
  },
})

export default promocion_styles
