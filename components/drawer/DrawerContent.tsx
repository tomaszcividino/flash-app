import { DrawerContentScrollView } from '@react-navigation/drawer'
import { ExternalPathString, RelativePathString } from 'expo-router'
import { View } from 'react-native'

import { AboutIcon } from '@/assets/icons/AboutIcon'
import { BillingIcon } from '@/assets/icons/BillingIcon'
import { HelpIcon } from '@/assets/icons/HelpIcon'
import { PersonIcon } from '@/assets/icons/PersonIcon'
import { useCustomRouter } from '@/hooks/navigation/useCustomRouter'
import { DrawerHeader } from './DrawerHeader'
import { DrawerItemComponent } from './DrawerItem'
import { EmailSection } from './DrawerProfile'

type Path = RelativePathString | ExternalPathString

const drawerItems = [
  { label: 'My account', icon: PersonIcon, path: '/home/account' },
  { label: 'Billing', icon: BillingIcon, path: '/home/billing' },
  { label: 'Help', icon: HelpIcon, path: '/home/help' },
  { label: 'About', icon: AboutIcon, path: '/home/about' }
]

export const CustomDrawerContent = ({ email }: { email: string }) => {
  const { navigateTo } = useCustomRouter()

  return (
    <View style={{ flex: 1 }}>
      <DrawerHeader />
      <EmailSection email={email} />

      <DrawerContentScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {drawerItems.map((item) => (
          <DrawerItemComponent
            key={item.label}
            label={item.label}
            icon={item.icon}
            onPress={() => navigateTo(item.path as Path)}
          />
        ))}
      </DrawerContentScrollView>
    </View>
  )
}
