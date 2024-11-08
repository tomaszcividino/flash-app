import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text } from 'react-native'

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [isWelcomeVisited, setIsWelcomeVisited] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const welcomeVisited = await AsyncStorage.getItem('welcomeScreenVisited')
        console.log('Welcome screen visited:', welcomeVisited)
        setIsWelcomeVisited(welcomeVisited === 'true')

        if (welcomeVisited === 'true') {
          const loggedIn = await AsyncStorage.getItem('isLoggedIn')
          const profileVisited = await AsyncStorage.getItem('profileVisited')
          setIsLoggedIn(loggedIn === 'true')

          if (loggedIn === 'true') {
            if (profileVisited === 'true') {
              router.push('/home')
            } else {
              router.push('/home')
            }
          } else {
            router.push('/auth')
          }
        } else {
          router.push('/welcome')
        }
      } catch (error) {
        console.error('Error checking status:', error)
      }
    }

    checkStatus()
  }, [])

  if (isWelcomeVisited === null || isLoggedIn === null) {
    return <Text>Loading...</Text>
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Redirecting...</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Index
