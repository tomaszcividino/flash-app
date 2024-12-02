import { LoginScreen } from '@/screens/authentication/LoginScreen'
import { SafeAreaView, StyleSheet } from 'react-native'

export default function login() {
  return (
    <SafeAreaView style={styles.container}>
      <LoginScreen />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    marginBottom: 20
  }
})
