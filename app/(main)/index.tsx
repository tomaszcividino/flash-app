import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { Alert, Pressable, SafeAreaView, StyleSheet, Text } from 'react-native'

export default function Home() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken')
      Alert.alert('Logged Out', 'You have been successfully logged out.')

      queryClient.setQueryData(['isUserLoggedIn'], false)

      router.replace('/(welcome)/')
    } catch (error) {
      console.error('Error logging out: ', error)
      Alert.alert('Logout Error', 'There was an error logging you out. Please try again.')
    }
  }

  const isUserLoggedIn = queryClient.getQueryData(['isUserLoggedIn'])
  console.log(isUserLoggedIn, 'from main')

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>
      <Text style={styles.description}>This is the main screen in the drawer layout.</Text>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FF3D00', // Customize the button color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
})
