import { useRouter } from 'expo-router'
import { Button, SafeAreaView, StyleSheet } from 'react-native'

import { palette } from '@/constants/palette'
import AsyncStorage from '@react-native-async-storage/async-storage'

const HomeScreen = () => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('isLoggedIn')
      await AsyncStorage.removeItem('accessToken')
      await AsyncStorage.removeItem('profileVisited')
      await AsyncStorage.removeItem('teamId')

      router.replace('/auth')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.colors.white
  }
})

export default HomeScreen
