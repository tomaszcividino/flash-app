import { BackIcon } from '@/assets/icons/BackIcon'
import { OptionsIcon } from '@/assets/icons/OptionsIcon'
import { palette } from '@/constants/palette'
import { Stack, useLocalSearchParams, usePathname, useRouter } from 'expo-router'
import { StyleSheet } from 'react-native'

export default function PagesLayout() {
  const router = useRouter()
  const { name, playerId } = useLocalSearchParams() // Extract the 'name' parameter from the route
  const path = usePathname()

  // Log to check if 'name' is correctly extracted

  const handleOptionsPress = () => {
    router.push({
      pathname: `/screens/settings/${name}`,
      params: {
        name: name,
        playerId
        // Pass it along to the next screen
      }
    })
  }

  // Conditionally render the OptionsIcon only if we're on the "single/[name]" screen
  const isSingleScreen = !path.includes('/settings/')

  return (
    <Stack
      screenOptions={{
        headerRight: () => (isSingleScreen ? <OptionsIcon onPress={handleOptionsPress} /> : null),
        headerLeft: () => <BackIcon />,
        headerStyle: {
          backgroundColor: palette.colors.white
        },
        headerShadowVisible: false,
        headerTintColor: palette.colors.black
      }}
    >
      <Stack.Screen name="single/[name]" options={{ headerTitle: '' }} />
      <Stack.Screen name="settings/[name]" options={{ headerTitle: '' }} />
    </Stack>
  )
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 20
  }
})
