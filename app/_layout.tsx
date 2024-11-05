import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { Platform, StatusBar } from 'react-native'

import { useColorScheme } from '@/hooks/useColorScheme'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient, useQuery } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

import 'react-native-reanimated'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ManropeBold: require('../assets/fonts/Manrope-Bold.ttf'),
    ManropeSemi: require('../assets/fonts/Manrope-SemiBold.ttf')
  })

  const [splashVisible, setSplashVisible] = useState<boolean>(!loaded)

  const client = new ApolloClient({
    uri: 'https://api.dev-fugo.com/',
    cache: new InMemoryCache()
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
      setSplashVisible(false)
    }
  }, [loaded])

  if (splashVisible) {
    return null
  }

  const persister = createAsyncStoragePersister({
    storage: AsyncStorage
  })

  return (
    <ApolloProvider client={client}>
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
        <RootLayoutNav />
      </PersistQueryClientProvider>
    </ApolloProvider>
  )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const router = useRouter()

  const { data: isUserLoggedIn, isLoading } = useQuery({
    queryKey: ['isUserLoggedIn'],
    queryFn: async () => {
      const accessToken = await AsyncStorage.getItem('accessToken')
      return accessToken !== null
    }
  })

  useEffect(() => {
    StatusBar.setBarStyle('dark-content')
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('white')
    }
  }, [])

  useEffect(() => {
    if (isUserLoggedIn) {
      router.replace('/(main)/')
    } else {
      router.replace('/(welcome)/')
    }
  }, [isUserLoggedIn, router])

  console.log(isUserLoggedIn, 'from root')

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DefaultTheme}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name={isUserLoggedIn ? '(main)' : '(welcome)'} />
      </Stack>
    </ThemeProvider>
  )
}
