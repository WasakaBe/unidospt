import { StyleSheet } from 'react-native'

const dashboard_styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
    zIndex: 100,
  },
  header: {
    width: 300,
    height: 100,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  divider: {
    width: '80%',
    height: 2,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    alignSelf: 'center',
  },
  headerIcons: {
    width: 100,
    height: 100,
    alignItems: 'center',
    marginBottom: 5,
  },
  iconos: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
    alignSelf: 'center',
  },
  mainButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    height: 150,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 5,
  },
  buttonGrid: {
    width: '90%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  secondaryButton: {
    width: '30%', // 🔥 Asegura que haya 3 botones por fila
    backgroundColor: '#9f9898',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // 🔥 Mantiene el fondo semi-transparente
  },
})
export default dashboard_styles
