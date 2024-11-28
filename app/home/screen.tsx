import { RefreshIcon } from '@/assets/icons/RefreshIcon'
import { NoScreensFound } from '@/components/NoScreensFound'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native'
import { BleManager, Device } from 'react-native-ble-plx'

// Create the BleManager instance
const bleManager = new BleManager()

export default function Index() {
  const [devices, setDevices] = useState<Device[]>([])
  const [scanning, setScanning] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [screenText, setScreenText] = useState('Searching...')

  const router = useRouter()

  useEffect(() => {
    // Request permissions for Android and start scanning automatically
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
    setDevices([]) // Clear the devices list
    setIsRefreshing(true)
    setScreenText('Searching...') // Initial text during scanning

    // First, get the already connected devices
    const connectedDevices = await bleManager.connectedDevices([])
    setDevices(connectedDevices) // Add already connected devices to the list

    // Start scanning for nearby devices
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Error scanning:', error)
        setScanning(false)
        setIsRefreshing(false)
        setScreenText('Error occurred during scanning.')
        return
      }

      // Filter by UUID
      if (device?.serviceUUIDs?.includes('aabbccdd-1234-5678-9101-112233445566')) {
        setDevices((prevDevices) => {
          if (!prevDevices.find((dev) => dev.id === device.id)) {
            return [...prevDevices, device]
          }
          return prevDevices
        })
      }
    })

    // Stop scanning after 5 seconds
    setTimeout(() => {
      bleManager.stopDeviceScan()
      setScanning(false)
      setIsRefreshing(false)

      if (devices.length === 0) {
        setScreenText('No Screens Found') // Update if no devices found
      } else {
        setScreenText('Select Screen')
      }
    }, 5000)
  }

  const renderDevice = ({ item }: { item: Device }) => (
    <View style={styles.deviceItem}>
      <Text onPress={() => router.push('/home/addscreen')}>{item.name ? item.name : 'Unnamed device'}</Text>
      <Text>{item.id}</Text>
    </View>
  )

  const buttonData = [
    {
      text: 'Refresh',
      onPress: startScan,
      filled: false,
      disabled: scanning,
      icon: <RefreshIcon />
    }
  ]

  return (
    <AuthenticationWrapper screenName="Add new screen" buttonData={buttonData}>
      <View style={styles.centeredContainer}>
        <CustomText style={{ fontSize: 30 }}>{screenText}</CustomText>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deviceList: {
    width: '100%',
    marginTop: 20
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  }
})
