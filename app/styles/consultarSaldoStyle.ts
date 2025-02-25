import { StyleSheet } from 'react-native'

const consulta_saldo_styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  bannerLike: {
    width: 400,
    height: 200,
    objectFit: 'fill',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    marginTop: 16,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
  },
  planContainer: {
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: '#7f7ff183',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  expirationContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  expirationTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 24,
  },
  expirationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  expirationsubDetails: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  date: {
    fontSize: 30,
    color: 'blue',
    fontWeight: 'bold',
  },
  month: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  daysLeft: {
    fontSize: 22,
    color: 'blue',
    fontWeight: 'bold',
  },
  usageContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  usageTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  usageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  usageText: {
    fontSize: 14,
    textAlign: 'right',
    color: '#777',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  footerText: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 20,
  },
})

export default consulta_saldo_styles
