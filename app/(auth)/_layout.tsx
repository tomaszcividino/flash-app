import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { Platform, StatusBar } from 'react-native'

export default function RootLayout() {
  useEffect(() => {
    StatusBar.setBarStyle('dark-content')
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('white')
    }
  }, [])

  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <Stack>
        <Stack.Screen name="authentication" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  )
}
