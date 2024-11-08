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
          headerStyle: {
            backgroundColor: palette.colors.white
          },
          headerTintColor: palette.colors.black
        }}
      >
        <Stack.Screen name="index" options={{ headerTitle: '' }} />
      </Stack>
    </>
  )
}
