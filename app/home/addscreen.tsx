import { WifiIcon } from '@/assets/icons/WifiIcon'
import { TvImage } from '@/assets/images/tvImage'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import AsyncStorage from '@react-native-async-storage/async-storage' // Import AsyncStorage for SSID storage
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { BleManager, Device } from 'react-native-ble-plx' // Import BLE manager for BLE operations

export default function AddScreen() {
  const router = useRouter()
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([]) // State to store connected BLE devices
  const [savedSSIDs, setSavedSSIDs] = useState<string[]>([]) // State to store saved SSIDs
  const [bleManager] = useState(new BleManager()) // Initialize BLE Manager

  // Fetch saved SSIDs from AsyncStorage
  const fetchSavedSSIDs = async () => {
    try {
      const savedSSIDs = await AsyncStorage.getItem('myssids') // Assuming you're storing SSIDs under 'myssids'
      if (savedSSIDs) {
        const ssidList = JSON.parse(savedSSIDs)
        console.log('Saved SSIDs:', ssidList)
        return ssidList
      } else {
        console.log('No saved SSIDs found.')
        return []
      }
    } catch (error) {
      console.error('Error fetching saved SSIDs:', error)
      return []
    }
  }

  // Fetch connected BLE devices and saved SSIDs when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch connected BLE devices
        const devices = await bleManager.connectedDevices([]) // Fetch connected devices
        setConnectedDevices(devices)
        console.log('Connected BLE Devices:', devices)

        // Fetch saved SSIDs and set them in state
        const ssids = await fetchSavedSSIDs()
        setSavedSSIDs(ssids)
      } catch (error) {
        console.error('Error during fetchData:', error)
      }
    }

    fetchData()

    // Listen for device connection state changes (optional for debugging)
    bleManager.onStateChange((state) => {
      console.log('BLE Manager State:', state)
      if (state === 'PoweredOn') {
        fetchData() // Retry fetching if Bluetooth is powered on
      }
    }, true)

    // Clean up BLE manager when the component unmounts
    return () => {
      bleManager.destroy()
    }
  }, [])

  const handleLogout = async () => {
    try {
      // Handle logout functionality
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

            {/* Align PairingIcon and Ready to pair text vertically */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 40 }}>
              <WifiIcon />
              <CustomText
                style={{
                  fontSize: 12,
                  textAlign: 'center',
                  color: palette.colors.purple.light,
                  marginLeft: 4, // Adjust spacing between icon and text
                  lineHeight: 16 // Ensure the text height is aligned with the icon
                }}
              >
                Ready to pair
              </CustomText>
            </View>

            <TvImage />
          </View>
        </View>

        {/* Display the list of connected devices */}
        <View style={styles.connectedDevicesContainer}>
          <CustomText style={styles.connectedDevicesTitle}>Connected Devices:</CustomText>
          {connectedDevices.length > 0 ? (
            <View>
              {connectedDevices.map((device, index) => (
                <CustomText key={index} style={styles.deviceText}>
                  {device.name || 'Unnamed Device'} - {device.id}
                </CustomText>
              ))}
            </View>
          ) : (
            <CustomText style={styles.deviceText}>No connected devices found.</CustomText>
          )}

          {/* Display saved SSIDs */}
          <CustomText style={styles.connectedDevicesTitle}>Saved SSIDs:</CustomText>
          {savedSSIDs.length > 0 ? (
            <View>
              {savedSSIDs.map((ssid, index) => (
                <CustomText key={index} style={styles.deviceText}>
                  {ssid}
                </CustomText>
              ))}
            </View>
          ) : (
            <CustomText style={styles.deviceText}>No saved SSIDs found.</CustomText>
          )}
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
  },
  connectedDevicesContainer: {
    marginTop: 20,
    paddingHorizontal: 20
  },
  connectedDevicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  deviceText: {
    fontSize: 16,
    marginBottom: 6
  }
})
