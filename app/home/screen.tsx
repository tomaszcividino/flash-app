import { GreenDotIcon } from '@/assets/icons/GreenDotIcon'
import { RefreshIcon } from '@/assets/icons/RefreshIcon'
import { WifiIcon } from '@/assets/icons/WifiIcon'
import { NoScreensFound } from '@/components/NoScreensFound'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, PermissionsAndroid, Platform, Pressable, StyleSheet, View } from 'react-native'
import base64 from 'react-native-base64'
import { BleManager, Device } from 'react-native-ble-plx'

// Create the BleManager instance
const bleManager = new BleManager()

const serviceUUID = 'aabbccdd-1234-5678-9101-112233445566'
const ssidListCharacteristicUUID = 'aabbccdd-1234-5678-9101-112233445567'

export default function Index() {
  const [devices, setDevices] = useState<Device[]>([])
  const [scanning, setScanning] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [screenText, setScreenText] = useState('Searching...')
  const [connectionState, setConnectionState] = useState<string>('Disconnected')
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null)
  const [ssidList, setSsidList] = useState<string[]>([]) // Holds the SSID list from the device
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
      console.warn('Permissions error:', err)
    }
  }

  const startScan = async () => {
    setScanning(true)
    setDevices([])
    setIsRefreshing(true)
    setScreenText('Searching...')

    const connectedDevices = await bleManager.connectedDevices([serviceUUID])
    if (connectedDevices.length > 0) {
      console.log('Connected devices:', connectedDevices)
      setDevices(connectedDevices)
    } else {
      console.log('No devices connected.')
    }

    bleManager.startDeviceScan([serviceUUID], null, (error, device) => {
      if (error) {
        console.log('Error scanning:', error)
        setScanning(false)
        setIsRefreshing(false)
        setScreenText('Error occurred during scanning.')
        return
      }

      if (device?.serviceUUIDs?.includes(serviceUUID)) {
        console.log('Discovered device:', device.name, device.id)
        setDevices((prevDevices) => {
          if (!prevDevices.find((dev) => dev.id === device.id)) {
            console.log('Adding new device to the list')
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
        console.log('No screens found.')
      } else {
        setScreenText('Select Screen')
        console.log('Devices found:', devices)
      }
    }, 5000)
  }

  // This function retrieves the SSID list from the device
  // This function retrieves the SSID list from the device
  const getSSIDList = async (device: Device, serviceUUID: string, characteristicUUID: string) => {
    try {
      console.log(`Attempting to read SSID List from device: ${device.id}`)

      // Step 1: Read the characteristic from the device
      const characteristic = await device.readCharacteristicForService(serviceUUID, characteristicUUID)
      console.log(`Characteristic value for SSID List: ${characteristic.value}`) // Log the raw value received

      // Step 2: Decode the Base64 value into a regular string
      const decodedBase64Value = base64.decode(characteristic.value)
      console.log('Decoded Base64 value:', decodedBase64Value)

      // Step 3: Convert the decoded string into an ArrayBuffer (optional, for further processing)
      const buffer = stringToArrayBuffer(decodedBase64Value)
      console.log('Converted ArrayBuffer from decoded string:', buffer)

      // Step 4: Decode the ArrayBuffer into a string
      const decodedWithAB2Str = ab2str(buffer)
      console.log('Decoded ArrayBuffer to string:', decodedWithAB2Str)

      // Step 5: Extract SSID list from the decoded string
      // Use a more robust regular expression to correctly split the SSIDs
      const ssidList = decodedWithAB2Str.match(/"([^"]+)"/g).map((ssid) => ssid.replace(/["\[\]]/g, '').trim())
      console.log('Extracted SSID List from decoded string:', ssidList)

      // Step 6: Clean the SSID list (optional, to remove invalid or unwanted entries)
      const cleanedSSIDs = ssidList.filter((ssid) => ssid && ssid.length > 4 && !ssid.includes('2.['))
      console.log('Cleaned SSID List (filtered invalid entries):', cleanedSSIDs)

      // Step 7: Eliminate duplicates by converting to a Set and back to an Array
      const uniqueSSIDs = Array.from(new Set(cleanedSSIDs))
      console.log('Unique SSID List (duplicates removed):', uniqueSSIDs)

      // Step 8: Optionally, save the SSID list to AsyncStorage for persistence
      await AsyncStorage.setItem('filteredSSIDs', JSON.stringify(uniqueSSIDs))
      console.log('SSID list saved to AsyncStorage:', uniqueSSIDs)

      return uniqueSSIDs
    } catch (error) {
      // Catch and log any errors during the process
      console.error('Error retrieving SSID list from device:', error)
      return []
    }
  }

  // Helper function to convert string to ArrayBuffer
  const stringToArrayBuffer = (str: string): ArrayBuffer => {
    console.log('Converting string to ArrayBuffer:', str)
    const encoder = new TextEncoder()
    const arrayBuffer = encoder.encode(str).buffer
    console.log('Converted ArrayBuffer:', arrayBuffer)
    return arrayBuffer
  }

  // Helper function to convert ArrayBuffer to string
  const ab2str = (buffer: ArrayBuffer): string => {
    const uint8Array = new Uint8Array(buffer)
    const decodedStr = String.fromCharCode(...uint8Array)
    console.log('Converted ArrayBuffer to string:', decodedStr)
    return decodedStr
  }
  const connectToDevice = async (device: Device) => {
    try {
      console.log(`Connecting to device: ${device.id}`)
      const deviceConnection = await bleManager.connectToDevice(device.id)
      setConnectedDevice(deviceConnection)
      console.log('Successfully connected to device:', deviceConnection.id)

      await deviceConnection.discoverAllServicesAndCharacteristics()
      console.log('Discovered all services and characteristics')

      // Fetch SSID list
      const ssids = await getSSIDList(deviceConnection, serviceUUID, ssidListCharacteristicUUID)
      setSsidList(ssids) // Set SSID list in state

      // Save SSID list to AsyncStorage
      await AsyncStorage.setItem('filteredSSIDs', JSON.stringify(ssidList))
      console.log('SSID list saved to AsyncStorage')

      setScreenText('Select a Screen')

      // Stop scanning after connection
      bleManager.stopDeviceScan()
      console.log(ssidList, 'list')
      await AsyncStorage.setItem('myssids', JSON.stringify(ssidList))
      router.push('/home/addscreen')
    } catch (e) {
      console.error('Failed to connect to device:', e)
    }
  }

  const renderDevice = ({ item }: { item: Device }) => (
    <Pressable
      onPress={() => connectToDevice(item)}
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

      {ssidList.length > 0 && (
        <View style={styles.ssidContainer}>
          <CustomText style={{ fontSize: 20 }}>Available SSIDs:</CustomText>
          <FlatList
            data={ssidList}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => <CustomText>{item}</CustomText>}
            style={styles.ssidList}
          />
        </View>
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
  },
  ssidContainer: {
    marginTop: 20,
    paddingHorizontal: 20
  },
  ssidList: {
    marginTop: 10
  }
})
