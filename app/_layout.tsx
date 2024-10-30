import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const router = useRouter()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ManropeBold: require('../assets/fonts/Manrope-Bold.ttf'),
    ManropeSemi: require('../assets/fonts/Manrope-SemiBold.ttf')
  })

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [splashVisible, setSplashVisible] = useState<boolean>(!loaded)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
      setSplashVisible(false)
    }
  }, [loaded])

  useEffect(() => {
    if (!splashVisible) {
      if (isLoggedIn) {
        router.replace('/(tabs)/')
      } else {
        router.replace('/(welcome)/')
      }
    }
  }, [splashVisible, isLoggedIn, router])

  if (splashVisible) {
    return null
  }

  return <RootLayoutNav isLoggedIn={isLoggedIn} />
}

function RootLayoutNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name={isLoggedIn ? '(tabs)' : '(welcome)'} />
      </Stack>
    </ThemeProvider>
  )
}
