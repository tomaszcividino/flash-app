import { apolloClient } from '@/api/apollo/apolloClient'
import { useFetchData } from '@/api/hooks/useFetchData'
import { ALL_SCREENS_QUERY } from '@/api/mutations/playerMutations'
import { GreenDotIcon } from '@/assets/icons/GreenDotIcon'
import { OrientationIcon } from '@/assets/icons/OrientationIcon'
import { PlaylistIcon } from '@/assets/icons/PlaylistIcon'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { ScreenButton } from '@/components/buttons/ScreenButton'
import { NoScreensFound } from '@/components/NoScreensFound'
import { PaginationDots } from '@/components/pagination/PaginationDots'
import { CustomText } from '@/components/typography/CustomText'
import { palette } from '@/constants/palette'
import usePermissionsModal from '@/hooks/modals/usePermissionsModal'
import { useAsyncStorage } from '@/hooks/storage/useAsyncStorage'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native'

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

  const [error, setError] = useState(null)
  const [screens, setScreens] = useState([])

  const client = apolloClient('https://api.dev-fugo.com/cms/player')

  const { refetch, data, isLoading, isError } = useFetchData({
    client,
    key: 'allScreens', // Unique query key
    query: ALL_SCREENS_QUERY
  })

  // Logs the fetching process
  useEffect(() => {
    console.log('Data fetch initiated for screens')
    refetch() // Manually refetch data on screen load
  }, [refetch])

  // Handle any errors during the fetch
  useEffect(() => {
    if (isError) {
      console.log('Error fetching screens:', isError)
      setError('Failed to load screens')
    }
  }, [isError])

  // Update the screens state with fetched data
  useEffect(() => {
    if (data && data.allScreens) {
      console.log('Fetched screens data:', data.allScreens)
      setScreens(
        data.allScreens.map((screen) => ({
          playerId: screen.player.playerId,
          tenantId: screen.player.tenantId,
          name: screen.player.name,
          settings: screen.player.settings,
          info: screen.player.info,
          playlist: screen.player.playlist, // Assuming playlist is available
          connectionStatus: screen.player.connectionStatus // Assuming connectionStatus is available
        }))
      )
    }
  }, [data])

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

  useFocusEffect(
    React.useCallback(() => {
      console.log('HomeScreen focused, triggering refetch...')
      refetch() // Trigger data refetch
    }, [refetch]) // This will ensure refetch happens every time screen is focused
  )

  useEffect(() => {
    if (data && data.allScreens) {
      console.log('Fetched screens data:', data.allScreens)
      setScreens(
        data.allScreens.map((screen) => ({
          playerId: screen.player.playerId,
          tenantId: screen.player.tenantId,
          name: screen.player.name,
          settings: screen.player.settings,
          info: screen.player.info,
          playlist: screen.player.playlist, // Assuming playlist is available
          connectionStatus: screen.player.connectionStatus // Assuming connectionStatus is available
        }))
      )
    }
  }, [data])

  const handleNavigateSingleScreen = (item: any) => {
    console.log(item)

    // Access screenOrientation from settings
    const screenOrientation = item.settings?.screenOrientation || '0' // Default to 'N/A' if not set
    const playerId = item.playerId // Default to 'N/A' if not set

    router.push({
      pathname: '/screens/single/[name]',
      params: {
        name: item.name,
        item,
        screenOrientation,
        playerId
        // Pass it along to the next screen
      }
    })
  }
  const renderScreenItem = ({ item }) => {
    const { tenantId, playerId, name, settings, playlist, connectionStatus } = item
    const screenOrientation = settings?.screenOrientation || '0'

    return (
      <Pressable onPress={() => handleNavigateSingleScreen(item)}>
        <View style={{ borderColor: '#29CC6A', borderWidth: 2, borderRadius: 12, padding: 8 }}>
          <Image source={require('../../assets/images/screenImage.png')} style={{ width: '100%', borderRadius: 8 }} />

          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
            <GreenDotIcon />
            <Text style={{ marginLeft: 8, fontSize: 20 }}>{name}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <OrientationIcon />
              <Text style={{ marginLeft: 4 }}>Portrait {screenOrientation}°</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PlaylistIcon />
              <Text style={{ marginLeft: 12 }}>X Items</Text>
            </View>
          </View>
        </View>
      </Pressable>
    )
  }

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

      <FlatList
        data={screens}
        renderItem={renderScreenItem}
        keyExtractor={(item, index) => item.playerId || index.toString()}
        contentContainerStyle={styles.screenList}
        ListEmptyComponent={<NoScreensFound button />}
      />

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
    borderRadius: 5,
    backgroundColor: palette.colors.grey.light // Grey background
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
