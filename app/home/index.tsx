import { apolloClient } from '@/api/apollo/apolloClient'
import { useFetchData } from '@/api/hooks/useFetchData'
import { SCREEN_COUNT_QUERY } from '@/api/mutations/playerMutations'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { ScreenButton } from '@/components/buttons/ScreenButton'
import { NoScreensFound } from '@/components/NoScreensFound'
import { PaginationDots } from '@/components/pagination/PaginationDots'
import { CustomText } from '@/components/typography/CustomText'
import { palette } from '@/constants/palette'
import usePermissionsModal from '@/hooks/modals/usePermissionsModal'
import { useAsyncStorage } from '@/hooks/storage/useAsyncStorage'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Button, Modal, SafeAreaView, StyleSheet, useWindowDimensions, View } from 'react-native'

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

  const [screenCount, setScreenCount] = useState(null)
  const [screens, setScreens] = useState([])
  const [error, setError] = useState(null)

  const client = apolloClient('https://api.dev-fugo.com/cms/player')

  const {
    data: count,
    isLoading,
    isError
  } = useFetchData({
    client,
    key: 'allScreens', // Unique query key
    query: SCREEN_COUNT_QUERY // The GraphQL query to fetch data
  })

  // Fetch screen count
  // useEffect(() => {
  //   const fetchScreenCount = async () => {
  //     try {
  //       const accessToken = await AsyncStorage.getItem('accessToken')
  //       const teamId = await AsyncStorage.getItem('teamId')

  //       if (!accessToken || !teamId) {
  //         setError('Missing access token or team ID')
  //         return
  //       }

  //       const { data } = await apolloClient(urls.api.cmsPlayer).query({
  //         query: SCREEN_COUNT_QUERY,
  //         context: {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //             'X-Team-Id': teamId
  //           }
  //         }
  //       })

  //       setScreenCount(data.screenCount)
  //     } catch (err) {
  //       setError('Error fetching screen count')
  //       console.error('Error fetching screen count:', err)
  //     }
  //   }

  //   fetchScreenCount()
  // }, [])

  // useEffect(() => {
  //   const deleteAllPlayers = async () => {
  //     try {
  //       const accessToken = await AsyncStorage.getItem('accessToken')
  //       const teamId = await AsyncStorage.getItem('teamId')

  //       if (!accessToken || !teamId) {
  //         setError('Missing access token or team ID')
  //         return
  //       }

  //       // Loop through each playerId in the screens and delete them
  //       for (const screen of screens) {
  //         const playerId = screen.player.playerId

  //         const { data } = await client.mutate({
  //           mutation: DELETE_PLAYER_MUTATION,
  //           variables: { playerId },
  //           context: {
  //             headers: {
  //               Authorization: `Bearer ${accessToken}`,
  //               'X-Team-Id': teamId
  //             }
  //           }
  //         })

  //         console.log(`Deleted playerId: ${playerId}`, data)
  //       }

  //       // Optionally, refetch or update the state to reflect the deletions
  //       setScreens([]) // Clear the screens locally
  //     } catch (err) {
  //       setError('Error deleting players')
  //       console.error('Error deleting players:', err)
  //     }
  //   }

  //   // Automatically delete all players when the component mounts
  //   if (screens.length > 0) {
  //     deleteAllPlayers()
  //   }
  // })

  // Fetch all screens
  // useEffect(() => {
  //   const fetchAllScreens = async () => {
  //     try {
  //       const accessToken = await AsyncStorage.getItem('accessToken')
  //       const teamId = await AsyncStorage.getItem('teamId')

  //       if (!accessToken || !teamId) {
  //         setError('Missing access token or team ID')
  //         return
  //       }

  //       const { data } = await apolloClient(urls.api.cmsPlayer).query({
  //         query: ALL_SCREENS_QUERY,
  //         context: {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //             'X-Team-Id': teamId
  //           }
  //         }
  //       })

  //       setScreens(data.allScreens || [])
  //     } catch (err) {
  //       setError('Error fetching screens')
  //       console.error('Error fetching screens:', err)
  //     }
  //   }

  //   fetchAllScreens()
  // }, [])

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

  console.log(screenCount)
  console.log(screens, 'screens')
  // console.log(screens[0], 'screens')

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <CustomText style={styles.screenTitle}>Your Screens</CustomText>
        <CustomText style={styles.screenSubtitle}>Connect to Screen to update playlist</CustomText>
      </View>

      <View style={{ alignItems: 'center', marginTop: 24 }}>
        <ScreenButton
          text="Order your Flash"
          filled
          onPress={() => console.log('Order Flash')}
          imageSource={require('../../assets/images/headphones.webp')}
        />
      </View>

      {error && <CustomText style={{ color: 'red', textAlign: 'center' }}>{error}</CustomText>}

      <View style={styles.screenList}>
        {screens.length > 0 ? (
          screens.map((screen, index) => (
            <View key={index} style={styles.screenItem}>
              <CustomText>Tenant ID: {screen.player.tenantId}</CustomText>
              <CustomText>Player ID: {screen.player.playerId}</CustomText>
            </View>
          ))
        ) : (
          <NoScreensFound button />
        )}
      </View>

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
    backgroundColor: palette.colors.white
  },
  textContainer: {
    marginTop: 16,
    marginHorizontal: 20
  },
  screenTitle: {
    fontSize: 30,
    marginBottom: 8
  },
  screenSubtitle: {
    fontSize: 15
  },
  screenList: {
    marginTop: 20,
    paddingHorizontal: 20
  },
  screenItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: palette.colors.grey.light,
    borderRadius: 5
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
  }
})

export default HomeScreen
