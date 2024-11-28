import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import usePermissionsModal from '@/hooks/modals/usePermissionsModal'
import { useAsyncStorage } from '@/hooks/storage/useAsyncStorage'
import { useRouter } from 'expo-router'
import { SafeAreaView, StyleSheet, View, useWindowDimensions } from 'react-native'

export default function AddScreen() {
  const router = useRouter()
  const { removeItem } = useAsyncStorage()
  const { isModalVisible, currentStep, setIsModalVisible, handleNetworkPermission, handleNotificationsPermission } =
    usePermissionsModal()
  const { width } = useWindowDimensions()

  const slides = [
    {
      titleUpper: 'Local Network Permission',
      titleLower:
        "To use the Fugo Flash app's basic functionality, you must allow local network access. \n\n This is only used to set up and communicate with the Fugo device on your network."
    },
    {
      titleUpper: 'Stay Connected and Updated',
      titleLower:
        'Turn on notifications to receive Fugo Flash app announcements, offers, and more. \n\n You can update your notification preferences anytime in your app settings.'
    }
  ]

  const handleLogout = async () => {
    try {
      await removeItem('isLoggedIn')
      await removeItem('accessToken')
      await removeItem('profileVisited')
      await removeItem('isModalVisited')
      await removeItem('teamId')
      await removeItem('welcomeScreenVisited')

      router.replace('/auth')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  const buttonData = [
    {
      text: 'Accept',
      onPress: () => router.push('/home/connectwifi'),
      filled: true,
      disabled: false
    },
    {
      text: 'Decline pairing',
      onPress: () => console.log('decline pressed'),
      filled: false,
      disabled: false
    }
  ]

  return (
    <AuthenticationWrapper screenName="Pairing your screen" buttonData={buttonData}>
      <SafeAreaView style={styles.container}>
        <View style={styles.textContainer}>
          <CustomText style={styles.screenTitle}>Add this screen</CustomText>
        </View>

        <View style={styles.pairedScreenContainer}>
          <View style={styles.pairedScreen}>
            <CustomText weight="bold" style={{ fontSize: 30, textAlign: 'center', letterSpacing: -1 }}>
              LG TV- PXLMFEFHJB33
            </CustomText>
            <CustomText
              style={{ fontSize: 12, textAlign: 'center', marginTop: 12, color: palette.colors.purple.light }}
            >
              Ready to pair
            </CustomText>
            {/* This view will now be centered */}
            <View style={{ width: 280, height: 156, backgroundColor: '#7B838A' }} />
          </View>
        </View>
      </SafeAreaView>
    </AuthenticationWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.colors.white
  },
  textContainer: {
    marginTop: 16,
    marginHorizontal: 20
  },
  screenTitle: {
    fontSize: 30,
    marginBottom: 8,
    textAlign: 'center'
  },
  pairedScreenContainer: {
    flex: 1,
    justifyContent: 'center', // Centers vertically
    alignItems: 'center' // Centers horizontally
  },
  pairedScreen: {
    width: 350,
    height: 323,
    backgroundColor: '#F8F9FA',
    marginTop: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#EEF0F2',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
