import { WifiIcon } from '@/assets/icons/WifiIcon'
import { TvImage } from '@/assets/images/tvImage'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { BleManager, Device } from 'react-native-ble-plx' // Import BLE manager for BLE operations

export default function AddScreen() {
  const router = useRouter()
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([]) // State to store connected BLE devices
  const [bleManager] = useState(new BleManager()) // Initialize BLE Manager

  useEffect(() => {
    // Function to fetch connected BLE devices when the screen loads
    const fetchConnectedBleDevices = async () => {
      try {
        const devices = await bleManager.connectedDevices([]) // Fetch connected devices
        setConnectedDevices(devices) // Store the devices in the state
        console.log('Connected BLE Devices:', devices) // Log the devices to the console
      } catch (error) {
        console.error('Error fetching connected BLE devices:', error)
      }
    }

    // Fetch connected devices initially
    fetchConnectedBleDevices()

    // Listen for device connection state changes (optional for debugging)
    bleManager.onStateChange((state) => {
      console.log('BLE Manager State:', state)
      if (state === 'PoweredOn') {
        fetchConnectedBleDevices() // Retry fetching connected devices if Bluetooth is powered on
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
