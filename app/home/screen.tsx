import { GreenDotIcon } from '@/assets/icons/GreenDotIcon'
import { RefreshIcon } from '@/assets/icons/RefreshIcon'
import { WifiIcon } from '@/assets/icons/WifiIcon'
import { NoScreensFound } from '@/components/NoScreensFound'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, PermissionsAndroid, Platform, Pressable, StyleSheet, View } from 'react-native'
import { BleManager, Device } from 'react-native-ble-plx'

// Create the BleManager instance
const bleManager = new BleManager()

export default function Index() {
  const [devices, setDevices] = useState<Device[]>([])
  const [scanning, setScanning] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [screenText, setScreenText] = useState('Searching...')
  const [connectionState, setConnectionState] = useState<string>('Disconnected')
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestAndroidPermissions().then(startScan)
    } else {
      startScan()
    }
  }, [])

  const requestAndroidPermissions = async () => {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ]

      const granted = await PermissionsAndroid.requestMultiple(permissions)
      if (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted' &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === 'granted' &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === 'granted'
      ) {
        console.log('All permissions granted')
      } else {
        console.log('Permissions not granted')
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const startScan = async () => {
    setScanning(true)
    setDevices([])
    setIsRefreshing(true)
    setScreenText('Searching...')

    const connectedDevices = await bleManager.connectedDevices([])
    if (connectedDevices.length > 0) {
      setDevices(connectedDevices)
    }

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Error scanning:', error)
        setScanning(false)
        setIsRefreshing(false)
        setScreenText('Error occurred during scanning.')
        return
      }

      if (device?.serviceUUIDs?.includes('aabbccdd-1234-5678-9101-112233445566')) {
        setDevices((prevDevices) => {
          if (!prevDevices.find((dev) => dev.id === device.id)) {
            return [...prevDevices, device]
          }
          return prevDevices
        })
      }
    })

    setTimeout(() => {
      bleManager.stopDeviceScan()
      setScanning(false)
      setIsRefreshing(false)

      if (devices.length === 0) {
        setScreenText('No Screens Found')
      } else {
        setScreenText('Select Screen')
      }
    }, 5000)
  }

  // const connectToDevice = async (device: Device) => {
  //   try {
  //     console.log(`Connecting to device: ${device.id}`)
  //     const deviceConnection = await bleManager.connectToDevice(device.id)
  //     setConnectedDevice(deviceConnection)
  //     console.log('Successfully connected to device:', deviceConnection.id)

  //     await deviceConnection.discoverAllServicesAndCharacteristics()
  //     console.log('Discovered all services and characteristics')

  //     const services = await deviceConnection.services()
  //     for (const service of services) {
  //       const characteristics = await deviceConnection.characteristicsForService(service.uuid)
  //       characteristics.forEach((characteristic) => {
  //         console.log(`Characteristic UUID: ${characteristic.uuid}`)
  //       })
  //     }

  //     sendWiFiCredentials(deviceConnection)
  //     bleManager.stopDeviceScan()

  //     router.push('/home/addscreen')
  //   } catch (e) {
  //     console.error('Failed to connect to device:', e)
  //   }
  // }

  // const sendWiFiCredentials = async (deviceConnection: Device) => {
  //   try {
  //     const serviceUUID = 'aabbccdd-1234-5678-9101-112233445566'
  //     const ssidCharacteristicUUID = 'aabbccdd-1234-5678-9101-112233445568'
  //     const notificationCharacteristicUUID = 'aabbccdd-1234-5678-9101-112233445569'

  //     const ssid = 'CGA2121_QV5rJnx'
  //     const password = 'YhgqgkqGKsdR5PR83G'

  //     const credentials = JSON.stringify({ ssid, password })
  //     const encodedCredentials = base64.encode(credentials)

  //     console.log('Encoded Wi-Fi Credentials:', encodedCredentials)

  //     await deviceConnection.monitorCharacteristicForService(
  //       serviceUUID,
  //       notificationCharacteristicUUID,
  //       (error, characteristic) => {
  //         if (error) {
  //           console.warn('Error enabling notifications:', error)
  //         } else {
  //           const msg = base64.decode(characteristic?.value || '')
  //           console.log('Notification received:', msg)
  //         }
  //       }
  //     )

  //     await deviceConnection.writeCharacteristicWithResponseForService(
  //       serviceUUID,
  //       ssidCharacteristicUUID,
  //       encodedCredentials
  //     )
  //     console.log('Wi-Fi credentials submitted successfully.')
  //   } catch (error) {
  //     console.error('Error sending Wi-Fi credentials:', error)
  //   }
  // }

  const renderDevice = ({ item }: { item: Device }) => (
    <Pressable
      // onPress={() => connectToDevice(item)}
      onPress={() => router.push('/home/addscreen')}
      style={({ pressed }) => [styles.deviceItem, pressed && { opacity: 0.7 }]}
    >
      <View>
        <View style={{ flexDirection: 'row', width: 250, alignItems: 'center', marginBottom: 8 }}>
          <GreenDotIcon />
          <CustomText style={{ fontSize: 20, textAlign: 'center', marginLeft: 4 }}>
            {item.name} {item.id}
          </CustomText>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <WifiIcon />
          <CustomText style={{ fontSize: 12, color: '#007AFF', marginLeft: 4 }}>Ready to pair</CustomText>
        </View>
      </View>
    </Pressable>
  )

  const buttonData = [
    {
      text: 'Refresh',
      onPress: startScan,
      filled: false,
      icon: <RefreshIcon />
    }
  ]

  return (
    <AuthenticationWrapper screenName="Add new screen" buttonData={buttonData}>
      <View style={styles.centeredContainer}>
        <CustomText style={{ fontSize: 30 }}>{screenText}</CustomText>
        <CustomText style={{ fontSize: 18, marginTop: 10 }}>{`Connection Status: ${connectionState}`}</CustomText>
      </View>

      {isRefreshing ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color={palette.colors.purple.light} />
        </View>
      ) : devices.length > 0 ? (
        <FlatList data={devices} keyExtractor={(item) => item.id} renderItem={renderDevice} style={styles.deviceList} />
      ) : (
        <NoScreensFound button={false} />
      )}
    </AuthenticationWrapper>
  )
}

const styles = StyleSheet.create({
  centeredContainer: {
    alignItems: 'center',
    padding: 20
  },
  spinnerContainer: {
    marginTop: 50,
    alignItems: 'center'
  },
  deviceList: {
    marginTop: 20,
    width: '100%',
    marginBottom: 20
  },
  deviceItem: {
    backgroundColor: '#F4F4F5',
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  }
})
