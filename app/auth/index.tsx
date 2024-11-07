import { LoginScreen } from '@/screens/authentication/LoginScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'

export default function login() {
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    if (password === 'ppp') {
      await AsyncStorage.setItem('isLoggedIn', 'true')

      const profileVisited = await AsyncStorage.getItem('profileVisited')

      if (profileVisited === 'true') {
        router.replace('/home')
      } else {
        router.push('/home')
      }
    } else {
      alert('Incorrect password!')
    }
  }

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
