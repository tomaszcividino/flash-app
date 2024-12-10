import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer'
import { StatusBar } from 'expo-status-bar'

import { useFetchUserEmail } from '@/api/useFetchUSerEmail'
import { BackIcon } from '@/assets/icons/BackIcon'
import { DrawerIcon } from '@/assets/icons/DrawerIcon'
import { SecondaryButton } from '@/components/buttons/SecondaryButton'
import { CustomDrawerContent } from '@/components/drawer/DrawerContent'
import { useRouter } from 'expo-router'

import HomeScreen from '.'
import AboutScreen from './about'
import AccountScreen from './account'
import AddScreen from './addscreen'
import BillingScreen from './billing'
import ConnetToWifi from './connectwifi'
import HelpScreen from './help'
import PairScreen from './pairscreen'
import ProfileScreen from './profile'
import SingleScreen from './screen'

const Drawer = createDrawerNavigator()

export default function Layout() {
  const { email } = useFetchUserEmail()
  const router = useRouter()

  const headerOptions = {
    headerLeft: () => <BackIcon onPress={() => router.push('/home')} />,
    headerTitle: '',
    headerShadowVisible: false
  }

  const indexHeaderOptions = ({ navigation }: { navigation: DrawerNavigationProp<any> }) => ({
    headerLeft: () => <DrawerIcon onPress={() => navigation.openDrawer()} style={{ marginLeft: 20 }} />,
    headerRight: () => (
      <SecondaryButton text="Add" onPress={() => console.log('add')} filled style={{ marginRight: 20 }} />
    ),
    headerTitle: '',
    headerShadowVisible: false
  })

  return (
    <>
      <StatusBar style="dark" />
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} email={email} />}>
        <Drawer.Screen name="index" component={HomeScreen} options={indexHeaderOptions} />
        <Drawer.Screen name="profile" component={ProfileScreen} options={headerOptions} />
        <Drawer.Screen name="account" component={AccountScreen} options={headerOptions} />
        <Drawer.Screen name="billing" component={BillingScreen} options={headerOptions} />
        <Drawer.Screen name="help" component={HelpScreen} options={headerOptions} />
        <Drawer.Screen name="about" component={AboutScreen} options={headerOptions} />
        <Drawer.Screen name="screen" component={SingleScreen} options={headerOptions} />
        <Drawer.Screen name="addscreen" component={AddScreen} options={headerOptions} />
        <Drawer.Screen name="connectwifi" component={ConnetToWifi} options={headerOptions} />
        <Drawer.Screen name="pairscreen" component={PairScreen} options={headerOptions} />
        <Drawer.Screen name="confirmation" component={PairScreen} options={headerOptions} />
      </Drawer.Navigator>
    </>
  )
}
