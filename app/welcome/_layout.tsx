import { InfoIcon } from '@/assets/icons/InfoIcon'
import { palette } from '@/constants/palette'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerRight: () => <InfoIcon />,
          headerLeft: () => <></>,
          headerStyle: {
            backgroundColor: palette.colors.white
          },
          headerShadowVisible: false,
          headerTintColor: palette.colors.black
        }}
      >
        <Stack.Screen name="index" options={{ headerTitle: '' }} />
      </Stack>
    </>
  )
}
