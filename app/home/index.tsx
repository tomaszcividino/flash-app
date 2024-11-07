import { CustomText } from '@/components/typography/CustomText'
import { palette } from '@/constants/palette'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React from 'react'
import { Button, SafeAreaView, StyleSheet } from 'react-native'

const HomeScreen = () => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('isLoggedIn')
      // await AsyncStorage.removeItem('profileVisited')
      await AsyncStorage.removeItem('welcomeScreenVisited')

      router.replace('/auth')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomText style={{ fontSize: 30, marginTop: 16, marginBottom: 8, paddingLeft: 20 }}>Your Screens</CustomText>
      <CustomText style={{ fontSize: 15, paddingLeft: 20 }}>Connect to Screen to update playlist</CustomText>
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
