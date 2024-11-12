import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { PaginationDots } from '@/components/pagination/PaginationDots'
import { CustomText } from '@/components/typography/CustomText'
import { palette } from '@/constants/palette'
import usePermissionsModal from '@/hooks/modals/usePermissionsModal'
import { useAsyncStorage } from '@/hooks/storage/useAsyncStorage'
import { useRouter } from 'expo-router'
import { Button, Modal, SafeAreaView, StyleSheet, View, useWindowDimensions } from 'react-native'

const HomeScreen = () => {
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

      router.replace('/auth')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { width: width - 40 }]}>
            <PaginationDots slides={slides} activeIndex={currentStep} />
            {currentStep === 0 ? (
              <>
                <CustomText style={styles.modalTitle}>{slides[0].titleUpper}</CustomText>
                <CustomText style={styles.modalText}>{slides[0].titleLower}</CustomText>
                <PrimaryButton text="Sure" onPress={() => handleNetworkPermission(true)} filled />
              </>
            ) : (
              <>
                <CustomText style={styles.modalTitle}>{slides[1].titleUpper}</CustomText>
                <CustomText style={styles.modalText}>{slides[1].titleLower}</CustomText>
                <PrimaryButton text="Allow" onPress={() => handleNotificationsPermission(true)} filled />
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.colors.white,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    padding: 32,
    backgroundColor: palette.colors.white,
    borderRadius: 10,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 30,
    letterSpacing: -1,
    lineHeight: 31.5,
    marginVertical: 24,
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 24,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 19.5,
    letterSpacing: -1
  },
  pageIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20
  },
  pageIndicator: {
    width: 12,
    height: 12,
    margin: 4,
    borderRadius: 6,
    backgroundColor: palette.colors.grey.light
  },
  activeDot: {
    backgroundColor: palette.colors.purple.light
  },
  inactiveDot: {
    backgroundColor: palette.colors.grey.light
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  }
})

export default HomeScreen
