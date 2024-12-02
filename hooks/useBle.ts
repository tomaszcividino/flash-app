/* eslint-disable no-bitwise */
import { useMemo, useState } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'
import { BleManager, Device } from 'react-native-ble-plx'

import * as ExpoDevice from 'expo-device'

import base64 from 'react-native-base64'

const HEART_RATE_UUID = 'aabbccdd-1234-5678-9101-112233445566'
const HEART_RATE_CHARACTERISTIC = 'aabbccdd-1234-5678-9101-112233445569'

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>
  scanForPeripherals(): void
  connectToDevice: (deviceId: Device) => Promise<void>
  disconnectFromDevice: () => void
  connectedDevice: Device | null
  allDevices: Device[]
  heartRate: number
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), [])
  const [allDevices, setAllDevices] = useState<Device[]>([])
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null)
  const [heartRate, setHeartRate] = useState<number>(0)

  const sendWiFiCredentials = async (device, credentials) => {
    try {
      const payload = base64.encode(JSON.stringify(credentials))
      // Attempt to send credentials
      await device.writeCharacteristicWithResponseForService(HEART_RATE_UUID, HEART_RATE_CHARACTERISTIC, payload)
      console.log('Wi-Fi credentials sent successfully!')
      console.log('Credentials sent. Waiting for device to connect to Wi-Fi...')
    } catch (error) {
      console.error('Failed to send Wi-Fi credentials:', error)
    }
  }

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, {
      title: 'Location Permission',
      message: 'Bluetooth Low Energy requires Location',
      buttonPositive: 'OK'
    })
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK'
      }
    )
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK'
      }
    )

    return (
      bluetoothScanPermission === 'granted' &&
      bluetoothConnectPermission === 'granted' &&
      fineLocationPermission === 'granted'
    )
  }

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'Location Permission',
          message: 'Bluetooth Low Energy requires Location',
          buttonPositive: 'OK'
        })
        return granted === PermissionsAndroid.RESULTS.GRANTED
      } else {
        const isAndroid31PermissionsGranted = await requestAndroid31Permissions()

        return isAndroid31PermissionsGranted
      }
    } else {
      return true
    }
  }

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error)
      }
      setAllDevices((prevState: Device[]) => {
        if (!isDuplicteDevice(prevState, device)) {
          return [...prevState, device]
        }
        return prevState
      })
    })

  // const connectToDevice = async (device: Device) => {
  //   try {
  //     const deviceConnection = await bleManager.connectToDevice(device.id)
  //     setConnectedDevice(deviceConnection)
  //     await deviceConnection.discoverAllServicesAndCharacteristics()
  //     bleManager.stopDeviceScan()
  //     startStreamingData(deviceConnection)
  //   } catch (e) {
  //     console.log('FAILED TO CONNECT', e)

  //     setTimeout(async () => {
  //       try {
  //         const deviceConnection = await bleManager.connectToDevice(device.id)
  //         setConnectedDevice(deviceConnection)
  //         await deviceConnection.discoverAllServicesAndCharacteristics()
  //         bleManager.stopDeviceScan()
  //         startStreamingData(deviceConnection)
  //       } catch (e) {
  //         console.log('Retry failed:', e)
  //       }
  //     }, 5000)
  //   }
  // }

  //with ssid and pass

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id)
      setConnectedDevice(deviceConnection)
      await deviceConnection.discoverAllServicesAndCharacteristics()
      bleManager.stopDeviceScan()

      const hotspotCredentials = {
        ssid: 'Galaxy A21s81A9',
        password: 'nndn9230'
      }

      await sendWiFiCredentials(deviceConnection, hotspotCredentials)

      console.log('Credentials sent. Waiting for device to connect to Wi-Fi...')
    } catch (e) {
      console.log('FAILED TO CONNECT', e)
    }
  }

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id)
      setConnectedDevice(null)
      setHeartRate(0)
    }
  }

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    heartRate
  }
}

export default useBLE
