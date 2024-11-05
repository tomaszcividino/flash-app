import { LoginScreen } from '@/screens/authentication/LoginScreen'
import { StyleSheet, View } from 'react-native'

export default function Authentication() {
  return (
    <View style={styles.container}>
      <LoginScreen />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
