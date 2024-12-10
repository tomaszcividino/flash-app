import { apolloClient } from '@/api/apollo/apolloClient'
import { PAIR_PLAYER_MUTATION } from '@/api/mutations/playerMutations'
import { urls } from '@/constants/urls'
import { useEffect, useState } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'
import { BleManager, Device } from 'react-native-ble-plx'

import AsyncStorage from '@react-native-async-storage/async-storage'
import base64 from 'react-native-base64'

const bleManager = new BleManager()

const serviceUUID = 'aabbccdd-1234-5678-9101-112233445566'
const ssidListCharacteristicUUID = 'aabbccdd-1234-5678-9101-112233445567'
const notificationCharacteristicUUID = 'aabbccdd-1234-5678-9101-112233445569'
const pinUUID = 'aabbccdd-1234-5678-9101-112233445570'

export const useBluetooth = () => {
  const [devices, setDevices] = useState<Device[]>([])
  const [scanning, setScanning] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [screenText, setScreenText] = useState<string>('')

  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null)
  const [ssidList, setSsidList] = useState<string[]>([])

  const [pin, setPin] = useState<string | null>(null)
  const [currentScreen, setCurrentScreen] = useState<string>('')

  const [loading, setLoading] = useState(false)
  const [pairingResult, setPairingResult] = useState<string | null>(null)

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestAndroidPermissions().then(startScan)
    } else {
      startScan()
    }

    return () => {
      bleManager.stopDeviceScan()
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
        setError('Permissions not granted')
        setScreenText('Permissions not granted')
      }
    } catch (err) {
      console.warn('Permissions error:', err)
      setError('Permissions error')
      setScreenText('Permissions error')
    }
  }

  const startScan = async () => {
    if (scanning) {
      console.log('Scan already in progress, ignoring new startScan call.')
      return
    }

    try {
      console.log('Starting BLE scan...')
      setScreenText('Scanning for devices...')
      bleManager.stopDeviceScan()
      setScanning(true)
      setDevices([])
      setIsRefreshing(true)
      setError(null)

      bleManager.startDeviceScan([serviceUUID], null, (error, device) => {
        if (error) {
          console.log('Error scanning:', error)
          setError('Error occurred during scanning.')
          setScreenText('Error occurred during scanning.')
          stopScan()
          return
        }

        if (device?.serviceUUIDs?.includes(serviceUUID)) {
          setDevices((prevDevices) => {
            if (!prevDevices.find((dev) => dev.id === device.id)) {
              console.log('Discovered new device:', device.name, device.id)
              return [...prevDevices, device]
            }
            return prevDevices
          })
        }
      })

      setTimeout(() => {
        stopScan()
      }, 5000)
    } catch (error) {
      console.error('Error starting scan:', error)
      setError('Error starting scan')
      setScreenText('Error starting scan')
      stopScan()
    }
  }

  const stopScan = () => {
    console.log('Stopping scan...')
    setScreenText('Select screen')
    bleManager.stopDeviceScan()
    setScanning(false)
    setIsRefreshing(false)
    console.log('Scan stopped.')
  }

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id)
      setConnectedDevice(deviceConnection)

      await deviceConnection.discoverAllServicesAndCharacteristics()

      const ssids = await getSSIDList(deviceConnection, serviceUUID, ssidListCharacteristicUUID)
      setSsidList(ssids)

      await AsyncStorage.setItem('filteredSSIDs', JSON.stringify(ssidList))

      bleManager.stopDeviceScan()
      await subscribeToNotifications(deviceConnection)

      setCurrentScreen('initial')
    } catch (e) {
      console.error('Failed to connect to device:', e)
    }
  }

  const subscribeToNotifications = async (device: Device) => {
    try {
      if (!device.isConnected) {
        await device.connect()
      }

      await device.discoverAllServicesAndCharacteristics()

      device.monitorCharacteristicForService(serviceUUID, notificationCharacteristicUUID, (error, characteristic) => {
        if (error) {
          console.error('Error receiving notifications:', error)
          return
        }

        const msg = ab2str(characteristic.value)
        console.log('Notification:', msg)
      })
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error)
    }
  }

  const getSSIDList = async (device: Device, serviceUUID: string, characteristicUUID: string) => {
    try {
      console.log(`Attempting to read SSID List from device: ${device.id}`)

      const characteristic = await device.readCharacteristicForService(serviceUUID, characteristicUUID)
      console.log(`Characteristic value for SSID List: ${characteristic.value}`)

      const decodedBase64Value = base64.decode(characteristic.value)
      console.log('Decoded Base64 value:', decodedBase64Value)

      const buffer = stringToArrayBuffer(decodedBase64Value)
      console.log('Converted ArrayBuffer from decoded string:', buffer)

      const decodedWithAB2Str = ab2str(buffer)
      console.log('Decoded ArrayBuffer to string:', decodedWithAB2Str)

      const ssidList = decodedWithAB2Str.match(/"([^"]+)"/g).map((ssid) => ssid.replace(/["\[\]]/g, '').trim())
      console.log('Extracted SSID List from decoded string:', ssidList)

      const cleanedSSIDs = ssidList.filter((ssid) => ssid && ssid.length > 4 && !ssid.includes('2.['))
      console.log('Cleaned SSID List (filtered invalid entries):', cleanedSSIDs)

      const uniqueSSIDs = Array.from(new Set(cleanedSSIDs))
      console.log('Unique SSID List (duplicates removed):', uniqueSSIDs)

      await AsyncStorage.setItem('ssids', JSON.stringify(uniqueSSIDs))
      console.log('SSID list saved to AsyncStorage:', uniqueSSIDs)

      return uniqueSSIDs
    } catch (error) {
      console.error('Error retrieving SSID list from device:', error)
      return []
    }
  }

  const stringToArrayBuffer = (str: string): ArrayBuffer => {
    const encoder = new TextEncoder()
    return encoder.encode(str).buffer
  }

  const ab2str = (buffer: ArrayBuffer): string => {
    const uint8Array = new Uint8Array(buffer)
    return String.fromCharCode(...uint8Array)
  }

  const sendWiFiCredentials = async (deviceConnection, password) => {
    try {
      const serviceUUID = 'aabbccdd-1234-5678-9101-112233445566'
      const ssidCharacteristicUUID = 'aabbccdd-1234-5678-9101-112233445568'
      const notificationCharacteristicUUID = 'aabbccdd-1234-5678-9101-112233445569'

      const ssid = 'CGA2121_QV5rJnx'
      const credentials = JSON.stringify({ ssid, password })
      const encodedCredentials = base64.encode(credentials)

      console.log('Encoded Wi-Fi Credentials:', encodedCredentials)

      await deviceConnection.monitorCharacteristicForService(
        serviceUUID,
        notificationCharacteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.warn('Error enabling notifications:', error)
          } else {
            const msg = base64.decode(characteristic?.value || '')
            console.log('Notification received:', msg)
            if (msg.includes('Connected to')) {
              console.log('Device connected with message:', msg)
            }
          }
        }
      )

      await deviceConnection.writeCharacteristicWithResponseForService(
        serviceUUID,
        ssidCharacteristicUUID,
        encodedCredentials
      )
      console.log('Wi-Fi credentials submitted successfully.')
      setCurrentScreen('pairing')
    } catch (error) {
      console.error('Error sending Wi-Fi credentials:', error)
    }
  }

  const getPin = async (device: Device) => {
    try {
      console.log('Attempting to read PIN from device:', device)

      console.log(`Reading characteristic for service: ${serviceUUID}, characteristic: ${pinUUID}`)
      const characteristic = await device.readCharacteristicForService(serviceUUID, pinUUID)

      console.log('GEEEETING', pinUUID)

      console.log('Raw characteristic value:', characteristic.value)

      const decodedPin = base64.decode(characteristic.value)

      console.log('Decoded PIN:', decodedPin)

      setPin(decodedPin)
    } catch (error) {
      console.error('Error retrieving PIN from device:', error)
    }
  }

  const pairDevice = async () => {
    console.log('pairDevice called')
    setLoading(true)
    setPairingResult(null)

    try {
      const accessToken = await AsyncStorage.getItem('accessToken')
      const teamId = await AsyncStorage.getItem('teamId')
      console.log('Retrieved credentials:', { accessToken, teamId })

      if (!accessToken || !teamId) {
        setPairingResult('Missing access token or team ID.')
        console.log('Missing credentials')
        return
      }

      console.log('Preparing parameters...')
      const name = 'D8:3A:DD:CB:B4:FE'
      const colour = '#000000'
      const settings = {}
      const shared = []

      console.log('Calling mutation...')
      const { data } = await apolloClient(urls.api.cmsPlayer).mutate({
        mutation: PAIR_PLAYER_MUTATION,
        variables: { pin, name, colour, settings, shared },
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Team-Id': teamId
          }
        }
      })

      console.log('Mutation result:', data)

      if (data?.pairPlayer?.success) {
        setPairingResult('Device paired successfully!')
      } else {
        setPairingResult(`Error: ${data?.pairPlayer?.message}`)
      }
    } catch (error) {
      console.error('Error pairing device:', error)
      setPairingResult('Failed to pair the device.')
    } finally {
      console.log('pairDevice execution complete')
      setLoading(false)
    }
  }

  return {
    devices,
    scanning,
    isRefreshing,
    error,
    screenText,
    startScan,
    getSSIDList,
    subscribeToNotifications,
    connectToDevice,
    ssidList,
    connectedDevice,
    sendWiFiCredentials,
    pairDevice,
    getPin,
    currentScreen,
    setCurrentScreen
  }
}
