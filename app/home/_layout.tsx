import { BackIcon } from '@/assets/icons/BackIcon'
import { DrawerIcon } from '@/assets/icons/DrawerIcon'
import { InfoIcon } from '@/assets/icons/InfoIcon'
import { SecondaryButton } from '@/components/buttons/SecondaryButton'
import { palette } from '@/constants/palette'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function Layout() {
  const router = useRouter()

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
        <Stack.Screen name="profile" options={{ headerTitle: '' }} />
        <Stack.Screen
          name="index"
          options={{
            headerTitle: '',
            headerLeft: () => <DrawerIcon />,
            headerRight: () => <SecondaryButton text="Add" filled onPress={() => {}} />
          }}
        />
        <Stack.Screen
          name="screen"
          options={{
            headerTitle: '',
            headerLeft: () => <BackIcon onPress={() => router.back()} />,
            headerRight: () => null
          }}
        />
      </Stack>
    </>
  )
}
