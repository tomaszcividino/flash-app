import { InfoIcon } from '@/assets/icons/InfoIcon'
import { Drawer } from 'expo-router/drawer'
import { StatusBar } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />

      <Drawer>
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: 'Profile',
            drawerStyle: { borderWidth: 0 },
            headerStyle: { borderBottomWidth: 0 },
            headerShadowVisible: false,
            headerTitle: () => null,
            headerRight: () => <InfoIcon style={{ marginRight: 20 }} />
            // headerLeft: () => null
          }}
        />
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'Overview'
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
