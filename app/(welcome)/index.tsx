import { WelcomeScreen } from '@/screens/onboarding/welcome/WelcomeScreen'
import { SafeAreaView, StyleSheet } from 'react-native'

import palette from '@/constants/palette'

export default function WelcomeInitialScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <WelcomeScreen />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: palette.colors.white
  }
})
